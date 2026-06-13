<?php
namespace App\Http\Controllers\Admin;
// Added by vishnu kumar
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Bookingdetail;
use App\Models\User;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Service;
use App\Models\Review;
use App\Models\Setting;
use Illuminate\Support\Str;
use File;
use Carbon\Carbon;

class NeedsController extends Controller
{
	public function index(Request $request)
	{
		$expired = 0;
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $search_for = "name";
        $date = Carbon::now(); 
		$start = $date->copy()->startOfDay();
		//old
		//$paginate = Booking::where('bookedType', 'userneeds')->paginate($perPage);
		// $booking = Booking::where('bookedType', 'userneeds')->get()->toArray();

		// $paginate = Booking::orWhere(function ($query) {
		// 	$date = Carbon::now(); 
		// 	$start = $date->copy()->startOfDay();
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["requested"])
        //     ->where('bookedWhen','>=',$start);
        // })->orWhere(function ($query) {
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["started", "accepted","cancelled","completed","paid","refunded"]);
        // })->paginate($perPage);
		//new
		$paginate = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds'])
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->paginate($perPage);

		//old
		// $booking = Booking::orWhere(function ($query) {
		// 	$date = Carbon::now(); 
		// 	$start = $date->copy()->startOfDay();
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["requested"])
        //     ->where('bookedWhen','>=',$start);
        // })->orWhere(function ($query) {
        //     return $query
        //     ->whereIn('bookedType', ['userneeds']) 
        //     ->whereIn('status', ["started", "accepted","cancelled","completed","paid","refunded"]);
        // })->get()->toArray();
		//new
		$booking = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds']) 
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->get()->toArray();
		$booking = array_reverse($booking);
        $users = User::all();
		$userNeeds = array_slice($booking, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('search_for' => $search_for));
		return view('admin.needs.index', ['userNeeds' => $userNeeds,'booking' => $booking,'users'=>$users,'pagination' => $pagination,'search_for'=>$search_for,'expired'=>$expired,'start'=>$start]);
	}
	
	public function select(Request $request)
    {	
    	$perPage = 10;
    	$expired = 0;
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$search_for = (!$request->input('search_for')) ? "all" : $request->input('search_for');
		$date = Carbon::now(); 
		$start = $date->copy()->startOfDay();
		//old
        // $paginate = Booking::orWhere(function ($query) {
		// 	$date = Carbon::now(); 
		// 	$start = $date->copy()->startOfDay();
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["requested"])
        //     ->where('bookedWhen','>=',$start);
        // })->orWhere(function ($query) {
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["started", "accepted","cancelled","completed","paid","refunded"]);
        // })->paginate($perPage);
		//new
		$paginate = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds'])
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->paginate($perPage);
		//old
		// if($request->search_for == "all" || $request->search_for == ""){
		// 	$booking = Booking::orWhere(function ($query) {
		// 	$date = Carbon::now(); 
		// 	$start = $date->copy()->startOfDay();
        //     return $query
        //     ->whereIn('bookedType', ['userneeds'])
        //     ->whereIn('status', ["requested"])
        //     ->where('bookedWhen','>=',$start);
        // })->
		//new
		if($request->search_for == "all" || $request->search_for == ""){
			$booking = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds'])
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->get()->toArray();
			$booking = array_reverse($booking);
			$statusSelect = 'all';
		}
		elseif($request->search_for == 'expired'){
			$paginate = Booking::where('bookedType', 'userneeds')->where('status','requested')->where('bookedWhen','<',$start)->paginate($perPage);
			$booking = Booking::where('bookedType', 'userneeds')->where('status','requested')->where('bookedWhen','<',$start)->get()->sortByDesc("updatedAt", SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			$expired = 1;
		}
		else{
			//old
			// $paginate = Booking::where('bookedType', 'userneeds')->where('status',$request->search_for)->where('bookedWhen','>=',$start)->paginate($perPage);
			// $booking = Booking::where('bookedType', 'userneeds')->where('bookedWhen','>=',$start)->where('status',$request->search_for)->get()->toArray();
			//new
			$paginate = Booking::where('bookedType', 'userneeds')->where('status',$request->search_for)->paginate($perPage);
			$booking = Booking::where('bookedType', 'userneeds')->where('status',$request->search_for)->get()->toArray();
			$booking = array_reverse($booking);
			$search_for = $request->search_for;
		}
        $users = User::all();
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        $userNeeds = array_slice($booking, $perPage * ($page - 1), $perPage);
        $pagination = $paginate->appends(array('search_for' => $search_for));
		return view('admin.needs.index', ['userNeeds' => $userNeeds,'booking' => $booking,'users'=>$users,'pagination' => $pagination,'search_for'=>$search_for,'expired'=>$expired,'start'=>$start]);
    }
    
	public function show(Request $request, $id)
	{
        $needs = Booking::findOrFail($id);
		$user = User::where('_id', $needs->userId)->first();
		$tasker = User::where('_id', $needs->taskerId)->first();
		$category = Category::where('_id',$needs->mainCategory)->first();
		$subCategory = Subcategory::where('_id',$needs->subCategory)->first();
		$reviews = Review::where('bookingId',$needs->id)->get()->toArray();
		$bookingdetails = Bookingdetail::where('bookingId',new \MongoDB\BSON\ObjectID($id))->get();
		$services = null;
        foreach($bookingdetails as $bookingdetail){
            $services[] = Service::where('_id',$bookingdetail->serviceId)->first();
        }
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        if ($needs->bookedWhen != null) {
            $milliseconds = (string) $needs->bookedWhen;
            $utcdatetime = new \MongoDB\BSON\UTCDateTime($milliseconds);
			$datetime = $utcdatetime->toDateTime();
			$bookedWhen = $datetime->format('d-M-Y');
			$bookedTimestamp = strtotime($bookedWhen);
        }

        $date = Carbon::now(); 
		$start = $date->copy()->startOfDay();
		$todayTimestamp = strtotime($start);
		$jobstatus = $needs->status;
		if($bookedTimestamp < $todayTimestamp){
			$jobstatus = "expired";
		}

		return view('admin.needs.show', ['bookingdetails'=>$bookingdetails,'needs' => $needs,'user' => $user,'bookedWhen'=>$bookedWhen,'tasker'=>$tasker,'category'=>$category,'subCategory'=>$subCategory,'reviews'=>$reviews,'services'=>$services,'currencySymbol'=>$currencySymbol,'jobstatus'=>$jobstatus]);
    }
    
    public function changeStatus($id, $needStatus)
	{
        $booking = Booking::findOrFail($id);
		$booking->needStatus = (int)$needStatus;
		$booking->save();
		if ($booking->needStatus == 1) {
			$notification = array(
				'message' => __('messages.Need has been Enabled'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => __('messages.Need has been Disabled'),
				'alert-type' => 'error',
			);
		}
		session()->put('notification', $notification);
		return redirect()->back();
	}
	
}