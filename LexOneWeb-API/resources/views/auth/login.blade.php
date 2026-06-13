@extends('admin.layouts.main')
<title> {{env('APP_NAME')}}  | @yield('title')</title>
@section('content')
<div class="d-table w-100 h-100 text-center position-absolute">
    <div class="centerAlignment">
        <div class="wrapper fadeInDown  d-flex align-items-center justify-content-center w-100 h-100">
            <div id="loginform" class="borderRadious-3 position-relative p-0 text-center m-r20 m-l20">
                <form class="m-b25 p-4" method="POST" action="{{ route('admin.authentication') }}">
                    @csrf
                    <div class="m-b15">
                        <img src="{{url('/media/admin_assets/logo.png')}}" class="height40"/>
                    </div>
                    <input type="email" name="email" class="p-t15 p-b15 p-l15 w-100 m-b15"  placeholder="{{ __('Email') }}">
                    @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
                    <input type="password" name="password" class="p-t15 p-b15 p-l15 w-100"  placeholder="{{ __('Password') }}">
                    @if ($errors->has('password'))<p class="text-danger">{{ $errors->first('password') }}</p>@endif
                    <div class="m-t20">
                        <button type="submit" class="btn-block bgBlue whiteTxtClr p-t10 p-b10 p-r30 p-l30 borderRadious-3 fontSize13 border-0">{{ __('Login') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
