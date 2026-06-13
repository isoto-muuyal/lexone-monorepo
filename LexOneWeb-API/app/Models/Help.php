<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Help extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'helps';
    protected $fillable = [
        'name', 
        'description',
        'type', // 1->Users, 2->Taskers
        'lang'
        
    ];
   
}
