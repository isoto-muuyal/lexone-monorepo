<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Help;
use App\Models\Setting;

class TermsController extends Controller
{
    protected $CategoryController;
    public function __construct(CategoryController $CategoryController)
    {
        $this->CategoryController = $CategoryController;
    }
    
	public function create($id, $lang)
	{	
        if ($id == 'Tasker') {
            $help = Help::where('name',"Terms And Conditions")->where('type', "tasker")->where('lang',$lang)->first();
            $edit = 'Tasker';
        }
        elseif ($id == 'User') {
            $help = Help::where('name',"Terms And Conditions")->where('type', "user")->where('lang',$lang)->first();
            $edit = 'User';
        }
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
        return view('admin.terms.create', ['help' => $help,'edit'=>$edit,'languages'=> $languages,'lang'=>$lang]);
	}
	public function store(Request $request)
	{	
        // ...................Store function...............
            $this->validation($request);
            $help = Help::updateOrCreate(['name' => $request->name,'type'=> $request->type, 'lang'=>$request->languageType],['description'=>$request->description]);
            if ($help->save()) {
                $notification = array(
                    'message' => __('messages.Terms has been saved successfully'),
                    'alert-type' => 'success',
                );
            } else {
                $notification = array(
                    'message' => __('messages.Something went wrong'),
                    'alert-type' => 'error',
                );
            }
            session()->put('notification', $notification);
            return redirect()->back();
		// ...................Ends here...............
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