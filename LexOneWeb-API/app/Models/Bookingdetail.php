<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Tasker;

class Bookingdetail extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'bookingdetails';
    protected $fillable = [
        'pricing', 
        'quantity',  
        'serviceId', 
        'price',
        'total', 
        'bookingId', 
    ];
}
