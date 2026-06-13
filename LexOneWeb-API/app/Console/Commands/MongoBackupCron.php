<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MongoBackupCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:mongo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup MongoDB database and upload to AWS S3 with 7-day retention';

    /**
     * Get backup retention period in days.
     *
     * @return int
     */
    protected function getRetentionDays(): int
    {
        return (int) env('MONGO_BACKUP_RETENTION_DAYS', 7);
    }

    /**
     * Get S3 folder for backups.
     *
     * @return string
     */
    protected function getS3Folder(): string
    {
        return env('MONGO_BACKUP_S3_FOLDER', 'mongodb-backups');
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting MongoDB backup...');

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $database = env('DB_DATABASE');
        $backupFileName = "mongodb_backup_{$database}_{$timestamp}";
        $localBackupPath = storage_path("app/backups/{$backupFileName}");
        $archivePath = "{$localBackupPath}.gz";

        // Ensure backup directory exists
        if (!is_dir(storage_path('app/backups'))) {
            mkdir(storage_path('app/backups'), 0755, true);
        }

        try {
            // Step 1: Create MongoDB backup using mongodump
            $this->info('Running mongodump...');
            $dumpResult = $this->createMongoBackup($archivePath);

            if (!$dumpResult) {
                $this->error('Failed to create MongoDB backup');
                return 1;
            }

            // Step 2: Upload to S3
            $this->info('Uploading backup to S3...');
            $s3Path = $this->uploadToS3($archivePath, $backupFileName);

            if (!$s3Path) {
                $this->error('Failed to upload backup to S3');
                return 1;
            }

            $this->info("Backup uploaded successfully to: {$s3Path}");

            // Step 3: Clean up old backups from S3 (older than retention period)
            $this->info('Cleaning up old backups...');
            $deletedCount = $this->cleanupOldBackups();
            $this->info("Deleted {$deletedCount} old backup(s) from S3");

            // Step 4: Remove local backup file
            if (file_exists($archivePath)) {
                unlink($archivePath);
                $this->info('Local backup file removed');
            }

            $this->info('MongoDB backup completed successfully!');
            \Log::info("MongoDB backup completed: {$s3Path}");

            return 0;

        } catch (\Exception $e) {
            $this->error('Backup failed: ' . $e->getMessage());
            \Log::error('MongoDB backup failed: ' . $e->getMessage());

            // Clean up local file on failure
            if (file_exists($archivePath)) {
                unlink($archivePath);
            }

            return 1;
        }
    }

    /**
     * Create MongoDB backup using mongodump.
     *
     * @param string $archivePath
     * @return bool
     */
    protected function createMongoBackup(string $archivePath): bool
    {
        $host = env('DB_HOST', 'localhost');
        $port = env('DB_PORT', '27017');
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $dsn = env('DB_DSN');

        // Build mongodump command
        if ($dsn) {
            // Use DSN if available (for MongoDB Atlas or complex connection strings)
            $command = sprintf(
                'mongodump --uri="%s" --archive="%s" --gzip',
                $dsn,
                $archivePath
            );
        } else {
            // Build command from individual parameters
            $command = sprintf(
                'mongodump --host=%s --port=%s --db=%s',
                escapeshellarg($host),
                escapeshellarg($port),
                escapeshellarg($database)
            );

            if ($username && $password) {
                $command .= sprintf(
                    ' --username=%s --password=%s --authenticationDatabase=%s',
                    escapeshellarg($username),
                    escapeshellarg($password),
                    escapeshellarg($database)
                );
            }

            $command .= sprintf(' --archive=%s --gzip', escapeshellarg($archivePath));
        }

        // Execute mongodump
        $output = [];
        $returnCode = 0;
        exec($command . ' 2>&1', $output, $returnCode);

        if ($returnCode !== 0) {
            $this->error('mongodump failed: ' . implode("\n", $output));
            \Log::error('mongodump failed: ' . implode("\n", $output));
            return false;
        }

        if (!file_exists($archivePath)) {
            $this->error('Backup file was not created');
            return false;
        }

        $fileSize = $this->formatBytes(filesize($archivePath));
        $this->info("Backup created: {$fileSize}");

        return true;
    }

    /**
     * Upload backup file to S3.
     *
     * @param string $localPath
     * @param string $fileName
     * @return string|null
     */
    protected function uploadToS3(string $localPath, string $fileName): ?string
    {
        $s3Path = "{$this->getS3Folder()}/{$fileName}.gz";

        try {
            $fileContent = file_get_contents($localPath);
            Storage::disk('s3')->put($s3Path, $fileContent);

            return $s3Path;
        } catch (\Exception $e) {
            $this->error('S3 upload error: ' . $e->getMessage());
            \Log::error('S3 upload error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Clean up backups older than retention period.
     *
     * @return int Number of deleted files
     */
    protected function cleanupOldBackups(): int
    {
        $deletedCount = 0;
        $cutoffDate = Carbon::now()->subDays($this->getRetentionDays());

        try {
            $files = Storage::disk('s3')->files($this->getS3Folder());

            foreach ($files as $file) {
                // Extract date from filename (format: mongodb_backup_dbname_YYYY-MM-DD_HH-ii-ss.gz)
                if (preg_match('/(\d{4}-\d{2}-\d{2})_\d{2}-\d{2}-\d{2}\.gz$/', $file, $matches)) {
                    $fileDate = Carbon::createFromFormat('Y-m-d', $matches[1]);

                    if ($fileDate->lt($cutoffDate)) {
                        Storage::disk('s3')->delete($file);
                        $this->line("Deleted old backup: {$file}");
                        $deletedCount++;
                    }
                }
            }
        } catch (\Exception $e) {
            $this->warn('Error cleaning up old backups: ' . $e->getMessage());
            \Log::warning('Error cleaning up old backups: ' . $e->getMessage());
        }

        return $deletedCount;
    }

    /**
     * Format bytes to human readable format.
     *
     * @param int $bytes
     * @return string
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.2f %s", $bytes / pow(1024, $factor), $units[$factor]);
    }
}
