@extends('admin.layouts.sidebar')
@section('title', 'Help Detail')
@section('content')
<script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Help')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        <h5>{{$help->name}}</h5>
        <div>
            <textarea id="show" name="description" required>
                        {{$help->description}}
            </textarea>
        </div>
    </div>
@endsection