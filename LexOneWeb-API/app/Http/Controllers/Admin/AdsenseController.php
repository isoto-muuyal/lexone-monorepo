<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;

class AdsenseController extends Controller
{
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.adsense.create', ['sitesettings' => $sitesettings]);
	}

	public function store(Request $request)
	{	
		// echo '<pre>'; print_r("expression"); die;
		$this->validate(
			$request,
			[
				'googleadclient' => 'required',
				'googleadslot' => 'required'
			],
			[
				'googleadclient.required' => __('messages.Google AD Client is required.'),
				'googleadslot.required' => __('messages.Google AD Slot is required.'),
			]
		);
		$settings = Setting::orderBy('_id', 'desc')->first();
		$settings->googleadclient = $request->googleadclient;
		$settings->googleadslot = $request->googleadslot;
		$settings->save();
		if ($settings->save()) {
			$notification = array(
				'message' => trans('messages.Adsense Settings has been saved successfully'),
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
}