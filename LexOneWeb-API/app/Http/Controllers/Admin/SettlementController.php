<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;
use App\Models\Booking;
use App\Classes\MyClass;
use App\Models\User;
use App\Models\Bookingdetail;
use App\Models\Setting;
use App\Models\Currency;
use App\Models\Service;
use App\Models\Settlement;
use App\Models\Log;
use Carbon\Carbon;
use Session;
use Stripe\Stripe;
use App\Http\Controllers\Admin\DashboardController;
use Stichoza\GoogleTranslate\GoogleTranslate;

class SettlementController extends Controller
{
    protected $DashboardController;
    public function index(Request $request)
    {
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $taskersname = null;
        $taskername = null;
        $price = null;
        $taskerPrice = null;
        $totalBooking = Booking::where('status', 'completed')->where('settlement', '!=', 1)->groupBy('taskerId')->get();

        // echo '<pre>'; print_r($totalBooking); die;
        $totalReportsCount = count($totalBooking);
        $bookings = Booking::raw()->aggregate([
            [
                '$match' => [
                    'status' => 'completed',
                    'settlement' => ['$ne' => 1],
                ]
            ],
            [
                '$group' => [
                    '_id' => '$taskerId',
                    'tax' => ['$first' => '$tax'],
                    'commission' => ['$first' => '$commission'],
                    'price' => ['$sum' => ['$toDouble' => '$price']],
                    'reward' => ['$sum' => ['$toDouble' => '$reward']],
                    'tax' => ['$sum' => ['$toDouble' => '$tax']],
                    'commission' => ['$sum' => ['$toDouble' => '$commission']],
                ],
            ],
            [
                '$project' => [
                    'total' => ['$sum' => ['$price', '$reward']],
                    'tax' => ['$sum' => '$tax'],
                    'commission' => ['$sum' => '$commission'],
                    'reward' => ['$sum' => '$reward'],
                    'price' => ['$sum' => '$price'],
                ],
            ],
            [
                '$sort' => [
                    '_id' => -1
                ],
            ],
            ['$skip' => ($page - 1) * $perPage],
            ['$limit' => $perPage],

        ]);
        $taskers = [];
        foreach ($bookings as $booking) {
            // print_r($booking->_id); die;
            $taskername = User::where('_id', $booking->_id)->first();
            if(!isset($taskername->name))
            {
                continue;
            }
            // echo '<pre>'; print_r($taskername); die;
            $taskers[] = [
                'name' => $taskername->name,
                'email' => $taskername->email,
                'total' =>   $booking->total,
                'tax' => $booking->tax,
                'commission' => $booking->commission,
                'reward' => $booking->reward,
                'price' => $booking->price,
                '_id' => $taskername->id
            ];
        }
        $pagination = new \Illuminate\Pagination\LengthAwarePaginator($taskers, $totalReportsCount, $perPage, $page, [
            'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
        ]);
        return view('admin.settlement.index', ['taskers' => $taskers, 'pagination' => $pagination]);
    }
    public function paid(Request $request)
    {
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $taskersname = null;
        $taskername = null;
        $price = null;
        $taskerPrice = null;
        $totalBooking = Booking::where('status', 'completed')->where('settlement', 1)->groupBy('taskerId')->get();
        $totalReportsCount = count($totalBooking);
        $bookings = Booking::raw()->aggregate([
            [
                '$match' => [
                    'status' => 'completed',
                    'settlement' => 1,
                ]
            ],
            [
                '$group' => [
                    '_id' => '$taskerId',
                    'tax' => ['$first' => '$tax'],
                    'commission' => ['$first' => '$commission'],
                    'price' => ['$sum' => ['$toDouble' => '$price']],
                    'reward' => ['$sum' => ['$toDouble' => '$reward']],
                    'tax' => ['$sum' => ['$toDouble' => '$tax']],
                    'commission' => ['$sum' => ['$toDouble' => '$commission']],
                ],
            ],
            [
                '$project' => [
                    'total' => ['$sum' => ['$price', '$reward']],
                    'tax' => ['$sum' => '$tax'],
                    'commission' => ['$sum' => '$commission'],
                    'reward' => ['$sum' => '$reward'],
                    'price' => ['$sum' => '$price'],
                ],
            ],
            [
                '$sort' => [
                    '_id' => -1
                ],
            ],
            ['$skip' => ($page - 1) * $perPage],
            ['$limit' => $perPage],

        ]);
        $taskers = [];
        foreach ($bookings as $booking) {
            $taskername = User::where('_id', $booking->_id)->first();
            if ($taskername != null) {
                $taskers[] = [
                    'name' => $taskername->name,
                    'email' => $taskername->email,
                    'total' =>   $booking->total,
                    'tax' => $booking->tax,
                    'commission' => $booking->commission,
                    'reward' => $booking->reward,
                    'price' => $booking->price,
                    '_id' => $taskername->id
                ];
            }
        }
        $pagination = new \Illuminate\Pagination\LengthAwarePaginator($taskers, $totalReportsCount, $perPage, $page, [
            'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
        ]);
        return view('admin.settlement.paid', ['taskers' => $taskers, 'pagination' => $pagination]);
    }

