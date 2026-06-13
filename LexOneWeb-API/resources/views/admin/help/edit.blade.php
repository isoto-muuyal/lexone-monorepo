@extends('admin.layouts.sidebar')
@section('title', 'Help | Edit')
@section('content')
    <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
        <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('help.update',['id' => $help->_id]) }}" method="POST"  enctype="multipart/form-data">
        @csrf 
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Edit')}} {{__('messages.Help')}}</h4>
        <div class="form-group">
            <div class="col-lg-2">
                <select id="status-selector" name="languageType" class="form-control">
                    <option value="en" @if(strval($help->lang) === "en") selected @endif>English</option>
                    <!-- <option value="ar" @if(strval($help->lang) === "ar") selected @endif>Arabic</option> -->
                    <option value="fr" @if(strval($help->lang) === "fr") selected @endif>French</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>{{__('messages.Page Title')}}</label><span class="text-danger">*</span> 	
            <input type="text" name="name" class="form-control" placeholder="{{__('messages.Page Title')}}" value="{{$help->name}}" required>
            @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
        </div>
        <div class="form-group">
            <label>Description </label>	<span class="text-danger">*</span> 
            <textarea id="editor1" name="description" required>
                @if ($help)
                    {{$help->description}}
                @endif
            </textarea>
            @if ($errors->has('description'))<p class="text-danger">{{ $errors->first('description') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{trans('messages.Content type')}}</label><span class="text-danger">*</span> 
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="users" name="type" value="user" @if($help->type == 'user') checked @endif>
                        <label class="custom-control-label" for="users">{{__('messages.User')}}</label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="taskers" name="type" value="tasker" @if($help->type == 'tasker') checked @endif>
                    <label class="custom-control-label" for="taskers">{{__('messages.Tasker')}}</label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Save')}}</button> 
        </div>
    </form>
@endsection       
