<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Hash;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
	public function index(Request $request)
	{	
		$adminrecords= Auth::user();
		$active_tab = "general";
		if($request->session()->exists('admin_profile_tab')){
			$active_tab = $request->session()->get('admin_profile_tab');
		}
		return view('admin.profile', ['adminrecords' => $adminrecords,'active_tab' => $active_tab]);
	}

	public function updateprofile(Request $request)
	{	
		$request->session()->put('admin_profile_tab', 'general');
		$this->validate($request, [
			'admin_username' => 'required|min:3|max:255',
			'admin_email' => 'required|email',
		],
		[
			'admin_username.required' => __('messages.Username should not be empty'),
			'admin_username.max' => __('messages.Maximum 30 characters are allowed'),
			'admin_email.required' => __('messages.Email should not be empty'),
		]);
		$adminrecords = Auth::user();
		$adminrecords->name = $request->get('admin_username');
		$adminrecords->email = $request->get('admin_email');
		$adminrecords->save();
		$notification = array(
			'message' => __('messages.Profile updated successfully'),
			'alert-type' => 'success',
		);
		session()->put('notification', $notification);
		return redirect()->route('admin.profile');
	}

	public function changepassword(Request $request)
	{
		$request->session()->put('admin_profile_tab', 'changepassword');
		$this->validate($request, [
			'admin_old_password' => 'required',
			'admin_new_password' => 'required|min:6|max:255|different:admin_old_password',
			'admin_confirm_password' => 'required|same:admin_new_password',
		],
		[
			'admin_old_password.required' => trans('messages.Enter your old password'),
			'admin_new_password.required' => trans('messages.Enter your new password'),
			'admin_new_password.min' => trans('messages.Password length should be min 6 character'),
			'admin_new_password.different' => trans('messages.Your new password should not be same as old password'),
			'admin_confirm_password.required' => trans('messages.Re-enter your confirm password'),
			'admin_confirm_password.same' => trans('messages.Confirm password is wrong'),
		]);

		$adminrecords = Auth::user();
		if (!Hash::check($request->get('admin_old_password'), $adminrecords->password)) {
			$notification = array(
				'message' => trans('messages.Old password is incorrect'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}

		$adminrecords->password = Hash::make($request->get('admin_new_password'));
		$adminrecords->save();
		$notification = array(
			'message' => trans('messages.Password saved successfully'),
			'alert-type' => 'success',
		);
		session()->put('notification', $notification);
		return redirect()->route('admin.profile');
	}

}