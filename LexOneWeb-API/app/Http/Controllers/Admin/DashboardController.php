<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Classes\MyClass;
use App\Models\User;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Service;
use App\Models\Setting; 
use App\Models\Adminchats;
use App\Models\Bookingdetail;
use App\Models\Settlement;
use DB;
use Carbon\Carbon;
use MongoDB\BSON\ObjectID;
use Stichoza\GoogleTranslate\GoogleTranslate;


class DashboardController extends Controller
{
    public function home()
    {       
        $totalrevenue = 0;
        $totalearnings = 0;
        $todayearnings = 0;
        $totalsettlements = 0;
        $settings = Setting::first();
        $bookings = Booking::count();
        $todaystarts = Carbon::now()->startOfDay();
        $todayends = Carbon::now()->endOfDay();
        $cancelledbookings = Booking::where('status','cancelled')->count();
        $jobs = Booking::where('bookedType','userneeds')->count();
        $pendingjobs = Booking::where('bookedType','userneeds')->where('status','requested')->count();
        $totalbookings = Booking::whereIn('status',['completed','paid','started'])->get();
        $todaybookings = Booking::whereBetween('createdAt',[$todaystarts,$todayends])->whereIn('status',['completed','paid','started'])->get();
        $settlements = Settlement::get();

        foreach($totalbookings as $booking){
            $revenue[] = $booking->total;
            $totalrevenue = array_sum($revenue);
            $earnings[] = (int)$booking->commission + (int)$booking->tax;
            $totalearnings = array_sum($earnings);
        }

        $commission = 0;
        $tax = 0;
        foreach($todaybookings as $b){
            $commission += $b->commission;
            $tax += $b->tax;
        }
        $todayearnings = $commission + $tax;
        foreach($settlements as $settlement){
            $settledamounts[] = $settlement->amount;
            $totalsettlements = array_sum($settledamounts);
        }
        
        $dateNow = Carbon::now(); 
        $startOfYear = $dateNow->startOfYear();  
        $dateNow = Carbon::now(); 
        $endOfYear = $dateNow->endOfYear();   
        $monthlylabels = ["Jan","Feb","Mar","Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        $usercount = [0,0,0,0,0,0,0,0,0,0,0,0];
        $taskercount = [0,0,0,0,0,0,0,0,0,0,0,0];
        $bookingcount = [0,0,0,0,0,0,0,0,0,0,0,0];
        $categorycount = [0,0,0,0,0,0,0,0,0,0,0,0];
        $topcategoriescount = [0,0,0,0,0,0,0,0,0,0,0,0];
        $toptaskerscount = [0,0,0,0,0,0,0,0,0,0,];
        
        $users = User::raw()->aggregate([
            [ '$match' => [
                'createdAt' => [ '$gte' => new \MongoDB\BSON\UTCDateTime($startOfYear) ,'$lte' => new \MongoDB\BSON\UTCDateTime($endOfYear) ],
                'role'=>'user',
              ]],
            
              [ '$group' => [
                '_id' => [ '$dateToString' => [ 'format' => '%m', 'date' => '$createdAt' ] ],
                'count' => [ '$sum' => 1 ]
              ]]
        ]);

        $taskers = User::raw()->aggregate([
            [ '$match' => [
                'createdAt' => [ '$gte' => new \MongoDB\BSON\UTCDateTime($startOfYear) ,'$lte' => new \MongoDB\BSON\UTCDateTime($endOfYear) ],
                'role'=>'tasker',
              ]],
            
              [ '$group' => [
                '_id' => [ '$dateToString' => [ 'format' => '%m', 'date' => '$createdAt' ] ],
                'count' => [ '$sum' => 1 ]
              ]]
        ]);

        $totalbookings = Booking::raw()->aggregate([
            [ '$match' => [
                'createdAt' => [ '$gte' => new \MongoDB\BSON\UTCDateTime($startOfYear) ,'$lte' => new \MongoDB\BSON\UTCDateTime($endOfYear) ],
              ]],

              [ '$group' => [
                '_id' => [ '$dateToString' => [ 'format' => '%m', 'date' => '$createdAt' ] ],
                'count' => [ '$sum' => 1 ]
              ]]
        ]);

        foreach ($users as $value) {
            if($value){
               $monthIndex = intval($value->_id);
               $usercount[$monthIndex - 1] = $value->count;
            }
        }

        foreach ($taskers as $value) {
            if($value){
               $monthIndex = intval($value->_id);
               $taskercount[$monthIndex - 1] = $value->count;
            }
        }

        foreach ($totalbookings as $value) {
            if($value){
               $monthIndex = intval($value->_id);
               $bookingcount[$monthIndex - 1] = $value->count;
            }
        }

        return view('admin.dashboard', compact(['settings','bookings','cancelledbookings','jobs','pendingjobs','totalrevenue','totalearnings','totalsettlements','todayearnings','monthlylabels','usercount','taskercount','bookingcount']));
    }

    public function insights()
    {   
        $booking_status_type = [];
        $booking_count_by_status = [];
        $engagedService = [];
        $serviceCount =[];
        $rating =[];
        $categoryName =[];
        $topTaskers = null;
        $serviceName =null;
        $response =null;

        $completed_data = Booking::select('status')
                    ->where('status','completed')->orWhere('status','cancelled')->orWhere('status','refunded')->get();
        
        $inprogress_data = Booking::select('status')
        ->where('status','requested')->orWhere('status','paid')->orWhere('status','accepted')->orWhere('status','started')->get();
       
        $booking_status_type[0] = 'Inprogress';
        $booking_status_type[1] = 'Completed';
        $booking_count_by_status[0] = count($inprogress_data);
        $booking_count_by_status[1] = count($completed_data);
        $categories = Category::where('status',1)->orderBy('rating', 'desc')->take(10)->get();
        foreach($categories as $category)
        {
            $rating[] = $category->rating;
            $categoryName[] = $category->name;
        }
        
        $topTaskers = User::where('role','tasker')->where('verified',1)->orderBy('rating', 'desc')->latest()->take(50)->get()->toArray();
        $engagedServices = Bookingdetail::select('serviceId')->groupBy('serviceId')->latest()->take(10)->get();
        foreach( $engagedServices as $Service){
            $serviceId = $Service->serviceId;
            $serviceName[] = Service::where('_id',$serviceId)->first();
            $response[] = Bookingdetail::raw()->aggregate([
                [   '$match' => ["serviceId" => $serviceId]],
                [   '$group' => [
                        '_id' => $serviceId,
                        'count' => [ '$sum' => 1 ]
                    ]
                ]
            ]);
        }

        if($serviceName != null){
            foreach($serviceName as $servicename){
                if($servicename != null){
                    $engagedService[] = $servicename->name;
                }
            }
        }
        if($response != null){
            foreach ($response as $value) {
                foreach($value as $v){
                    if($v){
                        $servicenames[] = (string)$v->_id;
                        $serviceCount[] = $v->count;
                    }
                }
            }
        }
        return view('admin.insights', compact(['booking_status_type','booking_count_by_status','engagedService','serviceCount','rating','categoryName','topTaskers']));
    }


    public function notification(Request $request)
    {
        $active_tab = "general";
        if($request->session()->exists('admin_profile_tab')){
            $active_tab = $request->session()->get('admin_profile_tab');
        }
        return view('admin/notification', ['active_tab' => $active_tab]);
    }

    // public function sendalert(Request $request, $dtype)
    // {
    
    //     $myClass = new MyClass();
    //     if ($dtype == 'ios') {

    //         $msg = $request->get('msg');

    //         $this->validate(
    //             $request,
    //             [
    //                 'msg' => 'required',
    //             ],
    //             [
    //                 'msg.required' => trans('messages.Enter message to send'),
    //             ]
    //         );
    //     }
    //     else if ($dtype == 'web') {

    //         $msg = $request->get('wmsg');

    //         $this->validate(
    //             $request,
    //             [
    //                 'wmsg' => 'required',
    //             ],
    //             [
    //                 'wmsg.required' => trans('messages.Enter message to send'),
    //             ]
    //         );
    //     }
    //     else {

    //         $msg = $request->get('msgg');

    //         $this->validate(
    //             $request,
    //             [
    //                 'msgg' => 'required',
    //             ],
    //             [
    //                 'msgg.required' => trans('messages.Enter message to send'),
    //             ]
    //         );
            
    //     }

    //     $userroles = [ $request->userType ];
    //     if($request->userType === "all"){
    //         $userroles = [ "user" , "tasker" ];
    //     }
    //     if ($dtype == 'ios') {
    //         $devices = User::where('devicePlatform', 'iOS')->where('deviceActive', 1)->whereIn('role',$userroles)->get();
    //     } 
    //     else if ($dtype == 'web') {
    //         $devices = User::where('devicePlatform', 'web')->where('deviceActive', 1)->whereIn('role',$userroles)->get();
    //     }
    //     else {
    //         $devices = User::where('devicePlatform', 'android')->where('deviceActive', 1)->whereIn('role',$userroles)->get();
    //     }
        
    //     $devicetoken = array();
    //     foreach ($devices as $device) {
    //         array_push($devicetoken, $device->deviceToken);
    //     }

    //     if (!empty($devicetoken)) 
    //     {
    //         if ($dtype == 'ios') {
    //             try {
    //                 $usernotification = $myClass->ios_push_notification($devicetoken, $msg, 'all');
    //             } catch (\Throwable $th) {
    //                     //  throw $th;
    //             }
    //         }
    //         else if ($dtype == 'web') {
    //             try {
    //                 $usernotification = $myClass->web_push_notification($devicetoken, $msg, 'all');
    //             } catch (\Throwable $th) {
    //                     //  throw $th;
    //             }
    //         }
    //         else
    //         {
    //             try {
    //                 $usernotification = $myClass->android_push_notification($devicetoken, $msg, 'all');
    //             } catch (\Throwable $th) {
    //                 //  throw $th;
    //             }
    //         }

    //         $message = new Adminchats();
    //         $message->msg_type = 'text';
    //         $message->msg_from = 'admin';
    //         $message->msg_platform = $dtype;
    //         $message->msg_to = $request->userType;
    //         $message->msg_data = $msg;
    //         $message->msg_at = time();
    //         $message->save();
    //     }

    //     return redirect(url()->previous());
    // }
    

    public function sendalert(Request $request, $dtype)
    {
        $myClass = new MyClass();
    
        if ($dtype == 'ios') {
            $msg = $request->get('msg');
            $this->validate($request, ['msg' => 'required'], ['msg.required' => trans('messages.Enter message to send')]);
        } else if ($dtype == 'web') {
            $msg = $request->get('wmsg');
            $this->validate($request, ['wmsg' => 'required'], ['wmsg.required' => trans('messages.Enter message to send')]);
        } else {
            $msg = $request->get('msgg');
            $this->validate($request, ['msgg' => 'required'], ['msgg.required' => trans('messages.Enter message to send')]);
        }
    
        $userroles = [$request->userType];
        if ($request->userType === "all") {
            $userroles = ["user", "tasker"];
        }
    
        if ($dtype == 'ios') {
            $devices = User::where('devicePlatform', 'iOS')->where('deviceActive', 1)->whereIn('role', $userroles)->get();
        } else if ($dtype == 'web') {
            $devices = User::where('devicePlatform', 'web')->where('deviceActive', 1)->whereIn('role', $userroles)->get();
        } else {
            $devices = User::where('devicePlatform', 'android')->where('deviceActive', 1)->whereIn('role', $userroles)->get();
        }
    
        $deviceTokens = [];
        foreach ($devices as $device) {
            $deviceTokens[] = $device->deviceToken;
        }
    
        if (!empty($deviceTokens)) {
            try {
                if ($dtype == 'ios') {
                    $usernotification = $myClass->ios_push_notification($deviceTokens, $msg, 'all');
                } else if ($dtype == 'web') {
                    $usernotification = $myClass->web_push_notification($deviceTokens, $msg, 'all');
                } else {
                    $usernotification = $myClass->android_push_notification($deviceTokens, $msg, 'all');
                    
                }
            } catch (\Throwable $th) {
                // Log error for debugging
                error_log('Push notification error: ' . $th->getMessage());
            }
    
            $message = new Adminchats();
            $message->msg_type = 'text';
            $message->msg_from = 'admin';
            $message->msg_platform = $dtype;
            $message->msg_to = $request->userType;
            $message->msg_data = $msg;
            $message->msg_at = time();
            $message->save();
        }
    
        return redirect(url()->previous());
    }

    public function taskerNotification($tasker)
    {   
        $myClass = new MyClass();
        $devicetoken = array();
        array_push($devicetoken, $tasker->deviceToken);
        if ($tasker->verified == 1) {
            $msg = GoogleTranslate::trans("You Have Been Approved By Admin", $tasker->languageType, 'en');
        }
        else{
            $msg = GoogleTranslate::trans("You Have Been Unapproved By Admin", $tasker->languageType, 'en');
        }
        

        $scope = 'settlement';
        if ($tasker->deviceActive == 1) {
            if ($tasker->devicePlatform == 'ios') {
                try {
                    $usernotification = $myClass->ios_push_notification($devicetoken, $msg, 'all', $scope );
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            else
            {
                try {
                    $usernotification = $myClass->android_push_notification($devicetoken, $msg, 'all', $scope);
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            return redirect(url()->previous());
        }
       
    }

    public function settlementNotification($tasker)
    {   
        $myClass = new MyClass();
        $devicetoken = array();
        array_push($devicetoken, $tasker->deviceToken);
        $msg = GoogleTranslate::trans("Your amount has been settled by admin", $tasker->languageType, 'en');
        $scope = 'settlement';
        if ($tasker->deviceActive == 1) {
            if ($tasker->devicePlatform == 'ios') {
                try {
                    $usernotification = $myClass->ios_push_notification($devicetoken, $msg, 'all', $scope);
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            else
            {
                try {
                    $usernotification = $myClass->android_push_notification($devicetoken, $msg, 'all', $scope);
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            return redirect(url()->previous());
        }
       
    }
    
}
