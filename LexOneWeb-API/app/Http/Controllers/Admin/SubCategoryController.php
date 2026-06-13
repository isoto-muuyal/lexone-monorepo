<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Service;
use App\Models\Pricing;
use Illuminate\Support\Str;
use Image;
use Illuminate\Support\Facades\URL;
use App\Models\Setting;
use Illuminate\Validation\Rule;

class SubCategoryController extends Controller
{
	protected $CategoryController;
	public function __construct(CategoryController $CategoryController)
	{
		$this->middleware('auth');
		$this->CategoryController = $CategoryController;
	}
	//............ Sub-Category crud functions...............
		public function subcategories(Request $request)
		{
			$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
			$perPage = 10;
			$sortby = $request->input('sort');
			$sortorder = $request->input('direction');
			$search_for = "name";
			$search = "";
			$paginate = Subcategory::paginate($perPage);
			if ($sortby && $sortorder) {
				$categories = Subcategory::get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$categories = Subcategory::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} else {
				$categories = Subcategory::orderBy('created_at', 'desc')->get()->toArray();
			}
			$categoryrecords = array_slice($categories, $perPage * ($page - 1), $perPage);
			$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
			return view('admin.subcategories.index', ['categoryrecords' => $categoryrecords, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search]);
		}

		public function search(Request $request)
		{	
			$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
			$perPage = 10;
			$search =$request->input('search');
			$sortby = $request->input('sort');
			$sortorder = $request->input('direction');
			$search_for = (!$request->input('search_for')) ? "name" : $request->input('search_for');
			if ($search) {
				$paginate = Subcategory::where($search_for, 'like', "%$search%")->paginate($perPage);
				$categories = Subcategory::where($search_for, 'like', "%$search%")->orderBy('created_at', 'desc')->get()->toArray();
			} else {
				$search = "";
				$paginate = Subcategory::paginate($perPage);
				$categories = Subcategory::orderBy('created_at', 'desc')->get()->toArray();
				if ($sortorder == 'asc') {
					$categories = Subcategory::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}
			$categoryrecords = array_slice($categories, $perPage * ($page - 1), $perPage);
			$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for ));
			return view('admin.subcategories.index', compact(['categoryrecords', 'search', 'sortby', 'sortorder', 'pagination','search_for']));
		}

		public function addsubcategory(Request $request)
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
			return view('admin.subcategories.create', ['maincategories' => $maincategories,'languages'=>$languages]);
		}

		public function storesubcategory(Request $request)
		{
			$this->validation($request);
			$name = $request->category_name;
			// $nameAr = $request->arabicName;
			$nameFr = $request->frenchName;
			$parentCategory = $request->category_parent;
			$subcategory_names = Subcategory::where('name', $name)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			if($subcategory_names >= 1){
				$notification = array(
					'message' => trans('messages.The sub-category name has already been taken for the given parent category.'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
			// $subcategoryNames_ar = Subcategory::where('arabicName', $nameAr)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			// if($subcategoryNames_ar >= 1){
			// 	$notification = array(
			// 		'message' => trans('messages.The arabic name has already been taken for the given parent category.'),
			// 		'alert-type' => 'error',
			// 	);
			// 	session()->put('notification', $notification);
			// 	return redirect()->back();
			// }
			$subcategoryNames_fr = Subcategory::where('frenchName', $nameFr)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			if($subcategoryNames_fr >= 1){
				$notification = array(
					'message' => trans('messages.The french name has already been taken for the given parent category.'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
		
			
			$subcategory=Subcategory::updateOrCreate(
				['name' => $name,
				'parentCategory'=>new \MongoDB\BSON\ObjectID($request->category_parent),
				],
				['status' =>(int) $request->category_status,
				'frenchName'=>$request->frenchName
				// 'arabicName'=>$request->arabicName
			],
				['upsert' => true]
			);
			
			if ($request->file('category_image')) {
				$filename = Str::random(6);
				$extension = $request->file('category_image')->getClientOriginalExtension();
				$fileNameToStore = $filename.'_'.time().'.'.$extension;
				$destinationPath = public_path('/categories/thumbnail');
				$img = Image::make($request->file('category_image'))->resize(300, 300, function ($constraint) {
				$constraint->aspectRatio();
				})->stream();
				// $img->save();
				Storage::disk('public')->put('categories/thumbnail/'.$fileNameToStore,$img);
				$path = $request->file('category_image')->storeAs('public/categories',$fileNameToStore);
				$subcategory->image = $fileNameToStore;
				$subcategory->save();
			}
			if ($subcategory->save()) {
				$notification = array(
					'message' => trans('messages.Subcategory has been saved successfully'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => trans('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}
			session()->put('notification', $notification);
			return redirect()->route('subcategory.home');
		}

		public function showSubCategory($subcategoryId)
		{	
			$subcategorydetail = Subcategory::find($subcategoryId);
			$categories = Category::where('_id',new \MongoDB\BSON\ObjectID($subcategorydetail->parentCategory))->first();
			$services = Service::where('subCategory',new \MongoDB\BSON\ObjectID($subcategoryId))->get();
	    	return view('admin.subcategories.show', ['subcategorydetail' => $subcategorydetail,'categories' => $categories,'services' => $services]);
		}

		
		public function editsubcategory($categoryId)
		{	
			$maincategories = Category::get();
			$categorydetails = Subcategory::find($categoryId);
			session()->put('categoryPage', URL::previous());
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
	        return view('admin.subcategories.edit', ['categorydetails' => $categorydetails,'maincategories' => $maincategories,'languages' => $languages]);
		}

		public function updatesubcategory(Request $request,$categoryId)
		{	
			$this->validation($request);
			$category = Subcategory::findOrFail($categoryId);
			$name = $request->category_name;
			// $nameAr = $request->arabicName;
			$nameFr = $request->frenchName;
			$parentCategory = $request->category_parent;
			$subcategory_names = Subcategory::where('name', $name)->where('_id','!=',$categoryId)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			
			if($subcategory_names >= 1){
				$notification = array(
					'message' => trans('messages.The sub-category name has already been taken for the given parent category.'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
			// $subcategoryNames_ar = Subcategory::where('arabicName', $nameAr)->where('_id','!=',$categoryId)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			// if($subcategoryNames_ar >= 1){
			// 	$notification = array(
			// 		'message' => trans('messages.The arabic name has already been taken for the given parent category.'),
			// 		'alert-type' => 'error',
			// 	);
			// 	session()->put('notification', $notification);
			// 	return redirect()->back();
			// }
			$subcategoryNames_fr = Subcategory::where('frenchName', $nameFr)->where('_id','!=',$categoryId)->where('parentCategory',new \MongoDB\BSON\ObjectID($parentCategory))->count();
			if($subcategoryNames_fr >= 1){
				$notification = array(
					'message' => trans('messages.The french name has already been taken for the given parent category.'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
		
			Subcategory::updateOrCreate([
				'_id' => $category->id,
				],['parentCategory'=>new \MongoDB\BSON\ObjectID($request->category_parent),
				'name' => $name,'status' =>(int) $request->category_status,
				'frenchName'=>$nameFr
				// 'arabicName'=>$nameAr
			]);
			if ($request->file('category_image')) {
				$filename = Str::random(6);
				$extension = $request->file('category_image')->getClientOriginalExtension();
				$fileNameToStore = $filename.'_'.time().'.'.$extension;

				$destinationPath = public_path('/categories/thumbnail');
				$img = Image::make($request->file('category_image'))->resize(300, 300, function ($constraint) {
				$constraint->aspectRatio();
				})->stream();

				// $img->save();

				Storage::disk('public')->put('categories/thumbnail/'.$fileNameToStore,$img);


				
				$path = $request->file('category_image')->storeAs('public/categories',$fileNameToStore);
				$file_path = storage_path()."/app/public/categories/".$category->image;
				$this->unlink($file_path); 
				$category->image = $fileNameToStore;
			}
			
			// changing child values
				$services = Service::where('subCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
				foreach($services as $service){
					$service->mainCategory = new \MongoDB\BSON\ObjectID($request->category_parent);
					$service->save();
				}
				$pricings = Pricing::where('subCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
				foreach($pricings as $pricing){
					$pricing->mainCategory = new \MongoDB\BSON\ObjectID($request->category_parent);
					$pricing->save();
				}
			// ends here
			if ($category->save()) {
				$notification = array(
					'message' => trans('messages.Subcategory has been saved successfully'),
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


		public function changesubcategorystatus($categoryId, $categoryStatus)
		{
			$status = intval($categoryStatus);
			$category = Subcategory::where('_id',$categoryId)->orderBy('_id', 'desc')->first();
			if($status == 1){
				$mainCategory = Category::where('_id', $category->parentCategory)->first();
				if($mainCategory->status == 0){
					$notification = array(
						'message' => trans('messages.Activate the category to enable it'),
						'alert-type' => 'error',
					);
					session()->put('notification', $notification);
					return redirect()->back();
				}
			}
			$services = Service::where('subCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
			foreach ($services as $service) {
				$service->status = $status;
				$service->save();
			}
			$category->status = $status;
			if ($category->status == 1) {
				$notification = array(
					'message' => trans('messages.Subcategory has been Enabled'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => trans('messages.Subcategory has been Disabled'),
					'alert-type' => 'error',
				);
			}
			$category->save();
			session()->put('notification', $notification);
			return redirect()->back();
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
					'category_name' => 'required|min:3|max:30',
					//'arabicName' => 'required',
					'frenchName' => 'required',
					'category_parent'=>'required',
					'category_image' => 'image|mimes:jpeg,png,jpg|max:2000',
					'category_status' => 'required',
				],
				[
					'category_name.required' => trans('messages.The category name field is required.'),
					'category_parent'=> trans('messages.The parent category name field is required.'),
					'category_name.regex' => trans('messages.The category name may only contain letters, hyphens and spaces.'),
					'category_name.min' => trans('messages.The category name must be at least 3 characters.'),
					'category_name.max' => trans('messages.The category name may not be greater than 30 characters.'),
					'category_name.unique' => trans('messages.The category name has already been taken.'),
				]
			);
		}
	//............ Ends here................
}