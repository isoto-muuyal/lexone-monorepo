@extends('admin.layouts.sidebar')
@section('title', 'Email Settings')
@section('content')
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('email.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Email Settings - SMTP Settings')}}</h4>
        <div class="form-group">
            <label>{{__('messages.SMTP Port')}} </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="smtpPort"  placeholder="{{__('messages.SMTP Port')}}" value="{{$sitesettings->smtpPort}}" required>
            @if ($errors->has('port'))<p class="text-danger">{{ $errors->first('port') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.SMTP Host')}} </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="smtpHost"  placeholder="{{__('messages.SMTP Host')}}" value="{{$sitesettings->smtpHost}}" required>
            @if ($errors->has('host'))<p class="text-danger">{{ $errors->first('host') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.SMTP Email')}} </label> <span class="text-danger">*</span>  
            <input type="email" class="form-control" name="smtpEmail"  placeholder="{{__('messages.SMTP Email')}}" value="{{$sitesettings->smtpEmail}}" required>
            @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
        </div>
        <div class="form-group" id="password">
            <label>{{__('messages.Password')}} </label> <span class="text-danger">*</span> <span toggle="#password-field" style="display:none;" class="fa fa-fw fa-eye field_icon toggle-password"></span>
            <input type="password" name="smtpPassword" placeholder="{{ __('Password') }}" value="{{$sitesettings->smtpPassword}}"  class="form-control input-lg pass_log_id" required>
            @if ($errors->has('password'))<p class="text-danger">{{ $errors->first('password') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.SMTP SSL')}}</label>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="enable" name="smtpStatus" value="1"  @if($sitesettings->smtpStatus == 1 || $sitesettings->smtpStatus == "" ) checked @endif>
                        <label class="custom-control-label" for="enable">{{__('messages.Enable')}}</label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="disable" name="smtpStatus" value="0"  @if($sitesettings->smtpStatus == 0) checked @endif>
                    <label class="custom-control-label" for="disable">{{__('messages.Disable')}}</label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
</div>
@endsection