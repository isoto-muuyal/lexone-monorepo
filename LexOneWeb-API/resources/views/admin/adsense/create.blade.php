@extends('admin.layouts.sidebar')
@section('title', 'Adsense Settings')
@section('content')
<form class="boxShadow p-3 bgWhite m-b20" action="{{ route('adsense.store') }}" method="post" enctype="multipart/form-data">
    @csrf
    <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Adsense')}} {{__('messages.Settings')}}</h4>
    <div class="form-group">
        <label>{{__('messages.Google AD Client')}}</label><span class="text-danger">*</span>  
        <div class="form-group field-public_key">
            <input type="text" class="form-control"  name="googleadclient" value="{{$sitesettings->googleadclient}}"  placeholder="{{__('messages.Google AD Client')}}" required>
        </div>		
    </div>
    <div class="form-group">
        <label>{{__('messages.Google AD Slot')}}</label><span class="text-danger">*</span>  
        <div class="form-group field-public_key">
            <input type="text" class="form-control"  name="googleadslot" value="{{$sitesettings->googleadslot}}"  placeholder="{{__('messages.Google AD Slot')}}" required>
        </div>		
    </div>
    <div class="m-t20">
        <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
    </div>
</form>

@endsection