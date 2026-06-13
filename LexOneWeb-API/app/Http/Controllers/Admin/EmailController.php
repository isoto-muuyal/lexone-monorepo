<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;

class EmailController extends Controller
{
	
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.emails.create', ['sitesettings' => $sitesettings]);
	}

	public function store(Request $request)
	{	
		$this->validate(
			$request,
			[
				'smtpPort' => 'required',
				'smtpHost' => 'required',
				'smtpEmail' => 'required|email',
				'password' => 'string|min:8|',
			],
			[
				'smtpPort.required' => __('messages.Port is required.'),
				'smtpHost.required' => __('messages.Host is required.'),
				'smtpEmail.required' => __('messages.Please enter user E-mail.'),
			]
		);
		$settings = Setting::orderBy('_id', 'desc')->first();
		$settings->smtpPort = $request->smtpPort;
		$settings->smtpHost = $request->smtpHost;
		$settings->smtpEmail = $request->smtpEmail;
		$settings->smtpPassword = $request->smtpPassword;
		$settings->smtpStatus = (int)$request->smtpStatus;
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
}