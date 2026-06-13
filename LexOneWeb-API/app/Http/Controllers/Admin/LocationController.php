<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;
use App\Models\Location;
use Illuminate\Support\Str;

class LocationController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}
	public function index(Request $request)
	{	
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = "name";
		$search = "";
		$paginate = Location::paginate($perPage);
		if ($sortby && $sortorder) { 
			$location = Location::get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			if ($sortorder == 'asc') {
				$location = Location::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		} else {
			$location = Location::orderBy('created_at', 'desc')->get()->toArray();
		}
		$settings = Setting::orderBy('_id', 'desc')->first();
		$cities = array_slice($location, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
		return view('admin.location.index', ['cities' => $cities, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search,'settings'=>$settings]);
	}

	public function create()
	{	
		$location = Location::first();
		$settings = Setting::orderBy('_id', 'desc')->first();
		if ($settings->instantLocation == "false") {
			return view('admin.location.create',['location'=>$location]);
		}
		else{
			$notification = array(
				'message' => trans('messages.Cannot add city while instant location is enabled'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->route('location.index');
		}
		
	}
	public function store(Request $request)
	{	
		// ...................Validation starts here...............
		$settings = Setting::orderBy('_id', 'desc')->first();
		if ($settings->instantLocation == 'false') {
			$this->validate(
				$request,
				[
					'state' => 'required',
					'city' => 'required',
				],
				[
					'state.required' => __('messages.State is required.'),
					'city.regex' => __('messages.City is required.'),
				]
			);
			
			$names = $request->city;
			$locations = Location::get();
			foreach($locations as $location){
				$city =  ucwords($location->city);
				if ($location) {
					foreach($names as $name){
						$name =  ucwords($name);
						if ($city == $name){
							$notification = array(
								'message' => trans('messages.City Already Exists'),
								'alert-type' => 'error',
							);
							session()->put('notification', $notification);
							return redirect()->back();
						}
					}
				}
			}
			foreach ($request->city as $city) {
				$location = new Location();
				$country = explode('-',$request->alphacode);
				$location->country = $country[1];
				$location->alphaCode = $country[0];
				$location->state = $request->state;
				$location->city = $city;
				$location->save();
			}
			if ($location->save()) {
				$notification = array(
					'message' => __('messages.Location has been created successfully'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => __('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}
			session()->put('notification', $notification);
			return redirect()->route('location.index');
		}
		else{
			$this->validate(
				$request,
				[
					'maxDistance' => 'numeric|between:0,999999.99',
					'rideDistance' => 'numeric|between:0,999999.99',
				],
			);
			$settings->maxDistance = (float)$request->maxDistance;
			$settings->rideDistance = (float)$request->rideDistance;
			if ($settings->save()) {
				$notification = array(
					'message' => trans('messages.Settings has been saved successfully'),
					'alert-type' => 'success',
				);
			} 
			else {
				$notification = array(
					'message' => trans('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}
			session()->put('notification', $notification);
			return redirect()->route('location.index');
		}
		
		
	}

	public function destroy($id)
    {
        Location::destroy($id);
        $notification = array(
			'message' => trans('messages.Location has been deleted'),
			'alert-type' => 'error',
		);
		session()->put('notification', $notification);
		return redirect()->back();
	}

	public function truncate()
    {
		Location::truncate();
		return redirect()->route('location.create');
	}
	public function search(Request $request)
	{	
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$search =$request->input('search');
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = (!$request->input('search_for')) ? "city" : $request->input('search_for');
		if ($search) {
			$paginate = Location::where($search_for, 'like', "%$search%")->paginate($perPage);
			$location = Location::where($search_for, 'like', "%$search%")->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
		} else {
			$search = "";
			$paginate = Location::paginate($perPage);
			$location = Location::orderBy('created_at', 'desc')->get()->toArray();
			if ($sortorder == 'asc') {
				$location = Location::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			} 
		}
		$settings = Setting::orderBy('_id', 'desc')->first();
		$cities = array_slice($location, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for ));
		return view('admin.location.index', compact(['cities', 'search', 'sortby', 'sortorder', 'pagination','search_for','settings']));
	}

}