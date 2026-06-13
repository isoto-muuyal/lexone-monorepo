<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Devices extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'devices';
    protected $fillable = [
        'device_id', 
        'device_model', 
        'device_token',
        'fcm_token', 
        'device_type', 
        'user_id', 
        'notified_at',
        'userType',
    ];
}
