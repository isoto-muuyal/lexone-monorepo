@extends('admin.layouts.sidebar')
@section('title', 'Help | Create')
@section('title', 'Help')
@section('content')
<style>
textarea#CKEditor1 { display: none;}
</style>
<script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
<form class="boxShadow p-3 bgWhite m-b20" action="{{ route('help.store') }}" method="POST"  enctype="multipart/form-data">
    @csrf    
    <input type="hidden" id="tasker" name="help" value="add">
    <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Add Help')}}</h4>
    <div class="form-group">
        <div class="col-lg-2">
            <select id="status-selector" name="languageType" class="form-control">
                <option value="en">English</option>
                <option value="fr">French</option>
            </select>
          
        </div>
    </div>
    <div class="form-group">
        <label>{{__('messages.Page Title')}} </label><span class="text-danger">*</span> 
        <input type="text" name="name" class="form-control" placeholder="{{__('messages.Page Title')}}" value="{{old('name')}}" minlength="3" maxlength="30" required>
        @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
    </div>
  
    <div class="form-group">
        <label>Description </label><span class="text-danger">*</span> 
        <textarea id="editor1" name="description" required>
        </textarea>
        @if ($errors->has('description'))<p class="text-danger">{{ $errors->first('description') }}</p>@endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Content type')}}</label><span class="text-danger">*</span> 
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="type" value="user" checked>
                    <label class="custom-control-label" for="enable">{{__('messages.User')}}</label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="type" value="tasker">
                <label class="custom-control-label" for="disable">{{__('messages.Tasker')}}</label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Save')}}</button> 
    </div>
</form>
@endsection       
