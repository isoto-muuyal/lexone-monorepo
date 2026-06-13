<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;
use App\Models\User;
use App\Models\Log;
use App\Models\Location;
use App\Models\Media;
use App\Models\Category;
use App\Models\Service;
use App\Models\Pricing;
use App\Models\Booking;
use App\Models\Bookingdetail;
use App\Models\Review;
use App\Models\Devices;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Admin\DashboardController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;


class TaskerController extends Controller
{
	protected $DashboardController;
    public function __construct(DashboardController $DashboardController)
    {
        $this->DashboardController = $DashboardController;
	}
	
	public function index(Request $request, $tasker = null)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = "name";
		$search ="";

		if (!$sortby || !$sortorder) {
			$sortby = "createdAt";
			$sortorder = "desc";
		}

		if ($tasker == "approved") {
			$approved = 1;
			$paginate = User::where('role','tasker')->where('verified',1)->where('status','<>',2)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','tasker')->where('verified',1)->where('status','<>',2)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','tasker')->where('verified',1)->where('status','<>',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} 
			else {
				$users = User::where('role','tasker')->where('verified',1)->where('status','<>',2)->orderBy('created_at','desc')->get()->toArray();

			}
		}
		elseif($tasker == 'pending') {
			$approved = 0;// pending
			$paginate = User::where('role','tasker')->where('verified',0)->where('status','<>',2)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','tasker')->where('verified',0)->where('status','<>',2)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','tasker')->where('verified',0)->where('status','<>',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} 
			else {
				$users = User::where('role','tasker')->where('verified',0)->where('status','<>',2)->orderBy('created_at','desc')->orderBy('updated_at','Desc')->get()->toArray();
			}
		}
		else{
			$approved = 2;// pending
			$paginate = User::where('role','tasker')->where('status',2)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','tasker')->where('status',2)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','tasker')->where('status',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} 
			else {
				$users = User::where('role','tasker')->where('status',2)->orderBy('created_at','desc')->orderBy('updated_at','Desc')->get()->toArray();
			}
		}
		$userrecords = array_slice($users, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));

		$dependencyInfo = [];
		if ($approved == 2) {
			foreach ($userrecords as $record) {
				$oid = new \MongoDB\BSON\ObjectID($record['_id']);
				$dependencyInfo[$record['_id']] = [
					'reviews'  => Review::where('taskerId', $oid)->count(),
					'media'    => Media::where('taskerId', $oid)->count(),
					'pricings' => Pricing::where('taskerId', $oid)->count(),
					'devices'  => Devices::where('user_id', $record['userId'] ?? '')->count(),
					'logs'     => Log::where('senderId', $oid)->orWhere('receiverId', $oid)->count(),
				];
			}
		}

		return view('admin.taskers.index', ['userrecords' => $userrecords, 'pagination' => $pagination,'search_for' => $search_for,'search' => $search,'approved' => $approved, 'dependencyInfo' => $dependencyInfo]);
	}

	public function search(Request $request, $tasker = null)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$search =$request->input('search');
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = (!$request->input('search_for')) ? "name" : $request->input('search_for');
		if ($tasker == "approved") {
			$approved = 1;
			if ($search) {
				$paginate = User::where('role', 'tasker')->where('verified',1)->where('status','<>',2)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'tasker')->where('verified',1)->where('status','<>',2)->where($search_for, 'like', "%$search%")->get()->toArray();
			} else {
				$search = "";
				$paginate = User::where('role','tasker')->where('verified',1)->where('status','<>',2)->paginate($perPage);
				$users = User::where('role', 'tasker')->where('verified',1)->where('status','<>',2)->get()->toArray();
				$users = array_reverse($users);
				if ($sortorder == 'asc') {
					$users = User::where('role', 'tasker')->where('verified',1)->where('status','<>',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}
		}
		elseif ($tasker == "pending") {
			$approved = 0;
			if ($search) {
				$paginate = User::where('role', 'tasker')->where('verified',0)->where('status','<>',2)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'tasker')->where('verified',0)->where('status','<>',2)->where($search_for, 'like', "%$search%")->get()->toArray();
			}else {
				$search = "";
				$paginate = User::where('role','tasker')->where('verified',0)->where('status','<>',2)->paginate($perPage);
				$users = User::where('role', 'tasker')->where('verified',0)->where('status','<>',2)->get()->toArray();
				$users = array_reverse($users);
				if ($sortorder == 'asc') {
					$users = User::where('role', 'tasker')->where('verified',0)->where('status','<>',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
					
				} 
			}

		}
		else{
			$approved = 2;
			if ($search) {
				$paginate = User::where('role', 'tasker')->where('status',2)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'tasker')->where('status',2)->where($search_for, 'like', "%$search%")->get()->toArray();
			}else {
				$search = "";
				$paginate = User::where('role','tasker')->where('status',2)->paginate($perPage);
				$users = User::where('role', 'tasker')->where('status',2)->get()->toArray();
				$users = array_reverse($users);
				if ($sortorder == 'asc') {
					$users = User::where('role', 'tasker')->where('status',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
					
				} 
			}
		}
		$userrecords = array_slice($users, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for,'approved' => $approved));

		$dependencyInfo = [];
		if ($approved == 2) {
			foreach ($userrecords as $record) {
				$oid = new \MongoDB\BSON\ObjectID($record['_id']);
				$dependencyInfo[$record['_id']] = [
					'reviews'  => Review::where('taskerId', $oid)->count(),
					'media'    => Media::where('taskerId', $oid)->count(),
					'pricings' => Pricing::where('taskerId', $oid)->count(),
					'devices'  => Devices::where('user_id', $record['userId'] ?? '')->count(),
					'logs'     => Log::where('senderId', $oid)->orWhere('receiverId', $oid)->count(),
				];
			}
		}

		return view('admin.taskers.index', compact(['userrecords', 'search', 'sortby', 'sortorder', 'pagination','search_for','approved']) + ['dependencyInfo' => $dependencyInfo]);
		
	}

	public function create()
	{	
		$cities = Location::all();
		$setting = Setting::first();
		$instantLocation = $setting->instantLocation;
		return view('admin.taskers.create', ['cities'=>$cities,"instantLocation"=>$instantLocation]);
	}

	public function store(Request $request)
	{	
        
		// ...................Store function...............
			// ...................Validation starts here...............
			$this->validate(
				$request,
				[
					'name' => 'required|min:3|max:30',
					'email' => 'required|email:rfc,dns|unique:users,email',
					'mobile' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:16|unique:users,mobile',
					'password' => 'required|string|min:6',
				],
				[
					'name.required' => __('messages.Please enter tasker name.'),
					'name.min' => __('messages.The name must be at least 3 characters.'),
					'name.max' => __('messages.The name may not be greater than 30 characters.'),
					'email.required' => __('messages.Please enter user E-mail.'),
					'mobile.required' => __('messages.Please enter user mobile number.'),
				]
			);
		// ...................Ends here...............
			$tasker = new User();
			$tasker->image = "user.png"; 
			$tasker->status = 1;
			$tasker->deviceMode = 1;
			$tasker->deviceActive = 0;
			$tasker->verified = 0;
			$name = $request->name;
			$tasker->name = $name;
			$tasker->userId =  Uuid::generate()->string;
			$tasker->email = $request->email;
			$tasker->mobile = $request->mobile;
			$tasker->about = $request->about;
			$tasker->location = $request->location;
			$tasker->role = "tasker";
			$password = $request->password;

			$hash = password_hash($password, PASSWORD_BCRYPT);
			$tasker->password = str_replace("$2y$", "$2b$", $hash);
			$tasker->devicePlatform = "android";
            $tasker->save();
            if ($tasker->save()) {
                $notification = array(
                    'message' => trans('messages.Tasker has been created successfully'),
                    'alert-type' => 'success',
                );
            } else {
                $notification = array(
                    'message' => trans('messages.Something went wrong'),
                    'alert-type' => 'error',
                );
            }
            session()->put('notification', $notification);
            return redirect()->route('tasker.index');
		// ...................Ends here...............
	}

	public function show(Request $request, $id)
	{
		$services = null;
		$milliseconds = null;
		$lastActive = null;
		$jobsCompleted = 0;
		$revenue = 0;
		$reward = 0;
		$tasker = User::findOrFail($id);
		$setting = Setting::first();
        $currencySymbol = $setting->currencySymbol;
		$pricings = Pricing::where('taskerId',new \MongoDB\BSON\ObjectID($id))->get();
		$documents = Media::where('for',"portfolio")->where('taskerId',new \MongoDB\BSON\ObjectID($id))->get();
		$revenues = Booking::where('taskerId',new \MongoDB\BSON\ObjectID($id))->where('status',"completed")->get();
		$totalJobs = $revenues->count();
		foreach($revenues as $price)
		{
			$revenue += $price->price;
			$reward += $price->reward;

		}
		
		foreach($pricings as $pricing){
			$services[] = Service::where('_id',new \MongoDB\BSON\ObjectID($pricing->serviceId))->first();
		}
		if ( $tasker->lastActive != null) {
			$milliseconds = (string) $tasker->lastActive;
			$utcdatetime = new \MongoDB\BSON\UTCDateTime($milliseconds);
			$datetime = $utcdatetime->toDateTime();
			$lastActive = $datetime->format('d-M-Y H:i:s');
		}
		
		return view('admin.taskers.show', ['tasker' => $tasker,'documents' => $documents,'pricings' => $pricings,'services' => $services,'revenues' => $revenues,'revenue' => $revenue,'lastActive' => $lastActive,'currencySymbol'=>$currencySymbol,'totalJobs'=>$totalJobs,'reward'=>$reward]);
	}

	public function edit(Request $request, $id)
	{
		$tasker = User::findOrFail($id);
		$taskerLocation = $tasker->location;
		$cities = Location::all();
		$setting = Setting::first();
		$instantLocation = $setting->instantLocation;
		session()->put('categoryPage', URL::previous());
		return view('admin.taskers.edit', ['tasker' => $tasker,'cities'=>$cities,'taskerLocation'=>$taskerLocation,"instantLocation"=>$instantLocation]);
	}

	public function update(Request $request,$id)
    {
		// ...................Update function...............
			$this->validate(
				$request,
				[
					'name' => 'required|min:3|max:30',
					'email' => 'required|email:rfc,dns|unique:users,email,'. $id . ',_id',
					'mobile' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:16|unique:users,mobile,'. $id . ',_id',
				],
				[
					'name.required' => __('messages.Please enter tasker name.'),
					'name.min' => __('messages.The name must be at least 3 characters.'),
					'name.max' => __('messages.The name may not be greater than 30 characters.'),
					'email.required' => __('messages.Please enter tasker E-mail.'),
					'mobile.required' => __('messages.Please enter tasker mobile number.'),
					'mobile.regex' => __('messages.Please enter valid mobile number.'),
				]
			);
			$tasker = User::findOrFail($id);
            $name = $request->name;
            $tasker->name = $name;
			$tasker->email = $request->email;
			$tasker->mobile = $request->mobile;
			$tasker->location = $request->location;
			$tasker->save();
			
            if ($tasker->save()) {
                $notification = array(
                    'message' => trans('messages.Tasker has been updated successfully'),
                    'alert-type' => 'success',
                );
            } else {
                $notification = array(
                    'message' => trans('messages.Something went wrong'),
                    'alert-type' => 'error',
                );
            }
			session()->put('notification', $notification);
			if ($tasker->verified == 0) {
				return redirect()->route('tasker.index');
			}
			else{
				$tasker = 'approved';
				return redirect()->route('tasker.index',[$tasker]);
			}
            
        // ...................Ends here...............
    }

	public function changeuserstatus($userId, $userStatus)
	{
		$user = User::where('userId',$userId)->where('role','tasker')->first();
		$user->status = intval($userStatus);
		$user->save();
		return redirect()->back();
	}

	public function pendingStatus($id, $taskerStatus)
	{
		$tasker = User::where('userId',$id)->where('role','tasker')->first();
		$start =  Carbon::now()->toDateTimeString();
		$start =  new \MongoDB\BSON\UTCDateTime(new \DateTime($start));
		if ($tasker->accountId == null) {
			$notification = array(
				'message' => trans('messages.Payment has not been filled'),
				'alert-type' => 'error',
			);
			session()->put('notification', $notification);
			return redirect()->back();
		}
		else{
			$setting = Setting::first();
			$stripe = new \Stripe\StripeClient(
				$setting->stripePrivateKey
			);
			$accountStatus = $stripe->accounts->retrieve(
				$tasker->accountId,
				[]
			);
			if ($accountStatus->charges_enabled == true) {
				$tasker->verified = intval($taskerStatus);
				$tasker->save();
			}
			else{
				$notification = array(
					'message' => trans('messages.Payment details has not been filled'),
					'alert-type' => 'error',
				);
				session()->put('notification', $notification);
				return redirect()->back();
			}
		}
		$user =  auth()->user();
		if ($tasker->verified == 1) {
			$email = $user->email;
			$subject='Your Account Verified';
			Mail::to($tasker->email)->send(new \App\Mail\TaskerConfirmationMail($email));
			// \Mail::to($tasker->email)->send(new \App\Mail\TaskerConfirmationMail($email));
			$notification = array(
				'message' => trans('messages.Tasker has been approved successfully'),
				'alert-type' => 'success',
			);
		}
		elseif ($tasker->verified == 0) {
			$notification = array(
				'message' => trans('messages.Tasker moved to pending'),
				'alert-type' => 'error',
			);
		}
		$log = new Log();
		$log->messageType = "Tasker Approval";
		$log->serviceId = ["Approval"];
		$log->isAdmin = 1;
		$log->type = "approval";
		$log->senderId =  new \MongoDB\BSON\ObjectID($tasker->id);
		$log->receiverId = new \MongoDB\BSON\ObjectID($tasker->id);
		$log->createdAt = $start;
		if ($tasker->verified == 1) {
			$log->messageTxt = "You have been approved by the admin";
		}
		else{
			$log->messageTxt = "You have been Unapproved by the admin";
		}
		$log->save();
		$response = $this->DashboardController->taskerNotification($tasker);
		session()->put('notification', $notification);
		return redirect()->back();
	}

	public function taskerDocument($id)
	{
		$documents = Media::where('for',"document")->where('taskerId', new \MongoDB\BSON\ObjectID($id))->get();
		$tasker = User::findOrFail($id);
		return view('admin.taskers.documentsindex', ['tasker' => $tasker,'documents' => $documents]);
	}
	public function restore(Request $request, $id)
	{
		$user = User::findOrFail($id);
		$user->status = 1;
		$user->save();
		if ($user->save()) {
			$notification = array(
				'message' => trans('messages.User details has been updated successfully'),
				'alert-type' => 'success',
			);
			return redirect()->back();
		} else {
			$notification = array(
				'message' => trans('messages.Something went wrong'),
				'alert-type' => 'error',
			);
		}
	}

	private static function formatMongoDate($value): string
	{
		if (!$value) {
			return '';
		}
		try {
			if ($value instanceof \MongoDB\BSON\UTCDateTime) {
				return $value->toDateTime()->format('Y-m-d H:i:s');
			}
			if (is_string($value)) {
				$ts = strtotime($value);
				return $ts ? date('Y-m-d H:i:s', $ts) : $value;
			}
		} catch (\Throwable $e) {}
		return '';
	}

	public function export($filter = null)
	{
		if ($filter === 'approved') {
			$taskers  = User::where('role', 'tasker')->where('verified', 1)->where('status', '<>', 2)->orderBy('created_at', 'desc')->get();
			$filename = 'taskers_verified.csv';
		} elseif ($filter === 'pending') {
			$taskers  = User::where('role', 'tasker')->where('verified', 0)->where('status', '<>', 2)->orderBy('created_at', 'desc')->get();
			$filename = 'taskers_unverified.csv';
		} else {
			$taskers  = User::where('role', 'tasker')->where('status', 2)->orderBy('created_at', 'desc')->get();
			$filename = 'taskers_deleted.csv';
		}

		$headers = [
			'Content-Type'        => 'text/csv; charset=UTF-8',
			'Content-Disposition' => 'attachment; filename="' . $filename . '"',
			'Pragma'              => 'no-cache',
			'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
			'Expires'             => '0',
		];

		$statusMap   = [0 => 'Disabled', 1 => 'Active', 2 => 'Deleted'];
		$verifiedMap = [0 => 'Unverified', 1 => 'Verified'];

		$callback = function () use ($taskers, $statusMap, $verifiedMap) {
			$handle = fopen('php://output', 'w');
			fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM for Excel
			fputcsv($handle, ['Name', 'Email', 'Mobile', 'Status', 'Verified', 'Location', 'Stripe Account ID', 'Created At', 'Last Active']);

			foreach ($taskers as $tasker) {
				$createdAt  = static::formatMongoDate($tasker->createdAt ?? null);
				$lastActive = static::formatMongoDate($tasker->lastActive ?? null);

				fputcsv($handle, [
					$tasker->name,
					$tasker->email,
					$tasker->mobile,
					$statusMap[$tasker->status] ?? $tasker->status,
					$verifiedMap[$tasker->verified] ?? $tasker->verified,
					$tasker->location ?? '',
					$tasker->accountId ?? '',
					$createdAt,
					$lastActive,
				]);
			}

			fclose($handle);
		};

		return response()->stream($callback, 200, $headers);
	}

	public function softDelete($id)
	{
		$user = User::findOrFail($id);
		$user->status = 2;
		$user->save();
		return redirect()->back();
	}

	public function destroy($id)
	{
		$tasker = User::findOrFail($id);
		$oid = new \MongoDB\BSON\ObjectID($id);

		$activeBookings = Booking::where('taskerId', $oid)
			->whereIn('status', ['accepted', 'paid', 'started'])
			->count();

		if ($activeBookings > 0) {
			$notification = [
				'message' => 'Cannot permanently delete: tasker has ' . $activeBookings . ' active booking(s). Resolve them first.',
				'alert-type' => 'error',
			];
			session()->put('notification', $notification);
			return redirect()->back();
		}

		Booking::where('taskerId', $oid)->where('status', 'requested')->update(['status' => 'cancelled']);
		Review::where('taskerId', $oid)->delete();
		Media::where('taskerId', $oid)->delete();
		Pricing::where('taskerId', $oid)->delete();
		Devices::where('user_id', $tasker->userId ?? '')->delete();
		Log::where('senderId', $oid)->orWhere('receiverId', $oid)->delete();

		$tasker->delete();

		$notification = [
			'message' => 'Tasker permanently deleted.',
			'alert-type' => 'success',
		];
		session()->put('notification', $notification);
		return redirect()->route('tasker.index');
	}
}