<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class BannerImage extends Eloquent
{
	
	protected $connection = 'mongodb';
	protected $collection = 'bannerimages';
	protected $fillable = [
		"id",
		"url", 
		"name",
		"status",
	];
	
}
