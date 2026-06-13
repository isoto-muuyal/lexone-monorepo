<?php
namespace App\Http\Controllers\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Config;

class LanguageController extends Controller
{
	public function switchlang($locale)
	{	
	 	$lang = Session::put('locale', $locale);
		Session::put('locale', $locale);
		return Redirect::back();
	}
}


