<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Setting;

class SocialController extends Controller
{
	
	public function create()
	{	
		$sitesettings= Setting::orderBy('_id', 'desc')->first();
		return view('admin.sociallinks.create', ['sitesettings' => $sitesettings]);
	}

	public function store(Request $request)
	{	
		$this->validate(
			$request,
			[
				'fbLink' => 'required',
				'twitterLink' => 'required',
				'instagramLink' => 'required',
				'inviteLink' => 'required',
			],
			[
				'fbLink.required' => __('messages.Facebook link is required.'),
				'inviteLink.required' => __('messages.Invite Link is required.'),
				'fbLink.required' => __('messages.Twitter Link is required.'),
				'instagramLink.required' => __('messages.Instagram Link is required.'),
			]
		);
		$settings = Setting::orderBy('_id', 'desc')->first();
		$settings->fbLink = $request->fbLink;
		$settings->twitterLink = $request->twitterLink;
		$settings->instagramLink = $request->instagramLink;
		$settings->inviteLink = $request->inviteLink;
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