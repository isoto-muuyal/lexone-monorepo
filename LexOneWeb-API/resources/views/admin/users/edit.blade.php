@extends('admin.layouts.sidebar')
@section('title', 'User Edit')
@section('content')
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="{{ route('user.update', $user->id) }}" method="POST"  enctype="multipart/form-data">
    @csrf
    @method('patch')
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Edit')}} {{trans('messages.User')}}</h4>
    <div class="form-group">
        <label>{{trans('messages.Name')}} </label> <span class="text-danger">*</span>  
        <input type="text" name="name" value="{{ $user->name }}" class="form-control input-lg" required />
        @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Email')}} </label> <span class="text-danger">*</span>  
        <input type="text" name="email" value="{{$user['email']}}" class="form-control input-lg" required/>
        @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Mobile')}} </label> <span class="text-danger">*</span>  
        <input type="text" name="mobile" value="{{$user['mobile']}}" class="form-control input-lg" required/>
        @if ($errors->has('mobile'))<p class="text-danger">{{ $errors->first('mobile') }}</p>@endif
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Update')}}</button> 
    </div>
</form>
@endsection