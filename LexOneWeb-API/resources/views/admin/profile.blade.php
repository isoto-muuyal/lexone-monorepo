@extends('admin.layouts.sidebar')
@section('title', 'Profile')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
        <div>
        <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Profile')}}</h4>
            </div>
        </div>
        <div class="">
            <div class="materialTab">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link @if($active_tab === 'general') active @endif" id="general-tab" data-toggle="tab" href="#general" role="tab"
                        aria-controls="profile" aria-selected="false">{{trans('messages.General')}}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link @if($active_tab === 'changepassword') active @endif" id="password-tab" data-toggle="tab" href="#password" role="tab"
                        aria-controls="contact" aria-selected="false">{{trans('messages.Change Password')}}</a>
                    </li>
                </ul>
                <div class="tab-content p-t20 p-b20" id="myTabContent">
                    <div class="tab-pane @if($active_tab === 'general') active @endif" id="general" role="tabpanel" aria-labelledby="general-tab">
                        <form action="{{ route('admin.updateprofile') }}" method="POST">
                            @csrf
                            <div class="form-group">
                                <label>{{trans('messages.Name')}}</label>   
                                <input type="text" name="admin_username" class="form-control" value="{{$adminrecords->name}}">
                                @if ($errors->has('admin_username'))<p class="text-danger">{{ $errors->first('admin_username') }}</p>@endif
                            </div>
                            <div class="form-group">
                                <label>{{trans('messages.Email')}}</label>   
                                <input type="email" name="admin_email" class="form-control" value="{{$adminrecords->email}}">
                                @if ($errors->has('admin_email'))<p class="text-danger">{{ $errors->first('admin_email') }}</p>@endif
                            </div>
                            <div class="m-t20">
                                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10"> {{trans('messages.Save')}}</button> 
                            </div>
                        </form>
                    </div>
                    <div class="tab-pane @if($active_tab === 'changepassword') active @endif" id="password" role="tabpanel" aria-labelledby="password-tab">
                        <form action="{{ route('admin.changepassword') }}" method="POST">
                            @csrf
                            <div class="form-group">
                                <label>{{trans('messages.Old Password')}}</label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-password"></span>   
                                <input   type="password" name="admin_old_password" name="admin_old_password" class="form-control pass_log_id"  required>
                                @if ($errors->has('admin_old_password'))<p class="text-danger">{{ $errors->first('admin_old_password') }}</p>@endif
                            </div>
                            <div class="form-group">
                                <label>{{trans('messages.New Password')}}</label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-new-password"></span>   
                                <input id="new_password" type="password" name="admin_new_password" name="admin_new_password"  class="form-control " required>
                                @if ($errors->has('admin_new_password'))<p class="text-danger">{{ $errors->first('admin_new_password') }}</p>@endif
                            </div>
                            <div class="form-group">
                                <label>{{trans('messages.Confirm New Password')}}</label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-confirm-password"></span>   
                                <input id="confirm_new_password" type="password" name="admin_confirm_password" name="admin_confirm_password" class="form-control " required>
                                @if ($errors->has('admin_confirm_password'))<p class="text-danger">{{ $errors->first('admin_confirm_password') }}</p>@endif
                            </div>
                            <div class="m-t20">
                                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10"> {{trans('messages.Save')}}</button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).on('click', '.toggle-new-password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $("#new_password");
            input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
        });
        $(document).on('click', '.toggle-confirm-password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $("#confirm_new_password");
            input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
        });
    </script>
@endsection