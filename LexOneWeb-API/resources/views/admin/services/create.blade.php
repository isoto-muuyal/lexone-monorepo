@extends('admin.layouts.sidebar')
@section('title', 'Service Create')
@section('content')
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('service.store') }}" method="POST"  enctype="multipart/form-data">
	@csrf
	<input type="hidden" id="ajax_url" url="{{route('service.ajaxsubcategories')}}" required/>
	<h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Add')}} {{__('messages.Service')}}</h4>
	
	<div class="form-group">
		<label> {{__('messages.Name')}} </label> <span class="text-danger">*</span>  
		<input type="text" class="form-control" id="service_name" name="service_name" value="{{ old("service_name") }}" maxlength="30" placeholder="{{__('messages.Service')}} {{__('messages.Name')}}" required>
		@if ($errors->has('service_name'))<p class="text-danger">{{ $errors->first('service_name') }}</p>@endif
	</div>
	<a href=# id="RTL"><u>{{__('messages.Add Names In Other Languages')}}</u></a>
	<div id="morecategories">
		@foreach($languages as $language)
			<div class="form-group">
				<label>{{$language['language']}} {{__('messages.Name')}} </label> <span class="text-danger">*</span>  
				<input type="text" class="form-control" name={{$language['langcode']}} maxlength="30" placeholder="{{__('messages.Service')}} {{__('messages.Name')}}" value="{{ old($language['langcode']) }}">
                @if ($errors->has($language['langcode']))<p class="text-danger">{{ $errors->first($language['langcode']) }}</p>@endif
			</div>
		@endforeach
	</div>
	<br>
	<br>
	<div class="form-group">
		<label class="control-label" for="category-type">{{__('messages.Main Category')}}</label>
		<select id="category-type" class="form-control" name="service_category_parent" required>
			<option value=" ">{{__('messages.Select')}}</option>
			@foreach ($maincategories as $eachcategory)
			<option value="{{ $eachcategory->_id }}"> 
				{{ $eachcategory->name }} - {{ $eachcategory->type }} 
			</option>
			@endforeach    
		</select>
		@if ($errors->has('service_category_parent'))<p class="text-danger">{{ $errors->first('service_category_parent') }}</p>@endif
	</div>
	<div class="form-group">
		<div class="m-b20">
			<div class="profile picture">
				<label>{{__('messages.Image')}}</label> <span class="text-danger">*</span>
				<input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="service_image" class="m-b15 p-2 borderGrey w-100" required><br>
				<img src="" class="borderCurve borderGradient picture-src dnone" id="wizardPicturePreview"
				style="width:100px;height:100px;object-fit: cover;" >
			</div>
			@if ($errors->has('service_image'))<p class="text-danger">{{ $errors->first('service_image') }}</p>@endif
		</div>
	</div>
	<div class="advanced_service_sec">
	</div>
	<div class="form-group">
		<label>{{__('messages.Status')}}</label>
		<div class="m-b20 d-flex">
			<div class="m-r50">
				<div class="custom-control custom-radio">
					<input type="radio" class="custom-control-input" id="enable" name="service_status" value="1" checked>
					<label class="custom-control-label" for="enable">{{__('messages.Enable')}}</label>
				</div>
			</div>
			<div class="custom-control custom-radio">
				<input type="radio" class="custom-control-input" id="disable" name="service_status" value="0">
				<label class="custom-control-label" for="disable">{{__('messages.Disable')}}</label>
			</div>
		</div>
	</div>
	<div class="m-t20">
		<button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button> 
	</div>
</form>
<script>
	var errors = <?php echo json_encode($errors->any()); ?>;
		$(document).ready(function () {   
		if(errors == true){
			$("#morecategories").show();
		}else{
			$("#morecategories").hide();
		}
	});
	window.onload = function (e) {
      document.getElementById("category-type").selectedIndex = 0;
    };
</script>
@endsection
