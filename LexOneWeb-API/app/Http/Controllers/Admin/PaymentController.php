<?php
namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Booking;
use DB;
use Carbon\Carbon;

class PaymentController extends Controller
{

	public function create(Request $request)
	{
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.payment.create', ['sitesettings' => $sitesettings])->with('card_data',$sitesettings->stripe_card_settings);
	}

	public function store(Request $request)
	{
		$start =  Carbon::now();
        $booking = Booking::where('settlement',0)->where('payoutDate','>',$start)->first();
		$setting= Setting::orderBy('_id', 'desc')->first();

		// echo '<pre>'; print_r($_POST); die;

		if($booking == null){
			$this->validate(
				$request,
				[
					'stripePublicKey' => 'required',
					'payment_type' => 'required',
					'stripePrivateKey' => 'required',
					'stripeClientId' => 'required',
					'stripe_card' => 'required',
				],
				[
					'stripePublicKey.required' => __('messages.The stripePublicKey is required.'),
					'stripePrivateKey.required' => __('messages.The stripePrivateKey is required.'),
					'stripeClientId.required' => __('messages.The stripeClientId is required.'),
					'stripe_card.required' => __('messages.The Card number is required.'),
					'payment_type.required' => __('messages.The payment type is required.'),
					'tax.required' => __('messages.The tax is required.'),
					'commission.required' => __('messages.The commission is required.'),
				]
			);

			//Card data from the adminpanel.
			$card_data = array('stripe_card'=>$request['stripe_card'],
				'stripe_month'=>$request['stripe_month'],
				'stripe_year'=>$request['stripe_year'],
				'stripe_cvc'=>$request['stripe_cvc']
			);
			$setting->stripePublicKey = $request->stripePublicKey;
			$setting->paymentType = $request->payment_type;
			$setting->stripe_card_settings = $card_data;
			$setting->stripePrivateKey = $request->stripePrivateKey;
			$setting->stripeClientId = $request->stripeClientId;
			$setting->stripeChange = "1";
			$setting->save();
			if ($setting->save()) {
				DB::collection('users')->unset('stripeCustomerId');
				$notification = array(
					'message' => __('messages.Payment key has been saved successfully'),
					'alert-type' => 'success',
				);
			}else{
				$notification = array(
					'message' => __('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}

		}
		else{
			$notification = array(
				'message' => __('messages.Some payments are still in process.'),
				'alert-type' => 'error',
			);
		}
		session()->put('notification', $notification);
		return redirect()->back();
	}
}


