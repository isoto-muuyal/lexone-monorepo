<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Str;
class Log extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'logs';
    protected $fillable = [
        'msg_type', 'serviceId', 'isAdmin', 'senderId', 'receiverId', 'bookingId', 'messageTxt', 'currency','createdAt','logId'
    ];
    public static function boot()
    {
        parent::boot();

        static::creating(function($log) {
            $log->logId = (string) Str::uuid();
        });
    }
}
