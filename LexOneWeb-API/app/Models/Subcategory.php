<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Subcategory extends Eloquent
{
	
	protected $connection = 'mongodb';
	protected $collection = 'subcategories';
	protected $fillable = [
		'name',"frenchName", "arabicName", 'type',"image","status","parentCategory"
	];
	
}