    public function paiddetails(Request $request, $id)
    {
        $tasker = User::findOrFail($id);
        $users = User::all();
        $bookings = Booking::where('status', 'completed')->where('settlement', '=', 1)->where('taskerId', new \MongoDB\BSON\ObjectID($id))->get();
        $count = $bookings->count();
        $price = 0;
        $tax = 0;
        $commission = 0;
        $total = 0;
        $reward = 0;
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        foreach ($bookings as $booking) {
            $price += $booking->price;
            $tax += $booking->tax;
            $commission += $booking->commission;
            $total += $booking->total;
            $reward += $booking->reward;
        }
        return view('admin.settlement.paiddetails', [
            'tasker' => $tasker,
            'users' => $users, 'count' => $count, 'price' => $price, 'bookings' => $bookings, 'currencySymbol' => $currencySymbol,
            'tax' => $tax, 'commission' => $commission, 'total' => $total, 'reward' => $reward
        ]);
    }

    public function show(Request $request, $id)
    {
        $tasker = User::findOrFail($id);
        $users = User::all();
        $bookings = Booking::where('status', 'completed')->where('settlement', '!=', 1)->where('taskerId', new \MongoDB\BSON\ObjectID($id))->get();
        $count = $bookings->count();
        $price = 0;
        $tax = 0;
        $commission = 0;
        $total = 0;
        $reward = 0;
        $setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
        foreach ($bookings as $booking) {
            $price += $booking->price;
            $tax += $booking->tax;
            $commission += $booking->commission;
            $total += $booking->total;
            $reward += $booking->reward;
        }
        $amount = $price + $reward;
        return view('admin.settlement.show', [
            'tasker' => $tasker,
            'users' => $users, 'count' => $count, 'price' => $price, 'bookings' => $bookings, 'currencySymbol' => $currencySymbol,
            'tax' => $tax, 'commission' => $commission, 'total' => $total, 'reward' => $reward, 'amount' => $amount
        ]);
    }

