@extends('admin.layouts.sidebar')
@section('title', 'City | Create')
@section('content')
<script src="{{ URL::asset('public/admin_assets/js/jquery-1.11.1/jquery.min.js') }}"></script>
<link rel="stylesheet" href="{{ URL::asset('public/admin_assets/css/select2.min.css') }}">
<script src="{{ URL::asset('public/admin_assets/js/select2.min.js') }}"></script>
<script src="{{ URL::asset('public/admin_assets/js/geodata.js') }}"></script>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
	<div class="d-flex justify-content-between  flex-column flex-sm-row">
		<div>
			<h4 class="m-b25 blueTxtClr p-t10 p-b10">{{__('messages.Location')}}</h4>
		</div>
		<div>
			<button class="btn btn-primary align-text-top border-0 m-b10"  data-toggle="modal" data-target="#exampleModalCenter">
				{{ __('messages.Change') }} {{ __('messages.Country') }}
			</button>
		</div>
	</div>
	<form action="{{ route('location.store') }}" method="post" enctype="multipart/form-data">
		@csrf
		<div class="form-group">
			<div class="form-row">
				<div class="col-12">
					@include('admin.location.alpha2code')
				</div>
				<div class="col-12">
					<label>{{__('messages.State')}}</label><span class="text-danger">*</span> 
					<select name="state" class="states form-control" id="stateId" required>
						<option value="">Select State</option>
					</select><br>
					@if ($errors->has('state'))<p class="text-danger">{{ $errors->first('state') }}</p>@endif
				</div>
				<div class="col-12 " id="cityhide">
					<label>{{__('messages.City')}}</label><span class="text-danger">*</span> 
					<select name="city[]" class="cities form-control mul-select " id="cityId" multiple="true"  required>
						<option value="" ></option>
					</select>
					@if ($errors->has('city'))<p class="text-danger">{{ $errors->first('city') }}</p>@endif
				</div>
			</div>
			<div class="m-t20">
				<button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
			</div>
		</div>
	</form>
	<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLongTitle">{{ __('messages.Are You Sure') }}</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					{{ __('messages.If You Change country entire states and cities will be deleted are you sure to proceed') }}
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					<a href="{{ route('location.truncate') }}">
						<button type="button" class="btn btn-primary">{{ __('messages.Proceed') }}</button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection       
