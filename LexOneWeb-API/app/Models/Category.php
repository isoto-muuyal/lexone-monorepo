<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Category extends Eloquent
{
	
	protected $connection = 'mongodb';
	protected $collection = 'categories';
	protected $fillable = [
		'name',"frenchName", "arabicName", 'type',"image","status","featured","locationType"
	];
	
}
