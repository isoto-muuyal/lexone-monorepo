@extends('admin.layouts.sidebar')
@section('title', 'Moderator | Edit')
@section('content')
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('admin.update', $admin->id) }}" method="POST"  enctype="multipart/form-data">
        @csrf    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Edit Moderator')}}</h4>
        <div class="form-group">
            <label> {{__('messages.Name')}}</label>	<span class="text-danger">*</span>  
            <input type="text" name="name" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));"  class="form-control" value="{{$admin->name}}" placeholder="name">
        </div>
        <div class="form-group">
            <label> {{__('messages.Email')}}</label><span class="text-danger">*</span>  
            <input type="text" name="email" class="form-control" value="{{$admin->email}}" placeholder="email">
            @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
        </div>
        <div class="form-group">
            <label class="control-label" for="category-type">{{__('messages.Role')}}</label><span class="text-danger">*</span>  
            <select id="category-type" class="form-control" name="roles">
                <option value="">{{__('messages.Select')}}</option>
                @foreach($role as $role)
                    <div class="checkbox checkbox-styled">
                        <label>
                            <option value="{{ $role->name }}" @if($roleName->name == $role->name) selected @endif> 
                                {{ $role->name }} 
                            </option>
                        </label>
                    </div>
                @endforeach
            </select>
        </div>  
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
	    </div>
    </form>
<script>
    $("#check").click(function () {
        $('.check').not(this).prop('checked', this.checked);
    });
</script>
@endsection       