    public function stripePost(Request $request)
    {
        $setting = Setting::first();
        $userdetails = User::findOrFail($request->userId);
        $currencyCode = $setting->currencyCode;
        $bookingIds = $request->bookingId;
        foreach ($bookingIds as $bookingid) {
            $booking[] = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingid))->first();
        }
        $charge = Stripe\Charge::create([
            "amount" => $request->amount * 100,
            "currency" => $currencyCode,
            "source" => $request->stripeToken,
            "description" => "Amount Paid Successfully"
        ]);
        $settlement = Settlement::create([
            'bookingId' =>  $request->bookingId,
            'transactionId' =>  $charge->id,
            'amount' =>  $request->amount,
            'description' =>  $request->email
        ]);
        foreach ($bookingIds as $bookingid) {
            $booking = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingid))->first();
            $booking->settlement = 1;
            $booking->save();
        }
        $user =  auth()->user();
        $email = $user->email;
        if ($settlement->save()) {
            $notification = array(
                'message' => trans('messages.Payment have been settled sucessfully'),
                'alert-type' => 'success',
            );
        } else {
            $notification = array(
                'message' => trans('messages.Something went wrong'),
                'alert-type' => 'error',
            );
        }
        session()->put('notification', $notification);
        return redirect()->route('settlement.index');
    }

    public function stripepayout(Request $request)
    {
        $setting = Setting::first();
        $userdetails = User::where('userId', $request->userId)->first();
        $currencyCode = $setting->currencyCode;
        $bookingIds = $request->bookingId;
        foreach ($bookingIds as $bookingid) {
            $booking[] = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingid))->first();
        }
        Stripe::setApiKey($setting->stripePrivateKey);
        $stripe = new \Stripe\StripeClient(
            $setting->stripePrivateKey
        );
        $charge = \Stripe\Transfer::create([
            "amount" => $request->amount * 100,
            "currency" => $currencyCode,
            "destination" => $userdetails->accountId,
        ]);
        $settlement = Settlement::create([
            'bookingId' =>  $request->bookingId,
            'transactionId' =>  $charge->id,
            'amount' =>  $request->amount,
            'description' =>  $request->email
        ]);
        foreach ($bookingIds as $bookingid) {
            $booking = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingid))->first();
            $booking->settlement = 1;
            $booking->save();
        }
        $user =  auth()->user();
        $email = $user->email;
        if ($settlement->save()) {
            $notification = array(
                'message' => trans('messages.Payment have been settled sucessfully'),
                'alert-type' => 'success',
            );
        } else {
            $notification = array(
                'message' => trans('messages.Something went wrong'),
                'alert-type' => 'error',
            );
        }
        session()->put('notification', $notification);
        return redirect()->route('settlement.index');
    }

    public function reauth()
    {
        return view('stripepg.reauth');
    }

    public function complete()
    {
        return view('stripepg.complete');
    }
    public function payoutCron()
    {
        return view('stripepg.reauth');
    }

    public function payoutchkcron(Request $request)
    {
        $setting = Setting::first();

        Stripe::setApiKey($setting->stripePrivateKey);

        $stripe = new \Stripe\StripeClient(
            $setting->stripePrivateKey
        );

        $currencyCode = $setting->currencyCode;
        $taskers = User::where('role', 'tasker')->where('verified', 1)->where('accountId', '!=', null)->get();


        $start =  Carbon::now()->toDateTimeString();
        $start =  new \MongoDB\BSON\UTCDateTime(new \DateTime($start));	
        foreach ($taskers as $tasker) {

            if($tasker->accountId == '')
                continue;

            if(empty($tasker))
            {
                echo 'empty';
                print_r($tasker); die;
            }

            $val = $stripe->accounts->retrieve(
                $tasker->accountId,
                []
            );

            Stripe::setApiKey($setting->stripePrivateKey);
            $stripe = new \Stripe\StripeClient(
                $setting->stripePrivateKey
            );
	    // with checking payout date
            
            // with checking payout date
            $bookings = Booking::where('status', 'completed')->where('settlement', 0)->where('taskerId', new \MongoDB\BSON\ObjectID($tasker->id))->get();

            // echo '<pre>'; print_r($bookings); die;
            $bookingcount = count($bookings);

            if (count($bookings) > 0) {
                
                $price = 0;
                $tax = 0;
                $commission = 0;
                $total = 0;
                $reward = 0;
                $currencySymbol = $setting->currencySymbol;
                $bookingIds = null;
                foreach ($bookings as $booking) {
                    $price += $booking->price;
                    $tax += $booking->tax;
                    $commission += $booking->commission;
                    $total += $booking->total;
                    $reward += $booking->reward;
                    $bookingIds[] = $booking->id;
                }
                if ($price != 0) {
                    
                    $amount = $price + $reward;
                    \Log::info($tasker->name);
                    \Log::info($amount);

                   /*  $accountStatus = $stripe->accounts->retrieve(
                        'acct_1JMonbR4C1uPrOYd',
                        []
                    ); */

                    $accountStatus = $stripe->accounts->retrieve(
                        $tasker->accountId,
                        []
                    );

                   

                    if ($accountStatus->charges_enabled == true) {
                       
                        $val = $stripe->accounts->retrieve(
                            $tasker->accountId,
                            []
                        );
                        $getCarddata = $setting->stripe_card_settings;
                        // $tokJson = \Stripe\Token::create(array(
                        //     "card" => array(
                        //     "number" => $getCarddata['stripe_card'],
                        //     "exp_month" => $getCarddata['stripe_month'],
                        //     "exp_year" => $getCarddata['stripe_year'],
                        //     "cvc" => $getCarddata['stripe_cvc']
                        //     )
                        //     ));
                        // $tok = $tokJson->jsonSerialize();

                        $method = \Stripe\PaymentMethod::create([
                            'type' => 'card',
                            'card' => [
                                "number" => $getCarddata['stripe_card'],
                                "exp_month" => $getCarddata['stripe_month'],
                                "exp_year" => $getCarddata['stripe_year'],
                                "cvc" => $getCarddata['stripe_cvc']
                            ],
                        ]); 
                        
                        $getU1currency =  Currency::where(['currencycode'=>strtoupper($val['default_currency'])])->first();
                        $getadmincurrency =  Currency::where(['currencycode'=>strtoupper(str_replace(' ','',$setting->currencyCode))])->first();

                        
                        if(strtoupper(str_replace(' ', '',$val['default_currency'])) != strtoupper(str_replace(' ','',$setting->currencyCode))){
                            // echo '<pre>'; print_r($getU1currency); 
                            // echo 'sfdsdf';
                            // print_r($getadmincurrency); 
                            // die;
                            $stripetaskerfee = round($getU1currency['price']*($amount / $getadmincurrency['price']),2);
                        }else{
                            $stripetaskerfee = round($amount,2);
                        }

                        $indexcurrency = strtoupper(str_replace(' ', '', $val['default_currency']));

                        $currencyIndex = array("BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF");
                        if(in_array($indexcurrency, $currencyIndex)){
                            $finalAmount = $stripetaskerfee;
                        }else{
                            $finalAmount = $stripetaskerfee*100;
                        }
                        $charge = \Stripe\PaymentIntent::create([
                            'payment_method_types' => ['card'],
                            'payment_method' => $method->id,
                            "amount" => $finalAmount,
                            'confirm' => true,
                            'currency' => strtoupper(str_replace(' ', '', $val['default_currency'])),
                            'transfer_data' => [
                                'destination' => $tasker->accountId,
                            ],
                        ]); 
                        // echo "<pre>";
                        // echo $charge->id;
                        // print_r($charge);
                        // die;
                        // $charge = \Stripe\Charge::create(array(
                        //     "amount" => $finalAmount,
                        //     "currency" => strtoupper(str_replace(' ', '', $val['default_currency'])),
                        //     'source' => $tok['id'],
                        //     "destination" => array(
                        //         "account" => $tasker->accountId
                        //     ),
                        // ));

                        // echo '<pre>'; print_r($charge); die;

                        $settlement = Settlement::create([
                            'bookingId' =>  $bookingIds,
                            'transactionId' =>  $charge->id,
                            'amount' =>  $amount,
                            'description' =>  'payment done'
                        ]);
                        foreach ($bookingIds as $bookingId) {
                            $booking = Booking::where('_id', new \MongoDB\BSON\ObjectID($bookingId))->first();
                            $booking->settlement = 1;
                            $booking->save();
                        }

                        $response = $this->settlementNotification($tasker);
                        
                        $email = $setting->smtpEmail;
                        $subject = 'Payment Settled';
                        \Mail::to($tasker->email)->send(new \App\Mail\SettlementMail($email, $bookings, $amount));

                        $log = new Log();
                        $log->messageType = "Settlement Amount";
                        $log->serviceId = ["Approval"];
                        $log->isAdmin = 1;
                        $log->type = "approval";
                        $log->senderId =  new \MongoDB\BSON\ObjectID($tasker->id);
                        $log->receiverId = new \MongoDB\BSON\ObjectID($tasker->id);
                        $log->createdAt = $start;
                        $log->messageTxt = "Your amount has been settled by admin";
                        $log->save();
                        echo 'settlement done by admin <br/>';
                    }
                }
            }else{
                echo 'no bookings...<br/>';
            }
        }

        echo 'process completed'; die;
    }

    public function settlementNotification($tasker)
    {   
        // print_r($tasker); die;
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
            else if($tasker->devicePlatform == 'web') {
                try {
                    $usernotification = $myClass->web_push_notification($devicetoken, $msg, 'all', $scope);
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
            else 
            {
                try {
                    $usernotification = $myClass->android_push_notification($devicetoken, $msg, 'all', $scope);
                    // echo '<pre>'; print_r($usernotification); die;
                } 
                catch (\Throwable $th) {
                    throw $th;
                }
            }
           
        }
        return 'completed';
    }
}
