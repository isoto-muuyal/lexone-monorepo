<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Media extends Eloquent
{
   
    protected $connection = 'mongodb';
    protected $collection = 'uploads';
    protected $fillable = [ 'media_name','name','for','taskerId' ];
   
}
