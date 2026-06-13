<?php

namespace App\Models;
use App\Models\Category;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Service extends Eloquent
{
	
	protected $connection = 'mongodb';
	protected $collection = 'services';
	protected $primaryKey = '_id';
	protected $fillable = [
		'name',
		"frenchName", 
		"arabicName",
		'type',
		'mainCategory',
		"subCategory",
		"serviceCost",
		"status",
		"costType",// 1=>fixed_price, 2=>Per_hour
	];
	
}



