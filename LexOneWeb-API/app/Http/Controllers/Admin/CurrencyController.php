<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Currency;
use App\Models\Service;
use App\Models\Pricing;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class CurrencyController extends Controller
{
	protected $CategoryController;
	public function __construct(CategoryController $CategoryController)
	{
		$this->middleware('auth');
		$this->CategoryController = $CategoryController;
	}

	public function index(Request $request)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = "name";
		$search = "";
		$paginate = Currency::paginate($perPage);
		if ($sortby && $sortorder) {
			$currencies = Currency::get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			if ($sortorder == 'asc') {
				$currencies = Currency::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		} else {
			$currencies = Currency::orderBy('created_at', 'desc')->get()->toArray();
		}
		// echo '<pre>'; print_r($services); die;
		$currencyrecords = array_slice($currencies, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search_for' => $search_for));

		// echo '<pre>'; print_r($pagination); die;
		return view('admin.currency.index', ['currencyrecords' => $currencyrecords, 'pagination' => $pagination, 'search_for' => $search_for, 'search' => $search]);
	}

	public function testfunction(Request $request)
	{
		echo 'test';
		die;
	}

	public function addCurrency(Request $request)
	{
		$maincategories = Category::where('status', 1)->get();
		$setting = Setting::first();
		$currencylist = $this->getCurrencyList();
		return view('admin.currency.create', ['currencylist' => $currencylist]);
	}

	public function storecurrency(Request $request)
	{
		$this->validation($request);
		$currency_code = $request->currencycode;
		$currency_symbol = $request->currencysymbol;
		$currency_name = $request->currencyname;
		$currency_rate = $request->price;

		$currency = Currency::updateOrCreate([
			'currencycode' => $currency_code,
			'currencysymbol' => $currency_symbol,
			'currencyname' => $currency_name,
			'defaultcurrency' => "0",
			'price' => $currency_rate
		]);
		$currency->save();
		if ($currency->save()) {
			$notification = array(
				'message' => trans('messages.Service has been saved successfully'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
		return redirect()->route('currency.index');
	}


	public function showCurrency($serviceId)
	{
		$currencydetail = Currency::find($serviceId);
		return view('admin.currency.show', ['currencydetail' => $currencydetail]);
	}

	public function editCurrency($serviceId)
	{
		$currencydetails = Currency::find($serviceId);
		$currencylist = $this->getCurrencyList();
		return view('admin.currency.edit', [
			'currencydetails' => $currencydetails,
			'currencylist' => $currencylist
		]);
	}


	public static function currencyConverter($from_Currency, $to_Currency, $amount)
	{
		$setting = Setting::first();
		$url = 'https://www.x-rates.com/calculator/?from=' . strtoupper($setting['currencyCode']) . '&to=' . strtoupper($to_Currency) . '&amount=1';
		$rawdata = file_get_contents($url);
		$data = explode('ccOutputRslt">', $rawdata);
		$data1 = explode('ccOutputTrail">', $rawdata);
		$data = explode('<span', $data[1]);
		$data1 = explode('</span', $data1[1]);
		return trim($data[0]) . trim($data1[0]);
      
		// Update_11Jan2023
			// $url = 'https://api.exchangerate.host/convert?from='.$from_Currency.'&to='.$to_Currency.'';	
			// $alldata = file_get_contents($url);
			// $rawdata = json_decode($alldata);
			// // echo '<pre>'; print_r($rawdata->result); die;
			// return $rawdata->result;
		// Update_11Jan2023
	}

	public function defaultCurrency()
	{
		$currencies = Currency::orderBy('created_at', 'desc')->get()->toArray();
		return view('admin.currency.default', ['currencyrecords' => $currencies]);
	}


	public function setdefaultcurrency(Request $request)
	{
		$setDefault = Currency::where('defaultcurrency', '1')
      ->update(['defaultcurrency' => '0']);

	  	$updatedefault = Currency::where('currencycode', $request->currency_code)
      ->update(['defaultcurrency' => '1']);
		
	  return redirect()->route('currency.default');	
	}

	public function updateCurrency(Request $request, $currencyId)
	{
		$this->validate(
			$request,
			[
				'currencycode' => 'required|min:3|max:30|unique:currency,currencycode,'. $currencyId . ',_id',
				'currencysymbol' => 'required',
				'currencyname' => 'required',
				'price' => 'required',
			],
			[
				'currencycode.required' => __('messages.The currency code name field is required.'),
				'currencysymbol.required' => __('messages.The currency symbol field is required.'),
				'currencyname.required' => __('messages.The currency name field is required'),
				'price.required' => __('messages.The currency price field is required')
			],
			[
				'currencycode.unique' => __('messages.The currency code name has already been taken.'),
			]
		);
		$currency = Currency::find($currencyId);
		$currency_code = $request->currencycode;
		$currency_symbol = $request->currencysymbol;
		$currency_name = $request->currencyname;
		$currency_rate = $request->price;

		$checkCurrencyExist = Currency::where(['currencycode' => $currency_code])->where('_id', '!=', $currencyId)->first();
		if (!empty($checkCurrencyExist)) {
			$notification = array(
				'message' => 'Currency Already Exists',
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}
		$currency = Currency::updateOrCreate(
			[
				'_id' => $currency->id,
			],
			[
				'currencycode' => $currency_code,
				'currencysymbol' => $currency_symbol,
				'currencyname' => $currency_name,
				'price' => $currency_rate,
				'defaultcurrency' => "0"
			]
		);

		if ($currency->save()) {
			$notification = array(
				'message' => trans('messages.Currency has been Updated successfully'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
		return redirect()->route('currency.index');
	}

	public function ajaxcurrencyRate(Request $request)
	{
		
		if ($request->ajax()) {
			$defaultCur = Currency::where(['defaultcurrency' => '1'])->first();
			print_r($defaultCur);die;
			if (!empty($defaultCur)) {
				$default = $defaultCur->currencycode;
				$dynamic = $request->currency;
				echo $amt = $this->currencyConverter($default, $dynamic, 1);
			}
		}
	}
	public function changeservicestatus($serviceId, $serviceStatus)
	{
		$service = Service::where('_id', $serviceId)->orderBy('_id', 'desc')->first();
		if ($serviceStatus == 1) {
			$subCategory = Subcategory::where('_id', $service->subCategory)->first();
			if ($subCategory->status == 0) {
				$notification = array(
					'message' => trans('messages.Activate the subcategory to enable it'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
		}
		$service->status = intval($serviceStatus);
		if ($service->status == 1) {
			$notification = array(
				'message' => trans('messages.Service has been Enabled'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Service has been Disabled'),
				'alert-type' => 'error',
			);
		}
		$service->save();
		session()->put('notification', $notification);
		return redirect()->back();
	}

	public function searchservice(Request $request)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$search = $request->input('search');
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = (!$request->input('search_for')) ? "name" : $request->input('search_for');
		if ($search) {
			$paginate = Service::where($search_for, 'like', "%$search%")->paginate($perPage);
			$services = Service::where($search_for, 'like', "%$search%")->orderBy('created_at', 'desc')->get()->toArray();
		} else {
			$search = "";
			$paginate = Service::paginate($perPage);
			$services = Service::orderBy('created_at', 'desc')->get()->toArray();
			if ($sortorder == 'asc') {
				$services = Service::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		}
		$servicerecords = array_slice($services, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search, 'search_for' => $search_for));
		return view('admin.services.index', compact(['servicerecords', 'search', 'sortby', 'sortorder', 'pagination', 'search_for']));
	}

	public function unlink($file_path)
	{
		if (file_exists($file_path)) {
			unlink($file_path);
		}
	}
	public function validation(Request $request)
	{
		$this->validate(
			$request,
			[
				'currencycode' => 'required|min:3|max:30|unique:currency,currencycode',
				'currencysymbol' => 'required',
				'currencyname' => 'required',
				'price' => 'required',
			],
			[
				'currencycode.required' => __('messages.The currency code name field is required.'),
				'currencysymbol.required' => __('messages.The currency symbol field is required.'),
				'currencyname.required' => __('messages.The currency name field is required'),
				'price.required' => __('messages.The currency price field is required')
			],
			[
				'currencycode.unique' => __('messages.The currency code name has already been taken.'),
			]
		);
	}

	/*
		Custom functions
	*/
	public static function getCurrencyList($cur = null)
	{
		$currency =  array(
			'' => 'Select Currency', '$-Australian Dollar-AUD' => 'AUD',
			'R$-Brazilian Rea-BRL' => 'BRL', 'C$-Canadian Dollar-CAD' => 'CAD',
			'Kč-Czech Koruna-CZK' => 'CZK', 'kr.-Danish Krone-DKK' => 'DKK',
			'€-Euro-EUR' => 'EUR', 'HK$-Hong Kong Dollar-HKD' => 'HKD',
			'Ft-Hungarian Forint-HUF' => 'HUF', '₪-Israeli New Sheqel-ILS' => 'ILS',
			'¥-Japanese Yen-JPY' => 'JPY', 'RM-Malaysian Ringgit-MYR' => 'MYR',
			'Mex$-Mexican Peso-MXN' => 'MXN', 'kr-Norwegian Krone-NOK' => 'NOK',
			'$-New Zealand Dollar-NZD' => 'NZD', '₱-Philippine Peso-PHP' => 'PHP',
			'zł-Polish Zloty-PLN' => 'PLN', '£-Pound Sterling-GBP' => 'GBP',
			'руб-Russian Ruble-RUB' => 'RUB', 'S$-Singapore Dollar-SGD' => 'SGD',
			'kr-Swedish Krona-SEK' => 'SEK', 'CHF-Swiss Franc-CHF' => 'CHF',
			'NT$-Taiwan New Dolla-TWD' => 'TWD', '฿-Thai Baht-THB' => 'THB',
			'も-Turkish Lira-TRY' => 'TRY', '$-U.S. Dollar-USD' => 'USD'
		);
		if (!empty($cur)) {
			return $currency[$cur];
		} else {
			return $currency;
		}
	}


	public static function getCountryList($country = null)
	{
		$countries = Country::find()->all();
		$countryArray[""] = "Select Country";
		foreach ($countries as $countryDetail) {
			$countryArrayIndex = $countryDetail->code . '-' . $countryDetail->countryname;
			$countryArray[$countryArrayIndex] = $countryDetail->countryname;
		}
		if ($country == null) {
			return $countryArray;
		} else {
			return $countryArray[$country];
		}
	}
}
