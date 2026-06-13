<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Countries extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'countries';
    protected $fillable = [
        'id', //    int
        'sortname',
        'name', 
    ];
}
