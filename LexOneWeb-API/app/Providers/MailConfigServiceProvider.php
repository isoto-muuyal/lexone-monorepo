<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Config;
use Illuminate\Support\Facades\DB;

class MailConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        
        if (\Schema::hasTable('settings')) {
            $settings = DB::table('settings')->first();
            if($settings['smtpStatus'] == 0)
            {
                $encryption = 'tls';
            }
            else{
                $encryption = 'ssl' ;
            }
            // print_r($settings);die;
            if ($settings){
        //Set the data in an array variable from settings table
        
            $mailConfig = [
                'transport' => 'smtp',
                'host' => $settings['smtpHost'],
                'port' => $settings['smtpPort'],
                'encryption' => $encryption,
                'username' => $settings['smtpEmail'],
                'password' => $settings['smtpPassword'],
                'timeout' => null
            ];
        //To set configuration values at runtime, pass an array to the config helper
            // Config(['mail.mailers.smtp' => $mailConfig]);
            Config::set('mail.mailers.smtp', $mailConfig);

            }
        }
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
