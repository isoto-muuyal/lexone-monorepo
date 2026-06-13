<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Kyslik\ColumnSortable\Sortable;

class Location extends Eloquent
{
    use Sortable;
    protected $connection = 'mongodb';
    protected $collection = 'cities';
    protected $fillable = [
        'country', 
        'state',
        'city' 
    ];
   
}
