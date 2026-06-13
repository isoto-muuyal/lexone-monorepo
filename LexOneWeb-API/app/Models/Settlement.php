<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Settlement extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'settlements';
    protected $fillable = [
        'bookingId', 
        'transactionId',
        'amount',
        'description',
    ];
   
}
