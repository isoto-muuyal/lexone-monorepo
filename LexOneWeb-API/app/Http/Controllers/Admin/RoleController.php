<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maklad\Permission\Models\Role;
use Maklad\Permission\Models\Permission;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Session;
use Auth;

class RoleController extends Controller
{
	public function index()
	{
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $pagination = Role::where('name','!=','super admin')->paginate($perPage);
        // $role = Role::where('name','!=','super admin')->orderBy('created_at','Desc')->get()->toArray();
        //new
        $roles = Role::where('name','!=','super admin')->orderBy('created_at','Desc')->paginate($perPage);

        $auth = Auth::user();
        $users = $auth->roles;
        foreach($users as $user){
            $name =  $user->name;
        }
        // $roles = array_slice($role, $perPage * ($page - 1), $perPage);
        return view('admin.roles.index',['roles'=>$roles,'name'=>$name, 'pagination' => $pagination]);
    }
    
	public function create()
	{	
        return view('admin.roles.create');
    }
    
	public function store(Request $request)
	{	
        $this->validate(
            $request,
            [
                'name' => 'required|min:3|max:30|unique:roles,name',
                'permissions' => 'required'
            ],
            [
                'name.required' => __('messages.Name is required'),
                'name.min' => __('messages.The name must be at least 3 characters.'),
                'name.max' => __('messages.The name may not be greater than 30 characters.'),
                
            ]
        );
        $role = Role::create(['name' => $request->name, 'description'=> $request->description]);
        $role->syncPermissions($request->input('permissions'));
        return redirect()->route('role.index');
    }
    
	public function show($id)
	{
        $role = Role::findOrfail($id);
        $permission_ids = $role->permission_ids;
        foreach ($permission_ids as $permission_id) {
           $permission[]= Permission::where('_id',$permission_id)->first();
        }
        return view('admin.roles.show',['role'=>$role,'permission'=>$permission]);
    }
    
	public function edit(Request $request, $id)
	{
        $role = Role::find($id);
        $permission = Permission::get();
        return view('admin.roles.edit',compact('role','permission'));
    }
    
    public function update(Request $request,$id)
    {
        $this->validate(
            $request,
            [
                'name' => 'required|min:3|max:30|unique:roles,name,'. $id . ',_id',
                'permissions' =>'required',
            ],
            [
                'name.required' => __('messages.Name is required'),
                'permissions.required' => __('messages.Role is required'),
                'name.min' => __('messages.The name must be at least 3 characters.'),
                'name.max' => __('messages.The name may not be greater than 30 characters.'),
                
            ]
        );
        $role = Role::find($id);
        $role->name = $request->input('name');
        $role->description = $request->description;
        $role->save();
        $role->syncPermissions($request->input('permissions'));
        return redirect()->route('role.index');
    }

    public function delete($id)
    {
        $roleid = Role::findOrFail($id);
        $adminids = $roleid->admin_ids;
        if($adminids != null){
            foreach($adminids as $adminid){
                Admin::destroy($adminid);
            }
        }
        Role::destroy($id);
        $notification = array(
			'message' => trans('messages.Role has been deleted'),
			'alert-type' => 'error',
		);
		session()->put('notification', $notification);
		return redirect()->back();
        
       
    }
}