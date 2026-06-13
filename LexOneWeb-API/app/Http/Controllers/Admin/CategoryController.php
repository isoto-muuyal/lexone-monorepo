<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Support\Str;
use Image;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\URL;



class CategoryController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}

	//............ Category crud functions................
		public function index(Request $request, $search = null)
		{
			$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
			$perPage = 10;
			$sortby = $request->input('sort');
			$sortorder = $request->input('direction');
			$search_for = "name";
			$search = "";
			$paginate = Category::paginate($perPage);
			if ($sortby && $sortorder) {
				$categories = Category::get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$categories = Category::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} else {
				$categories = Category::orderBy('created_at', 'desc')->get()->toArray();
			}
			$categoryrecords = array_slice($categories, $perPage * ($page - 1), $perPage);
			$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));
			return view('admin.categories.index', ['categoryrecords' => $categoryrecords, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search]);
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
				$paginate = Category::where($search_for, 'like', "%$search%")->paginate($perPage);
				$categories = Category::where($search_for, 'like', "%$search%")->orderBy('created_at', 'desc')->get()->toArray();
			} else {
				$search = "";
				$paginate = Category::paginate($perPage);
				$categories = Category::orderBy('created_at', 'desc')->get()->toArray();
				if ($sortorder == 'asc') {
					$categories = Category::get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}
			$categoryrecords = array_slice($categories, $perPage * ($page - 1), $perPage);
			$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for ));
			return view('admin.categories.index', compact(['categoryrecords', 'search', 'sortby', 'sortorder', 'pagination','search_for']));
		}

		public function addcategory(Request $request)
		{	
			$setting = Setting::first();
			$availLanguages = $setting->availableLanguages;
			$names = null;
			foreach($availLanguages as $availLanguage){
				if($availLanguage != 'ar'){
				$names =  $this->getLocaleCodeForDisplayLanguage($availLanguage);
				$languages[] = [
					'language' => $names,
					'code' => $availLanguage,
					'langcode'=>strtolower($names)."Name",
				];
			}
		}
			return view('admin.categories.create',['setting' => $setting,'languages'=>$languages]);
		}

		public function storecategory(Request $request)
		{	
			$this->validation($request); 
			$name = $request->category_name;
			$category_name = Category::where('name', $name)->first();
			if ($category_name) {
				$notification = array(
					'message' => __('messages.Category Already exists'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();	
			}
			$category = new Category();
			$name = $request->get('category_name');
			$category->name = $name;
			$category->frenchName = $request->frenchName;
			// $category->arabicName = $request->arabicName;
			$category->locationType = $request->locationType;
			$category->type = $request->get('category_type');
			$category->status = (int)$request->get('category_status');
			$category->featured = (int)$request->get('category_feature');
			$category->description = $request->description;
			$category->descriptionFrench = $request->descriptionFrench;
			// $category->descriptionArabic = $request->descriptionArabic;
			$category->faq = $request->faq;
			$category->faqFrench = $request->faqFrench;
			// $category->faqArabic = $request->faqArabic;
			$category->about = $request->about;
			$category->aboutFrench = $request->aboutFrench;
			// $category->aboutArabic = $request->aboutArabic;
			if ($request->file('category_image')) {
				$filename = Str::random(6);
				$extension = $request->file('category_image')->getClientOriginalExtension();
				$fileNameToStore = $filename.'_'.time().'.'.$extension;
				$destinationPath = public_path('/categories/thumbnail');
				$img = Image::make($request->file('category_image'))->resize(300, 300, function ($constraint) {
				$constraint->aspectRatio();
				})->stream();
				Storage::disk('public')->put('categories/thumbnail/'.$fileNameToStore,$img);
				$path = $request->file('category_image')->storeAs('public/categories',$fileNameToStore);
				$category->image = $fileNameToStore;
			}
			if ($category->save()) {
				$notification = array(
					'message' => __('messages.Category has been saved successfully'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => __('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}
			session()->put('notification', $notification);
			return redirect()->route('category.home');
		}

		public function showCategory($categoryId)
		{	
			$categorydetail = Category::find($categoryId);
			$subcategorydetails = Subcategory::where('parentCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
	    	return view('admin.categories.show', ['categorydetail' => $categorydetail,'subcategorydetails' => $subcategorydetails]);
		}

		public function editcategory($categoryId)
		{	
			$categorydetails = Category::find($categoryId);
			session()->put('categoryPage', URL::previous());
			$setting = Setting::first();
			$availLanguages = $setting->availableLanguages;
			$names = null;
			foreach($availLanguages as $availLanguage){
				if($availLanguage != 'ar'){
				$names =  $this->getLocaleCodeForDisplayLanguage($availLanguage);
				$languages[] = [
					'language' => $names,
					'code' => $availLanguage,
					'langcode'=>strtolower($names)."Name",
					'langfaq'=>"faq".$names,
					'langabout'=>"about".$names,
					'langdesc'=>"description".$names,

				];
			}
		}
	        return view('admin.categories.edit', ['categorydetails' => $categorydetails,'languages'=>$languages]);
		}

		public function updatecategory(Request $request, $categoryId)
		{
			$this->validate(
				$request,
				[
					'category_name' => 'required|min:3|max:30|unique:categories,name,'. $categoryId . ',_id',
					'category_type' => 'required',
					// 'arabicName' => 'required|unique:categories,arabicName,'. $categoryId . ',_id',
					'frenchName' => 'required|unique:categories,frenchName,'. $categoryId . ',_id',
					'category_image' => 'image|mimes:jpeg,png,jpg|max:2000',
					'category_status' => 'required',
					'category_feature' => 'required',
					'description' => 'required|min:3|max:1200',
					'faq' => 'required|min:3|max:1200',
					'about' => 'required|min:3|max:1200',
					'locationType' => 'required',
					//'aboutArabic'=> 'required|min:3|max:1200',
					'aboutFrench'=> 'required|min:3|max:1200',
					//'faqArabic' => 'required|min:3|max:1200',
					'faqFrench' => 'required|min:3|max:1200',
					//'descriptionArabic' => 'required|min:3|max:1200',
					'descriptionFrench' => 'required|min:3|max:1200',
				],
				[
					'category_name.required' => __('messages.The category name field is required.'),
					'locationType.required' => __('messages.locationType field is required.'),
					'description.required' => __('messages.How It Works field is required.'),
					'faq.required' => __('messages.Faq field is required.'),
					'about.required' => __('messages.Description field is required.'),
					'category_name.regex' => __('messages.The category name may only contain letters, hyphens and spaces.'),
					'category_name.min' => __('messages.The category name must be at least 3 characters.'),
					'category_name.max' => __('messages.The category name may not be greater than 30 characters.'),
					'category_name.unique' => __('messages.The category name has already been taken.'),
				]
			);

			$category = Category::findOrFail($categoryId);
			$name = $request->get('category_name');
			$category->name = $request->category_name;
			$category->locationType = $request->locationType;
			$category->frenchName = $request->frenchName;
			// $category->arabicName = $request->arabicName;
			$category->type = $request->get('category_type');
			$category->status = (int)$request->get('category_status');
			$category->featured = (int)$request->get('category_feature');
			$category->description = $request->description;
			$category->faq = $request->faq;
			$category->about = $request->about;
			$category->descriptionFrench = $request->descriptionFrench;
			// $category->descriptionArabic = $request->descriptionArabic;
			$category->faqFrench = $request->faqFrench;
			// $category->faqArabic = $request->faqArabic;
			$category->about = $request->about;
			$category->aboutFrench = $request->aboutFrench;
			// $category->aboutArabic = $request->aboutArabic;
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
			$subcategorydetails = Subcategory::where('parentCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
			foreach($subcategorydetails as $subcategorydetail){
				$subcategorydetail->type = $request->category_type;
				$subcategorydetail->save();
			}
			$servicedetails = Service::where('mainCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
			foreach($servicedetails as $servicedetail){
				$servicedetail->type = $request->category_type;
				$servicedetail->save();
			}
			
			if ($category->save()) {
				$notification = array(
					'message' => __('messages.Category has been updated successfully'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => __('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}

			session()->put('notification', $notification);
			$categoryPage =  session()->get('categoryPage');
			return redirect($categoryPage);
		}

		public function changecategorystatus($categoryId, $categoryStatus)
		{
			$status = intval($categoryStatus);
			$category = Category::where('_id',$categoryId)->orderBy('_id', 'desc')->first();
			$category->status = $status;
			$services = Service::where('mainCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
			foreach ($services as $service) {
				$service->status = $status;
				$service->save();
			}
			$subCategories = Subcategory::where('parentCategory',new \MongoDB\BSON\ObjectID($categoryId))->get();
			foreach ($subCategories as $subCategory) {
				$subCategory->status = $status;
				$subCategory->save();
			}
			if ($category->status == 1) {
				$notification = array(
					'message' => __('messages.Category has been Enabled'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => __('messages.Category has been Disabled'),
					'alert-type' => 'error',
				);
			}
			$category->save();
			session()->put('notification', $notification);
			return redirect()->back();
		}

		public function showDetail($categoryId)
		{
			$categorydetail = Category::find($categoryId);
			$categorydetail->description = trim($categorydetail->description,"<p></p>");
			$categorydetail->faq = trim($categorydetail->faq,"<p></p>");
			$categorydetail->about = trim($categorydetail->about,"<p></p>");
	    	return view('admin.categories.detail', ['categorydetail' => $categorydetail]);
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
					'category_name' => 'required|min:3|max:30|unique:categories,name',
					//'arabicName' => 'required|unique:categories,arabicName',
					'frenchName' => 'required|unique:categories,frenchName',
					'category_type' => 'required',
					'locationType' => 'required',
					'category_image' => 'image|mimes:jpeg,png,jpg|max:2000',
					'category_status' => 'required',
					'category_feature' => 'required',
					'description' => 'required|min:3|max:1200',
					'faq' => 'required|min:3|max:1200',
					'about' => 'required|min:3|max:1200',
					//'aboutArabic'=> 'required|min:3|max:1200',
					'aboutFrench'=> 'required|min:3|max:1200',
					//'faqArabic' => 'required|min:3|max:1200',
					'faqFrench' => 'required|min:3|max:1200',
					//'descriptionArabic' => 'required|min:3|max:1200',
					'descriptionFrench' => 'required|min:3|max:1200',
				],
				[
					'category_name.required' => __('messages.The category name field is required.'),
					'locationType.required' => __('messages.locationType field is required.'),
					'description.required' => __('messages.How It Works field is required.'),
					'faq.required' => __('messages.Faq field is required.'),
					'about.required' => __('messages.Description field is required.'),
					'category_name.regex' => __('messages.The category name may only contain letters, hyphens and spaces.'),
					'category_name.min' => __('messages.The category name must be at least 3 characters.'),
					'category_name.max' => __('messages.The category name may not be greater than 30 characters.'),
					'category_name.unique' => __('messages.The category name has already been taken.'),
					'frenchName.unique' => __('messages.The french name has already been taken.'),
					//'arabicName.unique' => __('messages.The arabic name has already been taken.'),
				]
			);
			
		}
		public function getLocaleCodeForDisplayLanguage($name){
			$languageCodes = array(
				"Afar"=>"aa", 
				"Abkhazian"=>"ab", 
				"Avestan"=>"ae", 
				"Afrikaans"=>"af", 
				"Akan"=>"ak", 
				"Amharic"=>"am", 
				"Aragonese"=>"an", 
				"Arabic"=>"ar", 
				"Assamese"=>"as", 
				"Avaric"=>"av", 
				"Aymara"=>"ay", 
				"Azerbaijani"=>"az", 
				"Bashkir"=>"ba", 
				"Belarusian"=>"be", 
				"Bulgarian"=>"bg", 
				"Bihari"=>"bh", 
				"Bislama"=>"bi", 
				"Bambara"=>"bm", 
				"Bengali"=>"bn", 
				"Tibetan"=>"bo", 
				"Breton"=>"br", 
				"Bosnian"=>"bs", 
				"Catalan"=>"ca", 
				"Chechen"=>"ce", 
				"Chamorro"=>"ch", 
				"Corsican"=>"co", 
				"Cree"=>"cr", 
				"Czech"=>"cs", 
				"Church Slavic"=>"cu", 
				"Chuvash"=>"cv", 
				"Welsh"=>"cy", 
				"Danish"=>"da", 
				"German"=>"de", 
				"Divehi"=>"dv", 
				"Dzongkha"=>"dz", 
				"Ewe"=>"ee", 
				"Greek"=>"el", 
				"English"=>"en", 
				"Esperanto"=>"eo", 
				"Spanish"=>"es", 
				"Estonian"=>"et", 
				"Basque"=>"eu", 
				"Persian"=>"fa", 
				"Fulah"=>"ff", 
				"Finnish"=>"fi", 
				"Fijian"=>"fj", 
				"Faroese"=>"fo", 
				"French"=>"fr", 
				"Western Frisian"=>"fy", 
				"Irish"=>"ga", 
				"Scottish Gaelic"=>"gd", 
				"Galician"=>"gl", 
				"Guarani"=>"gn", 
				"Gujarati"=>"gu", 
				"Manx"=>"gv", 
				"Hausa"=>"ha", 
				"Hebrew"=>"he", 
				"Hindi"=>"hi", 
				"Hiri Motu"=>"ho", 
				"Croatian"=>"hr", 
				"Haitian"=>"ht", 
				"Hungarian"=>"hu", 
				"Armenian"=>"hy", 
				"Herero"=>"hz", 
				"Interlingua (International Auxiliary Language Association)"=>"ia",
				"Indonesian"=>"id",
				"Interlingue"=>"ie",
				"Igbo"=>"ig",
				"Sichuan Yi"=>"ii",
				"Inupiaq"=>"ik",
				"Ido"=>"io",
				"Icelandic"=>"is",
				"Italian"=>"it",
				"Inuktitut"=>"iu",
				"Japanese"=>"ja",
				"Javanese"=>"jv",
				"Georgian"=>"ka",
				"Kongo"=>"kg",
				"Kikuyu"=>"ki",
				"Kwanyama"=>"kj",
				"Kazakh"=>"kk",
				"Kalaallisut"=>"kl",
				"Khmer"=>"km",
				"Kannada"=>"kn",
				"Korean"=>"ko",
				"Kanuri"=>"kr",
				"Kashmiri"=>"ks",
				"Kurdish"=>"ku",
				"Komi"=>"kv",
				"Cornish"=>"kw",
				"Kirghiz"=>"ky",
				"Latin"=>"la",
				"Luxembourgish"=>"lb",
				"Ganda"=>"lg",
				"Limburgish"=>"li",
				"Lingala"=>"ln",
				"Lao"=>"lo",
				"Lithuanian"=>"lt",
				"Luba-Katanga"=>"lu",
				"Latvian"=>"lv",
				"Malagasy"=>"mg",
				"Marshallese"=>"mh",
				"Maori"=>"mi",
				"Macedonian"=>"mk",
				"Malayalam"=>"ml",
				"Mongolian"=>"mn",
				"Marathi"=>"mr",
				"Malay"=>"ms",
				"Maltese"=>"mt",
				"Burmese"=>"my",
				"Nauru"=>"na",
				"Norwegian Bokmal"=>"nb",
				"North Ndebele"=>"nd",
				"Nepali"=>"ne",
				"Ndonga"=>"ng",
				"Dutch"=>"nl",
				"Norwegian Nynorsk"=>"nn",
				"Norwegian"=>"no",
				"South Ndebele"=>"nr",
				"Navajo"=>"nv",
				"Chichewa"=>"ny",
				"Occitan"=>"oc",
				"Ojibwa"=>"oj",
				"Oromo"=>"om",
				"Oriya"=>"or",
				"Ossetian"=>"os",
				"Panjabi"=>"pa",
				"Pali"=>"pi",
				"Polish"=>"pl",
				"Pashto"=>"ps",
				"Portuguese"=>"pt",
				"Quechua"=>"qu",
				"Raeto-Romance"=>"rm",
				"Kirundi"=>"rn",
				"Romanian"=>"ro",
				"Russian"=>"ru",
				"Kinyarwanda"=>"rw",
				"Sanskrit"=>"sa",
				"Sardinian"=>"sc",
				"Sindhi"=>"sd",
				"Northern Sami"=>"se",
				"Sango"=>"sg",
				"Sinhala"=>"si",
				"Slovak"=>"sk",
				"Slovenian"=>"sl",
				"Samoan"=>"sm",
				"Shona"=>"sn",
				"Somali"=>"so",
				"Albanian"=>"sq",
				"Serbian"=>"sr",
				"Swati"=>"ss",
				"Southern Sotho"=>"st",
				"Sundanese"=>"su",
				"Swedish"=>"sv",
				"Swahili"=>"sw",
				"Tamil"=>"ta",
				"Telugu"=>"te",
				"Tajik"=>"tg",
				"Thai"=>"th",
				"Tigrinya"=>"ti",
				"Turkmen"=>"tk",
				"Tagalog"=>"tl",
				"Tswana"=>"tn",
				"Tonga"=>"to",
				"Turkish"=>"tr",
				"Tsonga"=>"ts",
				"Tatar"=>"tt",
				"Twi"=>"tw",
				"Tahitian"=>"ty",
				"Uighur"=>"ug",
				"Ukrainian"=>"uk",
				"Urdu"=>"ur",
				"Uzbek"=>"uz",
				"Venda"=>"ve",
				"Vietnamese"=>"vi",
				"Volapuk"=>"vo",
				"Walloon"=>"wa",
				"Wolof"=>"wo",
				"Xhosa"=>"xh",
				"Yiddish"=>"yi",
				"Yoruba"=>"yo",
				"Zhuang"=>"za",
				"Chinese"=>"zh",
				"Zulu"=>"zu",
				);
			return array_search($name, $languageCodes);
		}
	//............ Ends here................
}