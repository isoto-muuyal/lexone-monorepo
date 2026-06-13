<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class States extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'states';
    protected $fillable = [
        'id', //    int
        'name',
        'country_id', 
    ];
}
