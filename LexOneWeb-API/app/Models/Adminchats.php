<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Adminchats extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'adminchats';
    protected $fillable = [
        'msg_type', 'msg_from', 'msg_data', 'msg_at'
    ];
}
