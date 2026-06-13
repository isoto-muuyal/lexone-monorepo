<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;

class NotificationController extends Controller
{
	
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.notification.create', ['sitesettings' => $sitesettings]);
	}

	public function store(Request $request)
	{	
		$this->validate(
				$request,
				[
					'pushNotification' => 'required|string|min:1|max:500|',
				],
				[
					'pushNotification.required' => __('messages.pushNotification is required.'),
				]
			);
			$settings = Setting::orderBy('_id', 'desc')->first();
			$settings->pushNotification = $request->pushNotification;
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

	/*public function mailsettings()
	{
		return view('admin.settings.generalsettings');
	}

	public function sociallinks()
	{
		return view('admin.settings.generalsettings');
	}

	public function storelinks()
	{
		return view('admin.settings.generalsettings');
	}*/
	
}