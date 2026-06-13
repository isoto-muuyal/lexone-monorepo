<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Need extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'helps';
    protected $fillable = [
        'name', 
        'description',
        'type' // 1->Users, 2->Taskers
        
    ];
   
}
