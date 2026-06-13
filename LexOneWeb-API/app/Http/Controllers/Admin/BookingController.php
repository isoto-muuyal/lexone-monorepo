<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Bookingdetail;
use App\Models\User;
use App\Models\Setting;
use App\Models\Service;
use App\Models\Category;
use App\Models\Subcategory;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $sortby = $request->input('sort');
        $sortorder = $request->input('direction');
        $search_for = "name";
        $search = "";
        $paginate = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['professional', 'marketplace'])
            ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
        })->orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds'])
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->paginate($perPage);
        if ($sortby && $sortorder) {
            $booking = Booking::orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['professional', 'marketplace'])
                ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
            })->orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['userneeds'])
                ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
            })->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
            if ($sortorder == 'asc') {
                $booking = Booking::orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['professional', 'marketplace'])
                    ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
                })->orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['userneeds'])
                    ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
                })->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
            }
        } 
        else {
            $search_for = 'all';
            
            $booking = Booking::orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['professional', 'marketplace'])
                ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
            })->orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['userneeds'])
                ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
            })->get()->toArray();
            
            $users = Booking::orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['professional', 'marketplace'])
                ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
            })->orWhere(function ($query) {
                return $query
                ->whereIn('bookedType', ['userneeds'])
                ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
            })->get();
            $booking = array_reverse($booking);
        }
        $users = User::all();
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        $bookings = array_slice($booking, $perPage * ($page - 1), $perPage);
        $pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
        return view('admin.booking.index', ['bookings' => $bookings, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search,'users' => $users,'currencySymbol' => $currencySymbol]);
    }
    
    public function select(Request $request)
    {
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $sortby = $request->input('sort');
        $sortorder = $request->input('direction');
        $search_for = (!$request->input('search_for')) ? "all" : $request->input('search_for');
        $search = "";
        $paginate = Booking::orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['professional', 'marketplace'])
            ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
        })->orWhere(function ($query) {
            return $query
            ->whereIn('bookedType', ['userneeds'])
            ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
        })->paginate($perPage);
        if ($sortby && $sortorder) {

            if($request->search_for == "all" || $request->search_for == ""){
                $booking = Booking::orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['professional', 'marketplace'])
                    ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
                })->orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['userneeds'])
                    ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
                })->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
                $booking = array_reverse($booking);
                $statusSelect = 'all';
                
            }
            else
            {
                $paginate = Booking::whereIn('status', [$search_for])->paginate($perPage);

                $booking = Booking::whereIn('status', [$search_for])->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();

                if($sortorder === 'desc'){
                    $booking = Booking::whereIn('status', [$search_for])->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
                }
                

                 if($search_for === "requested"){
                    $paginate = Booking::where('bookedType',"!=","userneeds")->whereIn('status', [$search_for])->paginate($perPage);

                    $booking = Booking::where('bookedType',"!=","userneeds")->whereIn('status', [$search_for])->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();

                    if($sortorder === 'desc'){
                        $booking = Booking::where('bookedType',"!=","userneeds")->whereIn('status', [$search_for])->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
                    }
                }

                $booking = array_reverse($booking);
                $search_for = $request->search_for;
            }
            
        } 
        else{

            if($request->search_for == "all" || $request->search_for == ""){
                $booking = Booking::orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['professional', 'marketplace'])
                    ->whereIn('status', ["requested", "started", "accepted","cancelled","completed","paid","refunded"]);
                })->orWhere(function ($query) {
                    return $query
                    ->whereIn('bookedType', ['userneeds'])
                    ->whereIn('status', ["requested","started", "accepted","cancelled","completed","paid","refunded"]);
                })->get()->toArray();
                $booking = array_reverse($booking);
                $statusSelect = 'all';
                
            }
            else{
                $paginate = Booking::whereIn('status', [$search_for])->paginate($perPage);
                $booking = Booking::whereIn('status', [$search_for])->get()->toArray();
                // if($search_for === "requested"){
                //     $paginate = Booking::where('bookedType',"!=","userneeds")->whereIn('status', [$search_for])->paginate($perPage);
                //     $booking = Booking::where('bookedType',"!=","userneeds")->whereIn('status', [$search_for])->get()->toArray();
                // }
                $booking = array_reverse($booking);
                $search_for = $request->search_for;
            }
        }
        $users = User::all();
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        $bookings = array_slice($booking, $perPage * ($page - 1), $perPage);
        $pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
        return view('admin.booking.index', ['bookings' => $bookings, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search,'users' => $users,'currencySymbol' => $currencySymbol]);
    }
    
    public function show($id)
    {	
        $services = null;
        $booking = Booking::findOrFail($id);
        $users = User::all();
        $bookingdetails = Bookingdetail::where('bookingId',new \MongoDB\BSON\ObjectID($id))->get();
        $category = Category::where('_id',$booking->mainCategory)->first();
        $subCategory = Subcategory::where('_id',$booking->subCategory)->first();
        foreach($bookingdetails as $bookingdetail){
            $services[] = Service::where('_id',$bookingdetail->serviceId)->first();
        }
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        return view('admin.booking.show', ['category'=>$category,'subCategory' => $subCategory,'booking' => $booking,'bookingdetails' => $bookingdetails,'users' => $users,'services' => $services,'currencySymbol' => $currencySymbol]);
    }

}
