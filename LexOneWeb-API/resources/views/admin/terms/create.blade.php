@extends('admin.layouts.sidebar')
@if($edit == 'Tasker')
    @section('title', 'Terms | Tasker')
@else
    @section('title', 'Terms | User')
@endif
@section('content')
    <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <div class="boxShadow p-3 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{  $edit == 'Tasker' ? "Tasker" : "User" }} {{__('messages.Terms')}}</h4>
            </div>  
            <div class="col-6 col-sm-4 col-md-4 col-lg-2">
                <form action="{{ route('terms.create', ['id' => $edit,'lang'=>'en' ]) }}" method="POST"  enctype="multipart/form-data">
                    <select id="status-selector" name="languageType" class="form-control">
                        @if($help)
                            <option value="en" <?php if($help->lang == 'en') { echo "selected"; } ?>>English</option>
                            <option value="fr" <?php if($help->lang === "fr") { echo "selected"; } ?>>French</option>
                            <!-- <option value="ar" <?php if($help->lang === "ar") { echo "selected"; } ?>>Arabic</option> -->
                        @else
                            <option value="en" <?php if($lang === "en") { echo "selected"; } ?>>English</option>
                            <option value="fr" <?php if($lang === "fr") { echo "selected"; } ?>>French</option>
                            <!-- <option value="ar" <?php if($lang === "ar") { echo "selected"; } ?>>Arabic</option> -->
                        @endif
                    </select>
                </form>
            </div>
        </div>
        <form  action="{{ route('terms.store') }}" method="POST"  enctype="multipart/form-data">
            @csrf 
            <div class="form-group">
                <label>{{__('messages.Page Title')}}</label><span class="text-danger">*</span> 	
                <input type="text" name="name" class="form-control" value="Terms And Conditions" readonly>
                <input type="hidden" name="languageType" class="form-control" value={{$lang}} >
            </div>
            <div class="form-group">
                <label>Description </label>	<span class="text-danger">*</span> 
                <textarea id="editor1" name="description" required>
                    @if($help)
                        {{$help->description}}
                    @endif
                </textarea>
                @if ($errors->has('description'))<p class="text-danger">{{ $errors->first('description') }}</p>@endif
            </div>
            @if($edit == 'Tasker')
                <input type="hidden" id="tasker" name="type" value="tasker">
            @else
                <input type="hidden" id="user" name="type" value="user">
            @endif
            <div class="m-t20">
                <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Save')}}</button> 
            </div>
        </form>
    </div>
    <script>
        $(document).ready(function () {
            var edit =<?php echo json_encode($edit) ?>;
            $("#status-selector").change(function(){
                var lang =$("#status-selector").val();
                if (edit == 'Tasker') {
                    window.location.href = "{{ route('terms.create', ['id' => 'Tasker',''])}}"+"/"+lang;
                }
                else{
                    window.location.href = "{{ route('terms.create', ['id' => 'User',''])}}"+"/"+lang;
                }
            });
        });
    </script>
@endsection       
