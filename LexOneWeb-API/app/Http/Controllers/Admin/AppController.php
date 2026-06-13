<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;
use Stichoza\GoogleTranslate\GoogleTranslate;

class AppController extends Controller
{
	
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.app.create', ['sitesettings' => $sitesettings]);
	}

	public function store(Request $request)
	{	
		$this->validate(
			$request,
			[
				'docsLimit' => 'required|max:100',
				'portfolioLimit' => 'required|max:100',
				'guideLine' => 'required|max:1200',
			],
			[
				'docsLimit.required' => __('messages.Document limit is required.'),
				'portfolioLimit.required' => __('messages.portfolio limit is required.'),
				'portfolioLimit.max' => __('messages.portfolio limit is 100'),
				'guideLine.required' => __('messages.guideLine is required.'),
				'guideLine.max' => __('messages.guideLine limit is upto 1200 words.'),
				'docsLimit.max' => __('messages.Document limit is 100'),
			]
		);
		
		$settings = Setting::orderBy('_id', 'desc')->first();
		$settings->docsLimit = (int)$request->docsLimit;
		$settings->portfolioLimit = (int)$request->portfolioLimit;
		$settings->guideLine = $request->guideLine;
		$settings->guideLineFr = $request->guideLineFr;
		$settings->guideLineAr = $request->guideLineAr;
		$settings->save();
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
		return redirect()->back();
	}
	public function updatecreate(Request $request)
	{	
		$active_tab = "general";
        if($request->session()->exists('app_update')){
			$active_tab = $request->session()->get('app_update');
        }
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.app.forceupdate', ['sitesettings' => $sitesettings,'active_tab' => $active_tab]);
	}
	public function updatestore(Request $request)
	{	
		if ($request->iosVersion) {
			$request->session()->put('app_update', 'changepassword');
		}
		else{
			$request->session()->put('app_update', 'general');
		}
		$this->validate(
			$request,
			[
				'androidVersion' => 'numeric|between:1,999999.99',
				'iosVersion' => 'numeric|between:1,999999.99',
			],
			);
		$settings = Setting::orderBy('_id', 'desc')->first();
		if ($request->status == "on") {
			$settings->status = "true";
		}
		else{
			$settings->status = "false";
		}
		$settings->androidVersion = (float)$request->androidVersion;
		$settings->androidForceUpdate = $request->androidForceUpdate;
		$settings->iosVersion = (float)$request->iosVersion;
		$settings->iosForceUpdate = $request->iosForceUpdate;
		$settings->save();
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
		return redirect()->back();
	}

}