<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Devices;
use Illuminate\Support\Facades\URL;

class UserController extends Controller
{
	public function index(Request $request, $user = null)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = "name";
		$search = "";
		if ($user == "approved") {
			$approved = 1;
			$paginate = User::where('role','user')->where('status',1)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','user')->where('status',1)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','user')->where('status',1)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} else {
				$users = User::where('role','user')->where('status',1)->get()->sortByDesc('updated_at', SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		}
		elseif($user == 'pending'){
			$approved = 0;// pending
			$paginate = User::where('role','user')->where('status',0)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','user')->where('status',0)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','user')->where('status',0)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} else {
				$users = User::where('role','user')->where('status',0)->get()->sortByDesc('created_at', SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		}
		else{
			$approved = 2;// deleted
			$paginate = User::where('role','user')->where('status',2)->paginate($perPage);
			if ($sortby && $sortorder) {
				$users = User::where('role','user')->where('status',2)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role','user')->where('status',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				}
			} else {
				$users = User::where('role','user')->where('status',2)->get()->sortByDesc('created_at', SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			}
		}
		$userrecords = array_slice($users, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder,'search_for' => $search_for));

		$dependencyInfo = [];
		if ($approved == 2) {
			foreach ($userrecords as $record) {
				$oid = new \MongoDB\BSON\ObjectID($record['_id']);
				$dependencyInfo[$record['_id']] = [
					'reviews' => Review::where('userId', $oid)->count(),
					'devices' => Devices::where('user_id', $record['userId'] ?? '')->count(),
				];
			}
		}

		return view('admin.users.index', ['userrecords' => $userrecords, 'pagination' => $pagination,'search_for' => $search_for,'search'=>$search,'approved' => $approved, 'dependencyInfo' => $dependencyInfo]);
	}

	public function show(Request $request, $id)
	{
		$milliseconds = null;
		$lastActive = null;
		$user = User::findOrFail($id);
		$userdate = $user->createdAt;
		$usertime = $userdate->toDateTime();
		$userJoined = $usertime->format('d-M-Y');
		$bookingCount = Booking::where('userId',new \MongoDB\BSON\ObjectID($id))->where('bookedType', '!=', 'userneeds')->count();
		$userJobs = Booking::where('bookedType','userneeds')->where('userId',new \MongoDB\BSON\ObjectID($id))->count();
		if ($user->lastActive != null) {
			$milliseconds = (string) $user->lastActive;
			$utcdatetime = new \MongoDB\BSON\UTCDateTime($milliseconds);
			$lastActive = $utcdatetime->toDateTime();
			$localtime = $lastActive->setTimeZone(new \DateTimeZone('Asia/Kolkata'));
			$lastActive = $localtime->format('Y-m-d h:i:s') . PHP_EOL;
		}
		return view('admin.users.show', ['user' => $user,'userJoined' => $userJoined, 'bookingCount' => $bookingCount,'userJobs' => $userJobs,'lastActive' => $lastActive]);
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
	public function edit(Request $request, $id)
	{
		$user = User::findOrFail($id);
		session()->put('categoryPage', URL::previous());
		return view('admin.users.edit', ['user' => $user]);
        
	}
	public function update(Request $request,$id)
    {
    	// ...................Validation starts here...............
            $this->validate(
                $request,
                [
                    'name' => 'required|min:3|max:30',
                    'email' => 'required|email|unique:users,email,'. $id . ',_id',
                    'mobile' => 'required|numeric|unique:users,mobile,'. $id . ',_id',
                ],
                [
                    'name.required' => __('messages.Please enter user name.'),
                    'name.min' => __('messages.The name must be at least 3 characters.'),
                    'name.max' => __('messages.The name may not be greater than 30 characters.'),
                    'email.required' => __('messages.Please enter user E-mail.'),
					'mobile.required' => __('messages.Please enter user mobile number.'),
					'mobile.regex' => __('messages.Please enter valid mobile number.'),
                ]
            );
        // ...................Ends here...............
        // ...................Update function...............
			$user = User::findOrFail($id);
            $user->name = $request->name;
            $user->email = $request->email;
            $user->mobile = $request->mobile;
			$user->save();
            if ($user->save()) {
                $notification = array(
                    'message' => trans('messages.User details has been updated successfully'),
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
        // ...................Ends here...............
    }

	public function search(Request $request, $user = null)
	{
		$page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
		$perPage = 10;
		$search =$request->input('search');
		$sortby = $request->input('sort');
		$sortorder = $request->input('direction');
		$search_for = (!$request->input('search_for')) ? "name" : $request->input('search_for');
		if ($user == "approved") {
			$approved = 1;
			if ($search) {
				$paginate = User::where('role', 'user')->where('status',1)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'user')->where('status',1)->where($search_for, 'like', "%$search%")->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			} else {
				$search = "";
				$paginate = User::where('role','user')->where('status',1)->paginate($perPage);
				$users = User::where('role', 'user')->where('status',1)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role', 'user')->where('status',1)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}	
		}	
		elseif ($user == "pending") {
			$approved = 0;// pending
			if ($search) {
				$paginate = User::where('role', 'user')->where('status',0)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'user')->where('status',0)->where($search_for, 'like', "%$search%")->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			} else {
				$search = "";
				$paginate = User::where('role','user')->where('status',0)->paginate($perPage);
				$users = User::where('role', 'user')->where('status',0)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role', 'user')->where('status',0)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}	
		}
		else {
			$approved = 2;// pending
			if ($search) {
				$paginate = User::where('role', 'user')->where('status',2)->where($search_for, 'like', "%$search%")->paginate($perPage);
				$users = User::where('role', 'user')->where('status',2)->where($search_for, 'like', "%$search%")->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
			} else {
				$search = "";
				$paginate = User::where('role','user')->where('status',2)->paginate($perPage);
				$users = User::where('role', 'user')->where('status',2)->get()->sortByDesc($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				if ($sortorder == 'asc') {
					$users = User::where('role', 'user')->where('status',2)->get()->sortBy($sortby, SORT_NATURAL | SORT_FLAG_CASE)->toArray();
				} 
			}	
		}
		$userrecords = array_slice($users, $perPage * ($page - 1), $perPage);
		$pagination = $paginate->appends(array('sort' => $sortby, 'direction' => $sortorder, 'search' => $search,'search_for' => $search_for ));

		$dependencyInfo = [];
		if ($approved == 2) {
			foreach ($userrecords as $record) {
				$oid = new \MongoDB\BSON\ObjectID($record['_id']);
				$dependencyInfo[$record['_id']] = [
					'reviews' => Review::where('userId', $oid)->count(),
					'devices' => Devices::where('user_id', $record['userId'] ?? '')->count(),
				];
			}
		}

		return view('admin.users.index', compact(['userrecords', 'search', 'sortby', 'sortorder', 'pagination','search_for','approved']) + ['dependencyInfo' => $dependencyInfo]);
		
	}

	public function changeuserstatus($userId, $userStatus)
	{

		$user = User::where('userId',$userId)->where('role','user')->first();
		// print_r($user);

		// die;
		$user->status = intval($userStatus);
		$user->save();

		return redirect()->back();
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
			$users    = User::where('role', 'user')->where('status', 1)->orderBy('created_at', 'desc')->get();
			$filename = 'users_approved.csv';
		} elseif ($filter === 'pending') {
			$users    = User::where('role', 'user')->where('status', 0)->orderBy('created_at', 'desc')->get();
			$filename = 'users_pending.csv';
		} else {
			$users    = User::where('role', 'user')->where('status', 2)->orderBy('created_at', 'desc')->get();
			$filename = 'users_deleted.csv';
		}

		$headers = [
			'Content-Type'        => 'text/csv; charset=UTF-8',
			'Content-Disposition' => 'attachment; filename="' . $filename . '"',
			'Pragma'              => 'no-cache',
			'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
			'Expires'             => '0',
		];

		$statusMap = [0 => 'Pending', 1 => 'Approved', 2 => 'Deleted'];

		$callback = function () use ($users, $statusMap) {
			$handle = fopen('php://output', 'w');
			fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM for Excel
			fputcsv($handle, ['Name', 'Email', 'Mobile', 'Status', 'Created At', 'Last Active']);

			foreach ($users as $user) {
				$createdAt  = static::formatMongoDate($user->createdAt ?? null);
				$lastActive = static::formatMongoDate($user->lastActive ?? null);

				fputcsv($handle, [
					$user->name,
					$user->email,
					$user->mobile,
					$statusMap[$user->status] ?? $user->status,
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
		$user = User::findOrFail($id);
		$oid = new \MongoDB\BSON\ObjectID($id);

		$activeBookings = Booking::where('userId', $oid)
			->whereIn('status', ['accepted', 'paid', 'started'])
			->count();

		if ($activeBookings > 0) {
			$notification = [
				'message' => 'Cannot permanently delete: user has ' . $activeBookings . ' active booking(s). Resolve them first.',
				'alert-type' => 'error',
			];
			session()->put('notification', $notification);
			return redirect()->back();
		}

		Booking::where('userId', $oid)->where('status', 'requested')->update(['status' => 'cancelled']);
		Review::where('userId', $oid)->delete();
		Devices::where('user_id', $user->userId ?? '')->delete();

		$user->delete();

		$notification = [
			'message' => 'User permanently deleted.',
			'alert-type' => 'success',
		];
		session()->put('notification', $notification);
		return redirect()->route('user.index');
	}
}