@extends('admin.layouts.sidebar')
@section('title', 'Social link Settings')
@section('content')
        <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('social-link.store') }}" method="post" enctype="multipart/form-data">
            @csrf
            <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Social Link')}} {{__('messages.Settings')}}</h4>
            <div class="form-group">
                <label>{{__('messages.Facbook Link')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="fbLink" value="{{$sitesettings->fbLink}}"  placeholder="{{__('messages.Facbook Link')}}" required>
                </div>		
            </div>
            <div class="form-group">
                <label>{{__('messages.Twitter Link')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="twitterLink" value="{{$sitesettings->twitterLink}}"  placeholder="{{__('messages.Twitter Link')}}" required>
                </div>		
            </div>
            <div class="form-group">
                <label>{{__('messages.Instagram Link')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="instagramLink" value="{{$sitesettings->instagramLink}}"  placeholder="{{__('messages.Instagram Link')}}" required>
                </div>		
            </div>
            <div class="form-group">
                <label>{{__('messages.Invite Link')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="inviteLink" value="{{$sitesettings->inviteLink}}"  placeholder="{{__('messages.Invite Link')}}" required>
                </div>		
            </div>
            <div class="m-t20">
                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
            </div>
        </form>
@endsection       
