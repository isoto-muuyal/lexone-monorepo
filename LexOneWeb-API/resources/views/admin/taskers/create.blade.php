@extends('admin.layouts.sidebar')
@section('title', 'Tasker Create')
@section('content')
<script src="//geodata.solutions/includes/countrystatecity.js"></script>
<script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('tasker.store') }}" method="POST"  enctype="multipart/form-data">
        @csrf
        <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Add')}} {{__('messages.Tasker')}}</h4>
        <div class="form-group">
            <label>{{__('messages.Name')}} </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="name" maxlength="30"  placeholder="{{__('messages.Enter')}} {{__('messages.Tasker')}} {{__('messages.Name')}}" value="{{ old('name') }}" required>
            @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Email')}} </label> <span class="text-danger">*</span>  
            <input type="text" name="email" placeholder="{{__('messages.Enter')}} {{__('messages.Tasker')}} {{__('messages.Email')}}" value="{{ old('email') }}" class="form-control input-lg" required/>
            @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Mobile')}} </label> <span class="text-danger">*</span>  
            <input type="tel" name="mobile" placeholder="{{__('messages.Enter')}} {{__('messages.Tasker')}} {{__('messages.Mobile')}}" value="{{ old('mobile') }}" class="form-control input-lg" required/>
            <small class="text-danger">&nbsp;Add an mobile number with +(countrycode) (Phone number) Eg: +91876543210</small>
            @if ($errors->has('mobile'))<p class="text-danger">{{ $errors->first('mobile') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Password')}} </label> <span class="text-danger">*</span>  <span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-password"></span>
            <input type="password" name="password"   placeholder="{{ __('Password') }}"  value="{{ old('Password') }}"  class="form-control input-lg pass_log_id" required>
            @if ($errors->has('password'))<p class="text-danger">{{ $errors->first('password') }}</p>@endif
        </div>
        @if($instantLocation == "false")
            <div class="form-group">
                <label>{{__('messages.Location')}} </label> <span class="text-danger">*</span>  
                <select id="category-type" class="form-control" name="location" required>
                    <option value="">{{trans('messages.Select')}}</option>
                    @foreach($cities as $location)
                        <option value="{{ $location->city }}" > 
                            {{$location->city}}, {{$location->state}}.
                        </option>
                    @endforeach
                </select>
            </div>
        @endif
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
        </div>
    </form>
@endsection