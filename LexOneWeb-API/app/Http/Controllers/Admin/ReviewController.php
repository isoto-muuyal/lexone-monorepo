<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Hash;
use App\Models\Booking;
use App\Models\Category;
use App\Models\User;
use App\Models\Review;

class ReviewController extends Controller
{
	public function index(Request $request,$id)
	{	
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;	
		$paginate = Review::where('taskerId',new \MongoDB\BSON\ObjectID($id))->paginate($perPage);
		$sortby = $request->input('sort');
        $sortorder = $request->input('direction');
        $search_for = "name";
        $search = "";	
		$user = null;
		$tasker = User::findOrFail($id);
		$review = Review::where('taskerId',new \MongoDB\BSON\ObjectID($id))->get()->toArray();

		$reviewUsers = [];
		foreach($review as $userView){
			if(!in_array($userView['userId'], $reviewUsers))
			{
				$user[] = User::where('_id',new \MongoDB\BSON\ObjectID($userView['userId']))->first();
				array_push($reviewUsers, $userView['userId']);
			}
		}
		$reviews = array_slice($review, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
		return view('admin.review.index', ['pagination' => $pagination,'reviews' => $reviews,'user' => $user,'tasker' => $tasker]);
	}

	public function categoryReview(Request $request,$id)
	{	
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;	
		$paginate = Review::where('mainCategory',new \MongoDB\BSON\ObjectID($id))->paginate($perPage);
		$sortby = $request->input('sort');
        $sortorder = $request->input('direction');
        $search_for = "name";
        $search = "";	
		$userNames = null;
		$category = Category::findOrFail($id);
		$review = Review::where('mainCategory',new \MongoDB\BSON\ObjectID($id))->get()->toArray();
		$userNames = User::all();
		$reviews = array_slice($review, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
		return view('admin.review.categoryReview', ['pagination' => $pagination,'reviews' => $reviews,'category' => $category,'userNames' => $userNames]);
	}

}