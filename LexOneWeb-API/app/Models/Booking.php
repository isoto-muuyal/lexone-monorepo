<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\Tasker;

class Booking extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'bookings';
    protected $fillable = [
        'bookedName', 
        'bookedWhere',  
        'bookedWhen', 
        'bookedFor',
        'bookedType', 
        'userId', 
        'taskerId',
        'mainCategory', 
        'subCategory',
        'serviceId', 
        'otp', 
        'commission',
        'tax', 
        'price',
        'total', 
        'paymentId', 
        'status', 
        'needStatus', 
        'payoutDate'
    ];
   
}
