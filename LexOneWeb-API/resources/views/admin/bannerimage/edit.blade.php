@extends('admin.layouts.sidebar')
@section('title', 'Banner Edit')
@section('content')
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="{{ route('bannerimage.update', $data->id) }}" method="POST"  enctype="multipart/form-data">
    @csrf
    @method('patch')
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Edit')}} {{trans('messages.Banner')}}</h4>
    <div class="form-group">
        <label>{{trans('messages.image_url')}} </label> <span class="text-danger">*</span>  
        <input type="text" name="banner_image_url" value="{{ $data->url }}" class="form-control input-lg" required/>
        @if ($errors->has('banner_image_url'))<p class="text-danger">{{ $errors->first('banner_image_url') }}</p>@endif
    </div>
    <div class="form-group">
        <div class="m-b20">
        <div class="profile picture">
            <label>{{trans('messages.Image')}} (1024 * 500)</label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="banner_image" class="m-b15 p-2 borderGrey w-100"><br>
            <img src="{{url('/media/bannerimages/'.$data->image)}}" class="img-thumbnail" id="wizardPicturePreview" 
            style="width:100px;height:100px;object-fit: cover;">
        </div>
        @if ($errors->has('banner_image'))<p class="text-danger">{{ $errors->first('banner_image') }}</p>@endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Status')}}</label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="banner_status" value="1" @if($data->status == 1) checked @endif>
                    <label class="custom-control-label" for="enable">{{trans('messages.Enable')}}</label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="banner_status" value="0" @if($data->status == 0) checked @endif>
                <label class="custom-control-label" for="disable">{{trans('messages.Disable')}}</label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Update')}}</button> 
    </div>
</form>
@endsection