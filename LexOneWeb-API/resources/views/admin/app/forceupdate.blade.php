@extends('admin.layouts.sidebar')
@section('title', 'Profile')
@section('content')
<form action="{{ route('appupdate.store') }}" method="POST"  enctype="multipart/form-data">
    @csrf
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.App Update Management')}} <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#exampleModalCenter"></i> </h4>
            </div>
            <div class="">
                <div class=" align-self-center">
                    <h6 class="p-t10">App update</h6>
                    <div class="custom-control custom-switch">
                        <input type="checkbox" name="status" class="custom-control-input" id="customSwitch1" @if($sitesettings->status == "true")checked @endif>
                        <label class="custom-control-label" for="customSwitch1"></label>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>{{trans('messages.Android Version')}} </label> <span class="text-danger">*</span>  
            <input type="number" class="form-control" name="androidVersion" min="1" max="999999"  maxlength="6" value="{{$sitesettings->androidVersion}}" placeholder="{{trans('messages.Android Version')}}"  required>
            @if ($errors->has('androidVersion'))<p class="text-danger">{{ $errors->first('androidVersion') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Update Type')}}</label><span class="text-danger">*</span>  
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="true" name="androidForceUpdate" value="true" @if($sitesettings->androidForceUpdate == "true") checked @endif >
                        <label class="custom-control-label" for="true">{{__('messages.Force Update')}}</label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="false" name="androidForceUpdate" value="false" @if($sitesettings->androidForceUpdate == "false") checked @endif >
                    <label class="custom-control-label" for="false">{{__('messages.Normal Update')}}</label>
                </div>
            </div>
        </div>
        <br>
        <hr style="border-top: 2px solid rgba(122, 176, 221, 0.952)">
        <br>
        <div class="form-group">
            <label>{{trans('messages.IOS Version')}} </label> <span class="text-danger">*</span>  
            <input type="number" class="form-control" name="iosVersion" min="1" max="999999"  step=".01" maxlength="6" value="{{$sitesettings->iosVersion}}" placeholder="{{trans('messages.Ios Version')}}"  required>
            @if ($errors->has('iosVersion'))<p class="text-danger">{{ $errors->first('iosVersion') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Update Type')}}</label><span class="text-danger">*</span>  
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="iosforce" name="iosForceUpdate" value="true" @if($sitesettings->iosForceUpdate == "true") checked @endif>
                        <label class="custom-control-label" for="iosforce">{{__('messages.Force Update')}}</label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="iosnormal" name="iosForceUpdate" value="false" @if($sitesettings->iosForceUpdate == "false") checked @endif>
                    <label class="custom-control-label" for="iosnormal">{{__('messages.Normal Update')}}</label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
        </div>
    </div>
</form>
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">App Update</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                Enable this settings to intimate the user to update the app.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
    </div>
@endsection