<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;
use App\Models\Currency;
use App\Models\City;
use Encore\Admin\Form\Field\Currency as FieldCurrency;
use Illuminate\Support\Str;
use Stripe\Stripe;
use File;

class SettingController extends Controller
{
	
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		$businessCities = $sitesettings->businessCities;
		// echo '<pre>'; print_r($sitesettings); die;
		return view('admin.settings.sitesettings', ['sitesettings' => $sitesettings,'businessCities' =>$businessCities]);
	}

	public function storesitesettings(Request $request)
	{	
		$this->validate(
			$request,
			[
				'site_name' => 'required|regex:/^[\pL\s\-]+$/u|min:3|max:30',
				'site_logo' => 'image|mimes:jpeg,png,jpg|max:2000',
				'site_icon' => 'image|mimes:png,ico|max:2000',
				'contact_email' => 'required|email',
				'copyright_text' => 'required',
				'tax' => 'required|numeric|between:0,99.99',
				'commission' => 'required|numeric|between:0,99.99',
				'minimumAmount' => 'required',
				'payoutDate'=> 'required',
				'youtubeTitle' => 'required',
				'youtubeLink'=> ['required', 'regex:/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/'],
				'youtubeDescription'=> 'required'
			],
			[
				'site_name.required' => __('messages.The site name field is required.'),
				'site_name.regex' => __('messages.The site name may only contain letters, hyphens and spaces.'),
				'site_name.min' => __('messages.The site name must be at least 3 characters.'),
				'site_name.max' => __('messages.The site name may not be greater than 30 characters.'),
				'contact_email.required' => __('messages.The contact mail field is required.'),
				'contact_email.email' => __('messages.The contact email must be a valid email address.'),
				'copyright_text.required' => __('messages.The copyright text field is required.'),
				'tax.required' => __('messages.The Tax field is required.'),
				'commission.required' => __('messages.The Commission field is required.'),
				'minimumAmount.required' => __('messages.The Minimum Amount field is required.'),
				'payoutDate.required' => __('messages.The Payout Date field is required.'),
				'youtubeTitle.required' => __('messages.The Youtube Title field is required.'),
				'youtubeLink.required' => __('messages.The Youtube Link field is required.'),
				'youtubeDescription.required' => __('messages.The Youtube Description field is required.'),
			]
		);


		$setting = Setting::first();
		Stripe::setApiKey($setting->stripePrivateKey);
        $stripe = new \Stripe\StripeClient(
            $setting->stripePrivateKey
        );
		
		$currency = explode("-",$request->currency);
		if(count($currency) == 2) {
			$currencyCodeData = str_replace(' ','',$currency[1]);
		}
		else {
			$currencyCodeData = str_replace(' ','',$currency[2]);
		}
		

		// echo '<pre>'; print_r($currency); die;

		$currencyIndex = array("BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF");
		if(in_array($currencyCodeData, $currencyIndex)){
			$amount = $request->minimumAmount;
		}else{
			$amount = $request->minimumAmount*100;
		}

		$getCurrency = Currency::where('currencycode',$currencyCodeData)->get()->first();

		if(empty($getCurrency)){
			$notification = array(
				'message' => trans('Before set default currency you must add this currency in currency list.'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->route('sitesettings.index');
		}

		try{
			$paymentintent = $stripe->paymentIntents->create([
				'amount' => $amount,
				'currency' => $currencyCodeData,
				'payment_method_types' => ['card'],
			  ]);
		}catch (\Throwable $th) {
			$notification = array(
				'message' => trans('Amount is too low please click help icon to set minimum amount by currency.'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->route('sitesettings.index');
		}

		// echo '<pre>'; print_r($paymentintent); die;
		
		$settings = Setting::orderBy('_id', 'desc')->first();
		$settings->siteName = $request->site_name;
		$settings->contactEmail = $request->contact_email;
		$settings->copyrightText = $request->copyright_text;
		$settings->payoutDate = $request->payoutDate;
		$settings->youtubeTitle = $request->youtubeTitle;
		$settings->youtubeLink = $request->youtubeLink;
		$settings->youtubeDescription = $request->youtubeDescription;
		$settings->minimumAmount =(float)$request->minimumAmount; 
		$settings->instantLocation = $request->instantLocation;
		$settings->googleadsense = $request->googleadsense;
		$settings->tax =(float)$request->tax;
		$settings->commission =(float)$request->commission;
		$settings->supportPhone = $request->support_phone;

		$getCurrencies = Currency::get()->toArray();
		
		foreach($getCurrencies as $key=>$val){
			$getCurrencyValue = $this->currencyConverter(str_replace(' ','',$currencyCodeData),strtoupper($val['currencycode']),1);
			$category = Currency::where('currencycode',$val['currencycode'])->first();
			$category->price = round($getCurrencyValue, 2);
			$category->save();
		}
		

		$settings->currencyCode = strtoupper(str_replace(' ','',$currencyCodeData));
		$settings->currencySymbol = str_replace(' ','', $currency[0]);

		if ($request->file('site_logo')) {
			$file_path = storage_path()."/app/public/admin_assets/logo.png";
			$this->unlink($file_path); 
			$fileNameToStore = 'logo.png';
			$path = $request->file('site_logo')->storeAs('/public/admin_assets/',$fileNameToStore);
			$settings->siteLogo = $fileNameToStore;
		}
		if ($request->file('site_icon')) {
			$file_path = storage_path()."/app/public/admin_assets/fav-icon";
			$this->unlink($file_path); 
			$fileNameToStore = 'fav-icon';
			$path = $request->file('site_icon')->storeAs('/public/admin_assets/',$fileNameToStore);
			$settings->siteIcon = $fileNameToStore;
		}
		if ($settings->save()) {
			$notification = array(
				'message' => trans('messages.Settings has been saved successfully'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
		session()->put('notification', $notification);
		return redirect()->route('sitesettings.index');
	}

	public function currencyConverter($from_Currency,$to_Currency,$amount) { 
		$url = 'https://www.x-rates.com/calculator/?from='.strtoupper(str_replace(' ','',$from_Currency)).'&to='.strtoupper(str_replace(' ','',$to_Currency)).'&amount=1';
             $rawdata = file_get_contents($url); 
              
			 
			  $data = explode('ccOutputRslt">', $rawdata);
              $data1 = explode('ccOutputTrail">', $rawdata);

			  if(empty($data[1]) || empty($data1[1])){
				$data = explode('ccOutputRslt">', $rawdata);
				$data1 = explode('ccOutputTxt">', $rawdata);
			  }

              $data = explode('<span', $data[1]);   
              $data1 = explode('</span', $data1[1]);   
			//   echo trim($data[0]).' currency '.trim($data1[0]); die;
              return trim($data[0]).trim($data1[0]); 
	} 
	public function unlink($file_path)
	{	
		if(file_exists($file_path)){
			unlink($file_path);
		}
	}
}
