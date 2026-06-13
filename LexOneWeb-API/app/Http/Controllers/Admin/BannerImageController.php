<?php
namespace App\Http\Controllers\Admin;
// Added by vishnu kumar
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BannerImage;
use Illuminate\Support\Str;
use File;
use Image;
use Illuminate\Support\Facades\Storage;

class BannerImageController extends Controller
{
	public function index()
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$pagination = BannerImage::paginate($perPage);
		$bannerimage = BannerImage::orderBy('created_at', 'desc')->get()->toArray();
		$banners = array_slice($bannerimage, $perPage * ($page - 1), $perPage);
		return view('admin.bannerimage.index', ['banners' => $banners, 'bannerimage' => $bannerimage, 'pagination' => $pagination]);
	}

	public function addImage()
	{	
		return view('admin.bannerimage.create');
	}
	
	public function storeBannerImage(Request $request)
	{	
		
		// ...................Store function...............
			$this->validation($request);
			$banner = new BannerImage();
			$banner->url = $request->get('banner_image_url');
			$banner->status = (int)$request->get('banner_status');
			if ($request->file('banner_image')) {
				//	store file into disk
	            $bannername = Str::random(6);
	            $extension = $request->file('banner_image')->getClientOriginalExtension();
				$bannerNameToStore = $bannername.'_'.time().'.'.$extension;
				

				$destinationPath = public_path('/bannerimages/thumbnail');
				$img = Image::make($request->file('banner_image'))->resize(300, 300, function ($constraint) {
				$constraint->aspectRatio();
				})->stream();

				Storage::disk('public')->put('bannerimages/thumbnail/'.$bannerNameToStore,$img);
	            $path = $request->file('banner_image')->storeAs('public/bannerimages',$bannerNameToStore);
				$banner->image = $bannerNameToStore;
			}
			if ($banner->save()) {
				$notification = array(
					'message' => trans('messages.Banner has been saved successfully'),
					'alert-type' => 'success',
				);
			} else {
				$notification = array(
					'message' => trans('messages.Something went wrong'),
					'alert-type' => 'error',
				);
			}
			session()->put('notification', $notification);
			return redirect()->route('bannerimage.index');
		// ...................Ends here...............
	}
	public function showBannerImage(Request $request, $id)
	{
		$banner = BannerImage::findOrFail($id);
		return view('admin.bannerimage.show', ['banner' => $banner]);
	}
	public function editBannerImage(Request $request, $id)
	{
		$data = BannerImage::findOrFail($id);
		return view('admin.bannerimage.edit', ['data' => $data]);
	}
	 public function updateBannerImage(Request $request,$id)
    {
		// ...................Update function...............
			$this->validation($request);
	    	$banner_update = BannerImage::findOrFail($id);
			$banner_update->url = $request->get('banner_image_url');
			$banner_update->status = (int)$request->get('banner_status');
			if ($request->file('banner_image')) {
	            $bannername = Str::random(6);
	            $extension = $request->file('banner_image')->getClientOriginalExtension();
				$bannerNameToStore = $bannername.'_'.time().'.'.$extension;
				
				$destinationPath = public_path('/bannerimages/thumbnail');
				$img = Image::make($request->file('banner_image'))->resize(300, 300, function ($constraint) {
				$constraint->aspectRatio();
				})->stream();

				Storage::disk('public')->put('bannerimages/thumbnail/'.$bannerNameToStore,$img);
				$path = $request->file('banner_image')->storeAs('public/bannerimages',$bannerNameToStore);
				$file_path = storage_path()."/app/public/bannerimages/".$banner_update->image;
				$this->unlinkbanner($file_path); 
				$banner_update->image = $bannerNameToStore;
			}
			$banner_update->save();
			if ($banner_update->save()) {
			$notification = array(
				'message' => trans('messages.Banner has been Updated successfully'),
				'alert-type' => 'success',
			);
			} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
		session()->put('notification', $notification);
		return redirect()->route('bannerimage.index');
		// ...................Ends here...............
    }
 	public function deleteBannerImage($id)
    {
		$banner = BannerImage::findOrFail($id);
		$file_path = storage_path()."/app/public/bannerimages/".$banner->image;
		$this->unlinkbanner($file_path);
        BannerImage::destroy($id);
        $notification = array(
			'message' => trans('messages.Banner has been deleted'),
			'alert-type' => 'error',
		);
		session()->put('notification', $notification);
		return redirect()->back();
    }
    public function changeBannerStatus($id, $bannerstatus)
	{
		$banner = BannerImage::findOrFail($id);
		$banner->status = (int)$bannerstatus;
		if ($banner->status == 1) {
			$notification = array(
				'message' => trans('messages.Banner has been Enabled'),
				'alert-type' => 'success',
			);
		} else {
			$notification = array(
				'message' => trans('messages.Banner has been Disabled'),
				'alert-type' => 'error',
			);
		}
		$banner->save();
		session()->put('notification', $notification);
		return redirect()->back();
	}
	
	public function validation(Request $request)
	{	
		// ...................Validation starts here...............
			$regex = '/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/';
			$this->validate(
				$request,
				[
					'banner_image_url' => 'required|regex:'.$regex,
					'banner_image' => 'image|mimes:jpeg,png,jpg|max:2000|dimensions:min_width=1024,min_height=500',
					'banner_status' => 'required',
				],
				[
					'banner_image_url.required' => __('messages.The url field is required'),
					'banner_image_url.regex' => __('messages.Enter the valid url'),
					'banner_image.required' => __('messages.The Image field is required'),
					'banner_image.image' => __('messages.The uploaded is not an image'),
					'banner_image.mimes' => __('messages.The image should be in jpeg, png or jpg format'),
					'banner_image.max' => __('messages.The maximum size of the image exceeds'),
				]
			);
		// ...................Ends here...............
	}

	public function unlinkbanner($file_path)
	{	
		if(file_exists($file_path)){
			unlink($file_path);
		}
	}
}
