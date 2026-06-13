<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Review extends Eloquent
{
	protected $connection = 'mongodb';
	protected $collection = 'reviews';
	protected $primaryKey = "_id";
	protected $fillable = [
		'userId',
		'taskerId',
		'mainCategory',
		'bookingId',
		'rating',
		'description',	
    ];
}