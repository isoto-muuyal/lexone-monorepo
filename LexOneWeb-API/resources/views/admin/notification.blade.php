@php
use App\Classes\MyClass;
$myClass = new MyClass();
$settings = $myClass->site_settings();
@endphp
@section('title', 'Notification')
@extends('admin.layouts.sidebar')
@section('content')
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
   <div class="d-flex justify-content-between  flex-column flex-sm-row">
       <div>
        <h4 class="m-b25 blueTxtClr p-t10 p-b10">{{trans('messages.Push Notification')}}</h4>
        </div>
    </div>
    <div class="">
        <div class="materialTab">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link @if($active_tab === 'general') active @endif" id="general-tab" data-toggle="tab" href="#general" role="tab"
                    aria-controls="profile" aria-selected="false">{{ trans('messages.Ios') }}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link @if($active_tab === 'changepassword') active @endif" id="password-tab" data-toggle="tab" href="#password" role="tab"
                    aria-controls="contact" aria-selected="false">{{ trans('messages.Android') }}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="web-tab" data-toggle="tab" href="#web" role="tab"
                    aria-controls="contact" aria-selected="false">{{ trans('messages.Web') }}</a>
                </li>
            </ul>
            <div class="tab-content p-t20 p-b20" id="myTabContent">
                <div class="tab-pane @if($active_tab === 'general') active @endif" id="general" role="tabpanel" aria-labelledby="general-tab">
                    <p class="card-text d-inline text-danger">{{__('messages.Note : This notification will be send to all IOS device users')}}</p><br>
                    <!-- <form action="{{ route('dashboard.sendalert', ['dtype' => 'ios']) }}" method="get" enctype="multipart/form-data" onsubmit="return validatemsg()"> -->
                    <form action="{{ route('dashboard.sendalert', ['dtype' => 'ios']) }}" method="get" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group mt-3">
                            <label class="card-title">{{trans('messages.Push notification for IOS')}}</label><span class="text-danger">*</span>
                            <textarea class="form-control" name="msg" id="msg" cols="30" rows="6" maxlength="500" placeholder="{{trans('messages.500 Characters only allowed')}}" required></textarea>
                            @if ($errors->has('msg'))<p class="text-danger">{{ $errors->first('msg') }}</p>@endif
                            <span class="text-danger" id="msgerr"></span>
                            <label class=" mt-3">{{__('messages.Send to')}}</label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="tasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="tasker">{{__('messages.Tasker')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="users" name="userType" value="user">
                                        <label class="custom-control-label" for="users">{{__('messages.User')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="all" name="userType" value="all">
                                        <label class="custom-control-label" for="all">{{__('messages.Both')}}</label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1">{{__('messages.Send')}}</button>
                            
                        </div>
                    </form>
                </div>
                <div class="tab-pane @if($active_tab === 'changepassword') active @endif" id="password" role="tabpanel" aria-labelledby="password-tab">
                    <p class="card-text d-inline text-danger">{{trans('messages.Note : This notification will be send to all Android device users')}}</p><br>
                    <!-- <form action="{{ route('dashboard.sendalert', ['dtype' => 'android']) }}" class="" method="get" onsubmit="return validateandroidmsg()"> -->
                        <form action="{{ route('dashboard.sendalert', ['dtype' => 'android']) }}" class="" method="get">
                        @csrf
                        <div class="form-group mt-3">
                            <label class="card-title">{{trans('messages.Push notification for Android')}}</label><span class="text-danger">*</span>
                            <textarea class="form-control" name="msgg" id="msgg" cols="30" rows="6" maxlength="500" placeholder="{{trans('messages.500 Characters only allowed')}}" required></textarea>
                            @if ($errors->has('msgg'))<p class="text-danger">{{ $errors->first('msgg') }}</p>@endif
                            <span class="text-danger" id="msgerr"></span>
                            <label  class=" mt-3">{{__('messages.Send to')}}</label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="andtasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="andtasker">{{__('messages.Tasker')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="userandroid" name="userType" value="user">
                                        <label class="custom-control-label" for="userandroid">{{__('messages.User')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="androidall" name="userType" value="all">
                                        <label class="custom-control-label" for="androidall">{{__('messages.Both')}}</label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1">{{trans('messages.Send')}}</button>
                        </div>                  
                    </form>
                </div>

                <div class="tab-pane " id="web" role="tabpanel" aria-labelledby="web-tab">
                    <p class="card-text d-inline text-danger">{{trans('messages.Note : This notification will be send to all Web device users')}}</p><br>
                    <!-- <form action="{{ route('dashboard.sendalert', ['dtype' => 'android']) }}" class="" method="get" onsubmit="return validateandroidmsg()"> -->
                        <form action="{{ route('dashboard.sendalert', ['dtype' => 'web']) }}" class="" method="get">
                        @csrf
                        <div class="form-group mt-3">
                            <label class="card-title">{{trans('messages.Push notification for Web')}}</label><span class="text-danger">*</span>
                            <textarea class="form-control" name="wmsg" id="wmsg" cols="30" rows="6" maxlength="500" placeholder="{{trans('messages.500 Characters only allowed')}}" required></textarea>
                            @if ($errors->has('wmsg'))<p class="text-danger">{{ $errors->first('wmsg') }}</p>@endif
                            <span class="text-danger" id="msgerr"></span>
                            <label  class=" mt-3">{{__('messages.Send to')}}</label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webtasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="webtasker">{{__('messages.Tasker')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webandroid" name="userType" value="user">
                                        <label class="custom-control-label" for="webandroid">{{__('messages.User')}}</label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webandroidall" name="userType" value="all">
                                        <label class="custom-control-label" for="webandroidall">{{__('messages.Both')}}</label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1">{{trans('messages.Send')}}</button>
                        </div>                  
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
