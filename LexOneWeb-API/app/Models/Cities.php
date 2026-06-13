<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Cities extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'newcities';
    protected $fillable = [
        'id', //    int
        'name',
        'state_id', 
    ];
}
