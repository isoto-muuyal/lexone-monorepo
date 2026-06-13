<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;
use App\Http\Controllers\Admin\CategoryController;
use App\Models\Setting;


class HelpController extends Controller
{

    protected $CategoryController;
    public function __construct(CategoryController $CategoryController)
    {
        $this->CategoryController = $CategoryController;
	}
	public function index()
	{
        $page = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $pagination = Help::where('name', '!=', 'Terms And Conditions')->where('name', '!=', 'Privacy Policy')->paginate($perPage);
        $helprecords = Help::where('name', '!=', 'Terms And Conditions')->where('name', '!=', 'Privacy Policy')->orderBy('created_at', 'desc')->get()->toArray();
        $help = array_slice($helprecords, $perPage * ($page - 1), $perPage);
        return view('admin.help.index', ['help' => $help, 'helprecords' => $helprecords, 'pagination' => $pagination]);
	}
	public function create()
	{	
            $setting = Setting::first();
            $availLanguages = $setting->availableLanguages;
            $names = array();
            foreach($availLanguages as $availLanguage){
                $names =  $this->CategoryController->getLocaleCodeForDisplayLanguage($availLanguage);
                $languages[] = [
                    'language' => $names,
                    'code' => $availLanguage,
                    'langcode'=>strtolower($names)."Name"
                ];
            }
        return view('admin.help.create',['languages'=>$languages,'availLanguages'=>$availLanguages]);
	}
	public function store(Request $request)
	{	
        // ...................Store function...............
            $this->validation($request);
            $name = $request->name;
            if ($request->help !== null) {
                if ($name == 'Privacy Policy' || $name == 'Terms And Conditions') {
                    $notification = array(
                        'message' => __('messages.Terms and policies cannot be saved in help'),
                        'alert-type' => 'error',
                    );
                    session()->put('notification', $notification);
                    return redirect()->back();
                }
            }
            $help_names = Help::where('name', $name)->get();
            foreach($help_names as $help_name){
                if ($help_name) {
                    if ($help_name->name == $name){
                        if ($help_name->type == $request->type){
                            $notification = array(
                                'message' => trans('messages.Help Content Already exists'),
                                'alert-type' => 'error',
                            );
                            session()->put('notification', $notification);
                            return redirect()->route('help.index');
                        }
                    }
                }
            }
            $help = new Help();
            $help->name = $name;
            $help->lang = $request->languageType;
            $help->description = $request->description;
            $help->type = $request->type;
            if ($help->save()) {
                $notification = array(
                    'message' => __('messages.Help has been created successfully'),
                    'alert-type' => 'success',
                );
            } else {
                $notification = array(
                    'message' => __('messages.Something went wrong'),
                    'alert-type' => 'error',
                );
            }
            session()->put('notification', $notification);
            if( $name == 'Privacy Policy' || $name == 'Terms And Conditions' ){
                return redirect()->back();
            }
            else{
                return redirect()->route('help.index');
            }
		// ...................Ends here...............
	}
	public function show(Request $request, $id)
	{
      
        $help = Help::findOrFail($id);
        $description =  $help->description;
		return view('admin.help.show', ['help' => $help,'description'=>$description]);
		
	}
	public function edit(Request $request, $id)
	{
        $setting = Setting::first();
        $availLanguages = $setting->availableLanguages;
        $names = array();
        foreach($availLanguages as $availLanguage){
            $names =  $this->CategoryController->getLocaleCodeForDisplayLanguage($availLanguage);
            $languages[] = [
                'language' => $names,
                'code' => $availLanguage,
                'langcode'=>strtolower($names)."Name"
            ];
        }
        $help = Help::findOrFail($id);
        return view('admin.help.edit',['help' => $help,'languages'=>$languages]);
	}
	 public function update(Request $request,$id)
    {
        // ...................update function...............
            $this->validation($request);
            $help = Help::find($id);
            $name = $request->name;
            if($help->name != $name || $help->type != $request->type){
                $help_names = Help::where('name', $name)->get();
                foreach($help_names as $help_name){
                    if ($help_name) {
                        if ($help_name->name == $name){
                            if ($help_name->type == $request->type){
                                $notification = array(
                                    'message' => trans('messages.Help Content Already exists'),
                                    'alert-type' => 'error',
                                );
                                session()->put('notification', $notification);
                                return redirect()->route('help.index');
                            }
                        }
                    }
                }
            }
            $name = $request->name;
           
            $help = Help::updateOrCreate(['_id' => $id],['name' => $name,'type'=> $request->type,'description'=>$request->description,'lang'=> $request->languageType]);
            $notification = array(
                'message' => __('messages.Help has been Updated successfully'),
                'alert-type' => 'success',
            );
            if( $name == 'Privacy Policy' || $name == 'Terms And Conditions' ){
                session()->put('notification', $notification);
                return redirect()->back();
            }
            else{
                session()->put('notification', $notification);
                return redirect()->route('help.index');
            }
        // ...................Ends here...............
    }
    public function delete($id)
	{
        $help = Help::findOrFail($id);
        $help->delete();
        return redirect()->route('help.index');
	}

    public function validation(Request $request)
	{	
		// ...................Validation starts here...............
            $this->validate(
                $request,
                [
                    'name' => 'required|min:3|max:30',
                    'description' => 'required',
                    'type' => 'required',
                ],
                [
                    'name.required' => __('messages.The name is required.'),
                    'name.min' => __('messages.The name must be at least 3 characters.'),
                    'name.max' => __('messages.The name may not be greater than 30 characters.'),
                    'description.required' => __('messages.The description is required'),
                    'description.min' => __('messages.The description must be at least 3 characters.'),
                    'description.max' => __('messages.The description may not be greater than 1200 characters.'),
                    'type.required' => __('messages.The type is required.'),
                ]
            );
        // ...................Ends here...............
	}
}