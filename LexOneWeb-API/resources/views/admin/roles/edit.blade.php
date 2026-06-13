@extends('admin.layouts.sidebar')
@section('title', 'Role | Edit')
@section('content')
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('role.update', $role->id) }}" method="POST"  enctype="multipart/form-data">
        @csrf    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Edit Role')}}</h4>
        <div class="form-group">
            <label> {{__('messages.Name')}}</label>	<span class="text-danger">*</span>
            <input type="text" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));" name="name" class="form-control" value="{{$role->name}}" placeholder="name" required>
            @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
        </div>
        <div class="form-group">
            <label> {{__('messages.Description')}}</label><span class="text-danger">*</span>	
            <input type="text" name="description" class="form-control" value="{{$role->description}}" placeholder="description" required>
            @if ($errors->has('description'))<p class="text-danger">{{ $errors->first('description') }}</p>@endif
        </div>
        <div class="form-group">
        <label> {{__('messages.Previleges')}}</label><span class="text-danger">*</span></br>
            <label><input type="checkbox" id="checkedAll">Check All</label></br>
            @foreach($permission as $permission)
                <div class="checkbox checkbox-styled" >
                    <label>
                        <input class="checkSingle" type="checkbox" name="permissions[]" value="{{ $permission->name }}" 
                            {{ $role->permissions->contains($permission->id) ? 'checked' : '' }} >
                        <span>{{$permission->name}} {{__('messages.Management')}}</span>
                    </label>
                </div>
            @endforeach
            @if ($errors->has('permissions'))<p class="text-danger">{{ $errors->first('permissions') }}</p>@endif
        </div>  
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
	    </div>
    </form>
<script>
    $(document).ready(function() {
        if ($(".checkSingle").is(":checked")){
        var isAllChecked = 0;
        $(".checkSingle").each(function(){
            if(!this.checked)
            isAllChecked = 1;
        })              
        if(isAllChecked == 0){ $("#checkedAll").prop("checked", true); }     
        }else {
        $("#checkedAll").prop("checked", false);
        }
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