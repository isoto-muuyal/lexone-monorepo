@extends('admin.layouts.sidebar')
@section('title', 'Notification Settings')
@section('content')
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('notification.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Notification Management')}}</h4>
        <div class="form-group">
            <label>{{__('messages.API Key for Push notification')}} </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="pushNotification"   value="{{$sitesettings->pushNotification}}"  required>
            @if ($errors->has('pushNotification'))<p class="text-danger">{{ $errors->first('pushNotification') }}</p>@endif
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
</div>
@endsection