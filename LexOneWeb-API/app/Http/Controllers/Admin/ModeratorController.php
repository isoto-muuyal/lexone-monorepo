<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maklad\Permission\Models\Role;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use DB;
use Auth;
use Crypt;

class ModeratorController extends Controller
{
	public function index()
	{
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $pagination = Admin::where('name','!=','Admin')->paginate($perPage);
        $admins = Admin::where('name','!=','Admin')->orderBy('created_at','Desc')->get()->toArray();
        $auth = Auth::user();
        $name =  $auth->name;  
        $admin = array_slice($admins, $perPage * ($page - 1), $perPage);
        return view('admin.moderators.index',['admin'=>$admin,'name'=>$name,'pagination' => $pagination]);
    }
    
	public function create()
	{	
        $roles = Role::where('name','!=','super admin')->get();
        return view('admin.moderators.create',compact('roles'));
    }
    
	public function store(Request $request)
	{	
        $this->validate(
            $request,
            [
                'name' => 'required|min:3|max:30|unique:admins,name',
                "email" => 'required|email:rfc,dns|unique:admins,email',
                'password' => "required|string|min:8",
                'roles'=>'required',
            ],
            [
                'name.required' => __('messages.Name is required'),
                'name.min' => __('messages.The name must be at least 3 characters.'),
                'name.max' => __('messages.The name may not be greater than 30 characters.'),
                'email.required' => __('messages.Email field is required'),
                'email.unique' => trans('messages.The email has already been taken.'),
                'roles'=> trans('messages.roles field is required.'),
            ]
        );
        $roles = $request->roles;
        $admin = new Admin();
        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->password = Hash::make($request->password);
        $admin->roles = $roles;
        $admin->save();
        $admin->assignRole($roles);
        return redirect()->route('admin.index');
    }
    
	public function show(Request $request, $id)
	{
        $admin = Admin::findOrfail($id);
        $role_ids = $admin->role_ids;
        foreach ($role_ids as $role_id) {
           $role[]= Role::where('_id',$role_id)->first();
        }
		return view('admin.moderators.show', ['admin' => $admin,'role'=>$role]);
    }
    
	public function edit(Request $request, $id)
	{
        $admin = Admin::findOrfail($id);
        $roleName = $admin->getRoleNames();
        foreach ($roleName as $roleName) {
            $roleName = Role::where('name',$roleName)->first();
        }
        $role = Role::get();
		return view('admin.moderators.edit', ['admin' => $admin,'role'=>$role,'roleName'=>$roleName]);
    }
    
    public function update(Request $request,$id)
    { 
        $this->validate(
            $request,
            [
                'name' => 'required|min:3|max:30|unique:admins,name,'. $id . ',_id',
                "email" => 'required|email:rfc,dns|email|unique:admins,email,'. $id . ',_id',
                'roles'=>'required',
            ],
            [
                'name.required' => __('messages.Name is required'),
                'name.min' => __('messages.The name must be at least 3 characters.'),
                'name.max' => __('messages.The name may not be greater than 30 characters.'),
                'email.required' => __('messages.Email field is required'),
                'roles'=> trans('messages.roles field is required.'),
            ]
        );
        $roles = $request->roles;
        $admin = Admin::findOrfail($id);
        $admin->name = $request->name;
        $admin->email = $request->email;
        $admin->save();
        $roleName = $admin->getRoleNames();
        $admin->removeRole($roleName);
        $admin->assignRole($roles);
        return redirect()->route('admin.index');
    }

    public function delete(Request $request,$id)
    {
        Admin::destroy($id);
        $notification = array(
            'message' => trans('messages.Moderator has been deleted'),
            'alert-type' => 'error',
        );
        session()->put('notification', $notification);
        return redirect()->back();
    }
}