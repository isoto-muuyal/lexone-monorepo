<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Subcategory;
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

class ServiceController extends Controller
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
		$paginate = Service::paginate($perPage);
		if ($sortby && $sortorder) {
			$services = Service::get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			if ($sortorder == 'asc') {
				$services = Service::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		} else {
			$services = Service::orderBy('created_at', 'desc')->get()->toArray();
		}
		$servicerecords = array_slice($services, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
		return view('admin.services.index', ['servicerecords' => $servicerecords, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search]);
	}

	public function addservice(Request $request)
	{	
		$maincategories = Category::where('status',1)->get();
		$setting = Setting::first();
		$availLanguages = $setting->availableLanguages;
		$names = null;
		foreach($availLanguages as $availLanguage){
			if($availLanguage != 'ar'){
			$names =  $this->CategoryController->getLocaleCodeForDisplayLanguage($availLanguage);
			$languages[] = [
				'language' => $names,
				'code' => $availLanguage,
				'langcode'=>strtolower($names)."Name"
			];
		}
		}
		return view('admin.services.create', ['maincategories' => $maincategories,'languages'=>$languages,'setting'=>$setting]);
	}

	public function storeservice(Request $request)
	{	
		$this->validation($request);
		$name = $request->service_name;
		// $nameAr = $request->arabicName;
		$nameFr = $request->frenchName;
		$mainCategory = $request->service_category_parent;
		$subCategory = $request->service_subcategory_parent;

		$service_names = Service::where('name', $name)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();
		$service_names1 = Service::where('name', $name)->count();
		//print_r($service_names1);
		if($service_names1 >= 1){
			
			$notification = array(
				'message' => trans('messages.Service Already Exists'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}

		//$ServiceNames_ar = Service::where('arabicName', $nameAr)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();
		// if($ServiceNames_ar >= 1){
		// 	$notification = array(
		// 		'message' => trans('messages.The arabic name has already been taken for the given parent category.'),
		// 		'alert-type' => 'error',
		// 	);
		// 	session()->put('notification', $notification);
		// 	return redirect()->back();
		// }
		$ServiceNames_fr = Service::where('frenchName', $nameFr)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();
		$ServiceNames_fr1 = Service::where('frenchName', $nameFr)->count();
		if($ServiceNames_fr1 >= 1){
			$notification = array(
				'message' => trans('messages.The french name has already been taken for the given parent category.'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}
		// foreach($ServiceNames_ar as $ServiceName_ar){
		// 	if ($ServiceName_ar) {
		// 		if ($ServiceName_ar->arabicName == $nameAr){
		// 			if ($ServiceName_ar->mainCategory == $request->service_category_parent){
		// 				if ($ServiceName_ar->subCategory == $request->service_subcategory_parent){	
		// 					$notification = array(
		// 						'message' => trans('messages.Service Already Exists'),
		// 						'alert-type' => 'error',
		// 					);
		// 					session()->put('notification', $notification);
		// 					return redirect()->back();
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		// foreach($ServiceNames_fr as $ServiceName_fr){
		// 	if ($ServiceName_fr) {
		// 		if ($ServiceName_fr->frenchName == $nameFr){
		// 			if ($ServiceName_fr->mainCategory == $request->service_category_parent){
		// 				if ($ServiceName_fr->subCategory == $request->service_subcategory_parent){	
		// 					$notification = array(
		// 						'message' => trans('messages.Service Already Exists'),
		// 						'alert-type' => 'error',
		// 					);
		// 					session()->put('notification', $notification);
		// 					return redirect()->back();
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		// foreach($service_names as $service_name){
		// 	if ($service_name) {
		// 		if ($service_name->name == $name){
		// 			if ($service_name->mainCategory == $request->service_category_parent){
		// 				if ($service_name->subCategory == $request->service_subcategory_parent){	
		// 					$notification = array(
		// 						'message' => trans('messages.Service Already Exists'),
		// 						'alert-type' => 'error',
		// 					);
		// 					session()->put('notification', $notification);
		// 					return redirect()->back();
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		$maincategory = Category::where("_id",$request->get('service_category_parent'))->first();
		if ($maincategory->type == 'professional') {

			$setting = Setting::first();
			if($setting->minimumAmount > (float)round($request->service_cost,2)){
				$notification = array(
					'message' => trans('Service cost must be above minimum amount'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
			$service = Service::updateOrCreate(
				['name' => $name,
				'mainCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_category_parent')),
				'subCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_subcategory_parent')) ],
				[
					'status' =>(int)$request->service_status,
					'serviceCost' =>(float)round($request->service_cost,2),
					'frenchName'=>$nameFr
					// 'arabicName'=>$nameAr
				],
				['upsert' => true]
			);
			$service->costType = $request->service_cost_type;
		}
		elseif ($maincategory->type == 'marketplace') {
			$service=Service::updateOrCreate(
				['name' => $name,
				'mainCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_category_parent')),
				'subCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_subcategory_parent')) ],
				[
					'status' =>(int)$request->service_status,
					'frenchName'=>$nameFr
					// 'arabicName'=>$nameAr
				],
				['upsert' => true]
			);
			$service->costType = "hour";
		}

		if ($request->file('service_image')) {
			$filename = Str::random(6);
			$extension = $request->file('service_image')->getClientOriginalExtension();
			$fileNameToStore = $filename.'_'.time().'.'.$extension;
			$destinationPath = public_path('/services/thumbnail');
			
			$img = Image::make($request->file('service_image'))->resize(300, 300, function ($constraint) {
			$constraint->aspectRatio();
			})->stream();

			// $img->save();

			Storage::disk('public')->put('services/thumbnail/'.$fileNameToStore,$img);
			$path = $request->file('service_image')->storeAs('public/services',$fileNameToStore);
			$service->image = $fileNameToStore;
			$service->save();
		}
		if ($service->save()) {
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
		session()->put('notification', $notification);
		return redirect()->route('service.home');
	}


	public function showService($serviceId)
	{	
		$servicedetail = Service::find($serviceId);
		$maincategory = Category::where('_id',$servicedetail->mainCategory)->first();
		$subcategory = Subcategory::where('_id',$servicedetail->subCategory)->first();
		$professionalPrice = Pricing::where('serviceId',new \MongoDB\BSON\ObjectID($serviceId))->get();
		$taskers = User::where('role','tasker')->where('status',1)->where('serviceIds',$serviceId)->get();
		if( sizeof($taskers) == 0 ) {
			$taskers = "";
		}
		$setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
		$price_required = false;
		if($maincategory->type == "professional"){
			$price_required = true;
		}
        return view('admin.services.show', ['servicedetail' => $servicedetail,'maincategory' => $maincategory,'subcategory' => $subcategory,'price_required' => $price_required,'professionalPrice' =>$professionalPrice,'taskers' => $taskers,'currencySymbol' => $currencySymbol]);
	}

	public function editService($serviceId)
	{	
		$servicedetails = Service::find($serviceId);
		$maincategories = Category::get();
		$parentCategory = Category::where("_id",$servicedetails->mainCategory)->first();
		$subcategories = Subcategory::where("parentCategory",new \MongoDB\BSON\ObjectID($servicedetails->mainCategory))->get();
		$price_required = false;
		if($parentCategory->type == "professional"){
			$price_required = true;
		}
		session()->put('categoryPage', URL::previous());
		$setting = Setting::first();
		$availLanguages = $setting->availableLanguages;
		$names = null;
		foreach($availLanguages as $availLanguage){
			if($availLanguage != 'ar'){
			$names =   $this->CategoryController->getLocaleCodeForDisplayLanguage($availLanguage);
			$languages[] = [
				'language' => $names,
				'code' => $availLanguage,
				'langcode'=>strtolower($names)."Name"
			];
		}
	}
        return view('admin.services.edit', ['servicedetails' => $servicedetails,'maincategories' => $maincategories,'subcategories' => $subcategories,'price_required' => $price_required,'languages'=>$languages,'setting'=>$setting]);
	}

	public function updateService(Request $request, $serviceId)
	{	
		$this->validation($request);
		
		$service = Service::find($serviceId);
		$name = $request->service_name;
		// $nameAr = $request->arabicName;
		$nameFr = $request->frenchName;
		$mainCategory = $request->service_category_parent;
		$subCategory = $request->service_subcategory_parent;

		$setting = Setting::first();
		// if($setting->minimumAmount > (float)round($request->service_cost,2)){
		// 	$notification = array(
		// 		'message' => trans('Service cost must be above minimum amount'),
		// 		'alert-type' => 'error',
		// 	);
		// 	session()->put('notification', $notification);
		// 	return redirect()->back();
		// }
		$service_names = Service::where('name', $name)->where('_id','!=',$serviceId)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();

		if($service_names >= 1){
			$notification = array(
				'message' => trans('messages.Service Already Exists'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}
		//$ServiceNames_ar = Service::where('arabicName', $nameAr)->where('_id','!=',$serviceId)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();
		// if($ServiceNames_ar >= 1){
		// 	$notification = array(
		// 		'message' => trans('messages.The arabic name has already been taken for the given parent category.'),
		// 		'alert-type' => 'error',
		// 	);
		// 	session()->put('notification', $notification);
		// 	return redirect()->back();
		// }
		$ServiceNames_fr = Service::where('frenchName', $nameFr)->where('_id','!=',$serviceId)->where('mainCategory',new \MongoDB\BSON\ObjectID($mainCategory))->where('subCategory',new \MongoDB\BSON\ObjectID($subCategory))->count();
		if($ServiceNames_fr >= 1){
			$notification = array(
				'message' => trans('messages.The french name has already been taken for the given parent category.'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}
		// if($service->name != $name){
		// 	$service_names = Service::where('name', $name)->get();
		// 	$ServiceNames_ar = Service::where('arabicName', $nameAr)->get();
		// 	$ServiceNames_fr = Service::where('frenchName', $nameFr)->get();
		// 	foreach($service_names as $service_name){
		// 		if ($service_name) {
		// 			if ($service_name->name == $name){
		// 				if ($service_name->mainCategory == $request->service_category_parent){
		// 					if ($service_name->subCategory == $request->service_subcategory_parent){	
		// 						$notification = array(
		// 							'message' => trans('messages.Service Already Exists'),
		// 							'alert-type' => 'error',
		// 						);
		// 						session()->put('notification', $notification);
		// 						return redirect()->back();
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	foreach($ServiceNames_ar as $ServiceName_ar){
		// 		if ($ServiceName_ar) {
		// 			if ($ServiceName_ar->arabicName == $nameAr){
		// 				if ($ServiceName_ar->mainCategory == $request->service_category_parent){
		// 					if ($ServiceName_ar->subCategory == $request->service_subcategory_parent){	
		// 						$notification = array(
		// 							'message' => trans('messages.Service Already Exists'),
		// 							'alert-type' => 'error',
		// 						);
		// 						session()->put('notification', $notification);
		// 						return redirect()->back();
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	foreach($ServiceNames_fr as $ServiceName_fr){
		// 		if ($ServiceName_fr) {
		// 			if ($ServiceName_fr->frenchName == $nameFr){
		// 				if ($ServiceName_fr->mainCategory == $request->service_category_parent){
		// 					if ($ServiceName_fr->subCategory == $request->service_subcategory_parent){	
		// 						$notification = array(
		// 							'message' => trans('messages.Service Already Exists'),
		// 							'alert-type' => 'error',
		// 						);
		// 						session()->put('notification', $notification);
		// 						return redirect()->back();
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		$maincategory = Category::where("_id",$request->get('service_category_parent'))->first();
		if ($maincategory->type == 'professional') {
			Service::updateOrCreate([
				'_id'=>$service->id,],
				['name' => $name,
				'mainCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_category_parent')),
				'subCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_subcategory_parent')),
				'status' =>(int) $request->service_status,
				'serviceCost' => (float)$request->service_cost,
				'costType' => $request->service_cost_type,
				'frenchName'=>$nameFr
				// 'arabicName'=>$nameAr
			]);
		}
		elseif ($maincategory->type == 'marketplace') {
			Service::updateOrCreate([
			'_id'=>$service->id],
			['name' => $name,
			'mainCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_category_parent')),
			'subCategory'=>new \MongoDB\BSON\ObjectID($request->get('service_subcategory_parent')),
			'status' => (int) $request->service_status,
			'frenchName'=>$nameFr
			// 'arabicName'=>$nameAr
			]);
			$service->costType = "hour";
		}
		if ($request->file('service_image')) {
			$filename = Str::random(6);
			$extension = $request->file('service_image')->getClientOriginalExtension();
			$fileNameToStore = $filename.'_'.time().'.'.$extension;

			$destinationPath = public_path('/services/thumbnail');
			
			$img = Image::make($request->file('service_image'))->resize(300, 300, function ($constraint) {
			$constraint->aspectRatio();
			})->stream();
			Storage::disk('public')->put('services/thumbnail/'.$fileNameToStore,$img);
			$path = $request->file('service_image')->storeAs('public/services',$fileNameToStore);
			$file_path = storage_path()."/app/public/services/".$service->image;
			$this->unlink($file_path); 
			$service->image = $fileNameToStore;
			$service->save();
		}
		// changing child values
			$pricings = Pricing::where('mainCategory',new \MongoDB\BSON\ObjectID($serviceId))->get();
			foreach($pricings as $pricing){
				$pricing->mainCategory = new \MongoDB\BSON\ObjectID($request->service_category_parent);
				$pricing->subCategory = new \MongoDB\BSON\ObjectID($request->service_subcategory_parent);
				$pricing->save();
			}
		// ends here
		if ($service->save()) {
			$notification = array(
				'message' => trans('messages.Service has been Updated successfully'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
		session()->put('notification', $notification);
		$categoryPage =  session()->get('categoryPage');
		return redirect($categoryPage);
	}

	public function ajaxsubcategories(Request $request)
	{	
		if($request->ajax()){
			$price_required = false;
			$maincategory = Category::where("_id",$request->category_id)->first();
			$subcategories = Subcategory::where("parentCategory",new \MongoDB\BSON\ObjectID($request->category_id))->where('status',1)->get();
			$setting = Setting::first();
			if($maincategory->type === "professional"){
				$price_required = true;
			}
			$data = view('admin.ajax.subcategories-select',compact('maincategory','subcategories','price_required','setting'))->render();
			return response()->json(['html'=>$data,'price_required'=>$price_required]);
		}
	}
	public function changeservicestatus($serviceId, $serviceStatus)
	{
		$service = Service::where('_id',$serviceId)->orderBy('_id', 'desc')->first();
		if($serviceStatus == 1){
			$subCategory = Subcategory::where('_id', $service->subCategory)->first();
			if($subCategory->status == 0){
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
		$search =$request->input('search');
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
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for ));
		return view('admin.services.index', compact(['servicerecords', 'search', 'sortby', 'sortorder', 'pagination','search_for']));
	}

	public function unlink($file_path)
	{	
		if(file_exists($file_path)){
			unlink($file_path);
		}
	}
	public function validation(Request $request)
	{	
		$this->validate(
			$request,
			[
				'service_name' => 'required|min:3|max:30',
				'service_category_parent' => 'required',
				'service_subcategory_parent' => 'required',
				'service_status' => 'required',
				//'arabicName' => 'required',
				'frenchName' => 'required',
				'service_image' => 'image|mimes:jpeg,png,jpg|max:2000',
				'service_cost'=> 'min:1',
			],
			[
				'service_name.required' => __('messages.The service name field is required.'),
				//'arabicName.required' => __('messages.The arabic name field is required.'),
				'frenchName.required' => __('messages.The french name field is required.'),
				'service_name.regex' => __('messages.The service name only contain letters, hyphens and spaces.'),
				'service_name.min' => __('messages.The service name must be at least 3 characters.'),
				'service_name.max' => __('messages.The service name may not be greater than 30 characters.'),
				'service_category_parent.required' => __('messages.The main category field is required.'),
				'service_subcategory_parent.required' => __('messages.The sub category field is required.'),
		 		'service_cost.required' => __('messages.The service cost field is required.'),
				'service_image.required' => __('messages.The category image field is required.'),
				'service_image.required' => __('messages.The Image field is required'),
				'service_image.image' => __('messages.The uploaded is not an image'),
				'service_image.mimes' => __('messages.The shoulb be in jpeg, png or jpg format'),
				'service_image.max' => __('messages.The maximum size of the image exceeds'),
			]
		);
	}
}
