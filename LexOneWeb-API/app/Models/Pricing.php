<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Pricing extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'pricings';
    protected $fillable = [
        'price', //    int
        'taskerId',
        'mainCategory', 
        'subCategory',
        'serviceId', 
    ];
}
