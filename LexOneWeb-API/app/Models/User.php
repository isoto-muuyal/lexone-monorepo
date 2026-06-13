<?php
namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use Kyslik\ColumnSortable\Sortable;

class User extends Eloquent
{
	use Sortable;
	protected $connection = 'mongodb';
	protected $collection = 'users';
	protected $primaryKey = "_id";
	protected $fillable = [
		'userId',
		'name',
		'email',
		'password',
		'mobile',
		'role',	
		'location',
		'image', // default value
		'deviceMode',// default value
		'deviceActive',// default value
		'devicePlatform',
	];
	public $sortable = ['name', 'email', 'mobile','createdAt'];
}
