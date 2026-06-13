@extends('admin.layouts.sidebar')
@section('title', 'Site Settings')
@section('content')
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('sitesettings.store') }}" method="POST"  enctype="multipart/form-data">
        @csrf
        <input type="hidden" id="country_ajax" url="{{route('location.ajaxsubcategories')}}" required/>
        <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Site Settings')}} </h4>
        <div class="form-group">
            <label>{{__('messages.Site Name')}}</label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="site_name" placeholder="{{__('messages.Site Name')}}" value="{{$sitesettings->siteName}}" required>
            @if ($errors->has('site_name'))<p class="text-danger">{{ $errors->first('site_name') }}</p>@endif
        </div>
        <div class="m-b20">
            <div class="profile picture">
                <label>{{__('messages.Site Icon')}}</label>
                <input type="file" id="wizard-picture" name="site_icon" class="m-b15 p-2 borderGrey w-100" accept="image/png"><br>
                <img  src="{{url('media/admin_assets/fav-icon')}}" class="img-thumbnail" id="wizardPicturePreview" style="width:100px;height:100px;object-fit: cover;">
            </div>
            @if ($errors->has('site_icon'))<p class="text-danger">{{ $errors->first('site_icon') }}</p>@endif
        </div>
        <div class="m-b20">
            <div class="profile picture">
                <label>{{__('messages.Site Logo')}}</label>
                <input type="file" id="wizard-picture-add" name="site_logo" class="m-b15 p-2 borderGrey w-100" accept="image/png"><br>
                <img  src="{{url('media/admin_assets/logo.png')}}" class="img-thumbnail" id="wizardPicturePreviewAdd"
                style="width:100px;height:100px;object-fit: cover;">
            </div>
            @if ($errors->has('site_logo'))<p class="text-danger">{{ $errors->first('site_logo') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Contact Email')}} </label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="contact_email" placeholder="{{__('messages.Contact Email')}}" value="{{$sitesettings->contactEmail}}" required>
            @if ($errors->has('contact_email'))<p class="text-danger">{{ $errors->first('contact_email') }}</p>@endif
        </div>
        <div class="form-group">
            <label>WhatsApp Support Phone</label>
            <input type="text" class="form-control" name="support_phone" placeholder="e.g. +15551234567" value="{{$sitesettings->supportPhone}}">
            <small class="form-text text-muted">Include country code. This number will be used for the WhatsApp contact button in the mobile app.</small>
            @if ($errors->has('support_phone'))<p class="text-danger">{{ $errors->first('support_phone') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Copyright Text')}} </label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="copyright_text" placeholder="{{__('messages.Copyright Text')}}" value="{{$sitesettings->copyrightText}}" required>
            @if ($errors->has('copyright_text'))<p class="text-danger">{{ $errors->first('copyright_text') }}</p>@endif
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-6">
                    <label>{{__('messages.Tax')}}</label><span class="text-danger">*</span>
                    <div class="form-group ">
                        <div class="input-group mb-2">
                            <input type="number" class="form-control" name="tax" value="{{$sitesettings->tax}}" required>
                            <div class="input-group-prepend">
                                <div class="input-group-text">%</div>
                            </div>
                        </div>
                    </div>
                    @if ($errors->has('tax'))<p class="text-danger">{{ $errors->first('tax') }}</p>@endif
                </div>
                <div class="col-6">
                    <label>{{__('messages.Commission')}}</label><span class="text-danger">*</span>
                    <div class="form-group">
                        <div class="input-group mb-2">
                            <input type="number" min="1" step=".01" class="form-control" name="commission" value="{{$sitesettings->commission}}"  required>
                            <div class="input-group-prepend">
                                <div class="input-group-text">%</div>
                            </div>
                        </div>
                    </div>
                    @if ($errors->has('commission'))<p class="text-danger">{{ $errors->first('commission') }}</p>@endif
                </div>
            </div>
        </div>
        @include('admin.settings.currency')
        <div class="form-group">
            <label>{{__('messages.Minimum Amount')}} </label>
                <a href="https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts" target="blank">
                    <i class="fa fa-info-circle" aria-hidden="true" style="color:#000"></i>
                </a>
                <span class="text-danger">*</span>
            <input type="number" min="1" step=".01" class="form-control" name="minimumAmount" placeholder="{{__('messages.Minimum Amount')}}" value="{{$sitesettings->minimumAmount}}" required>
            @if ($errors->has('minimumAmount'))<p class="text-danger">{{ $errors->first('minimumAmount') }}</p>@endif
        </div>
        <!-- <div class="form-group">
            <label>Payout Date<span class="text-danger">*</span></label>
            <input type="number" min="1" maxlength="6" id="payout_date" class="form-control" name="payoutDate" placeholder="Payout Date" value="{{$sitesettings->payoutDate}}" required>
            @if ($errors->has('payoutDate'))<p class="text-danger">{{ $errors->first('payoutDate') }}</p>@endif
        </div> -->
        <input type="hidden" id="payout_date" class="form-control" name="payoutDate" placeholder="Payout Date" value="2" >

        <div class="form-group">
            <label>Footer Banner Youtube Video Title <span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeTitle" placeholder="Youtube Video Title" value="{{$sitesettings->youtubeTitle}}" required>
            @if ($errors->has('youtubeTitle'))<p class="text-danger">{{ $errors->first('youtubeTitle') }}</p>@endif
        </div>
        <div class="form-group">
            <label>Footer Banner Youtube Video Link <span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeLink" placeholder="Youtube Video Link" value="{{$sitesettings->youtubeLink}}" required>
            @if ($errors->has('youtubeLink'))<p class="text-danger">{{ $errors->first('youtubeLink') }}</p>@endif
        </div>
        <div class="form-group">
            <label>Footer Banner Youtube Description<span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeDescription" placeholder="Youtube Description" value="{{$sitesettings->youtubeDescription}}" required>
            @if ($errors->has('youtubeDescription'))<p class="text-danger">{{ $errors->first('youtubeDescription') }}</p>@endif
        </div>

        <div class="form-group">
                <label>{{__('messages.Google Adsense')}} </label>
                <div class="m-b20 d-flex">
                <div class="m-r50">
                <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="googleadsense_enable" name="googleadsense" value="true" @if($sitesettings->googleadsense == "true") checked @endif>
                <label class="custom-control-label" for="googleadsense_enable">{{__('messages.Enable')}}</label>
                </div>
                </div>
                <div class="m-r50">
                <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="googleadsense_disable" name="googleadsense" value="false"  @if($sitesettings->googleadsense == "false") checked @endif>
                <label class="custom-control-label" for="googleadsense_disable">{{__('messages.Disable')}}</label>
                </div>
                </div>
                </div>
            <label>{{__('messages.Instant Location')}} </label>
            <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#exampleModalCenter"></i>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="tasker" name="instantLocation" value="true" @if($sitesettings->instantLocation == "true") checked @endif>
                        <label class="custom-control-label" for="tasker">{{__('messages.Enable')}}</label>
                    </div>
                </div>
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="userandroid" name="instantLocation" value="false"  @if($sitesettings->instantLocation == "false") checked @endif>
                        <label class="custom-control-label" for="userandroid">{{__('messages.Disable')}}</label>
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
              <h5 class="modal-title" id="exampleModalLongTitle">Instant Location</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                By enabling Instant Location, the tasks will be allocated to the tasker based on the current location of the tasker.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
    </div>
@endsection
