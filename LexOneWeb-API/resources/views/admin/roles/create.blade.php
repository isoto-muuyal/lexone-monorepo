@extends('admin.layouts.sidebar')
@section('title', 'Role | Create')
@section('content')
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('role.store') }}" method="POST"  enctype="multipart/form-data">
        @csrf    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Add Role')}}</h4>
        <div class="form-group">
            <label> {{__('messages.Name')}}</label>	<span class="text-danger">*</span>
            <input type="text" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));" name="name" class="form-control" placeholder="name" required>
            @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
        </div>
        <div class="form-group">
            <label> {{__('messages.Description')}}</label> <span class="text-danger">*</span>	
            <input type="text" name="description" class="form-control" placeholder="description" required>
        </div>
        <div class="form-group">
            <label> {{__('messages.Previleges')}}</label> <span class="text-danger">*</span>	</br>
            <label><input type="checkbox" id="checkedAll">&nbsp;&nbsp; Check All</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="insights">&nbsp;&nbsp; {{__('messages.Insights')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="notification">&nbsp;&nbsp; {{__('messages.Notification Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="roles">&nbsp;&nbsp; {{__('messages.Roles Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="users">&nbsp;&nbsp; {{__('messages.User Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="Taskers">&nbsp;&nbsp; {{__('messages.Tasker Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="categories">&nbsp;&nbsp; {{__('messages.Category Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="subcategories">&nbsp;&nbsp; {{__('messages.Subcategory Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="services">&nbsp;&nbsp; {{__('messages.Service Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="needs">&nbsp;&nbsp; {{__('messages.Jobs')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="bookings">&nbsp;&nbsp; {{__('messages.Booking management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="settlement">&nbsp;&nbsp; {{__('messages.Settlement management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="sitesettings">&nbsp;&nbsp; {{__('messages.Settings management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="help">&nbsp;&nbsp; {{__('messages.Help Management')}}</label></br>
            <label><input class="checkSingle" type="checkbox" name="permissions[]" value="privacy">&nbsp;&nbsp; {{__('messages.Privacy and Terms Management')}}</label></br>
            @if ($errors->has('permissions'))<p class="text-danger">{{ $errors->first('permissions') }}</p>@endif
        </div>  
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
	    </div>
    </form>
    <script>
        $(document).ready(function() {
            $("#checkedAll").change(function(){
                if(this.checked){
                $(".checkSingle").each(function(){
                    this.checked=true;
                })              
                }else{
                $(".checkSingle").each(function(){
                    this.checked=false;
                })              
                }
            });

            $(".checkSingle").click(function () {
                if ($(this).is(":checked")){
                var isAllChecked = 0;
                $(".checkSingle").each(function(){
                    if(!this.checked)
                    isAllChecked = 1;
                })              
                if(isAllChecked == 0){ $("#checkedAll").prop("checked", true); }     
                }else {
                $("#checkedAll").prop("checked", false);
                }
            });
        });
    </script>
@endsection       