<div class="form-group">
	<label class="control-label" for="sub-category-type">{{trans('messages.Sub Category')}}</label>
	<select id="sub-category-type" class="form-control" name="service_subcategory_parent" required>
		<option value="">{{trans('messages.Select')}}</option>
		@if(!empty($subcategories))
			@foreach($subcategories as $subcategory)
				<option value="{{ $subcategory->_id }}">{{ $subcategory->name }}</option>
			@endforeach
		@endif
	</select>
	@if ($errors->has('service_subcategory_parent'))<p class="text-danger">{{ $errors->first('service_subcategory_parent') }}</p>@endif
</div>
@if($price_required)
	<div class="form-group">
		<label>{{trans('messages.Service Cost')}} </label>  
		<input type="number" min="1" step=".01" max="999999" class="form-control" name="service_cost" placeholder="{{trans('messages.Minimum Service Cost is')}} <?php echo $setting->currencySymbol.' '.$setting->minimumAmount; ?>">
		@if ($errors->has('service_cost'))<p class="text-danger">{{ $errors->first('service_cost') }}</p>@endif
	</div>
	<div class="form-group">
		<label>{{trans('messages.Cost Type')}}</label>
		<div class="m-b20 d-flex">
			<div class="m-r50">
				<div class="custom-control custom-radio">
					<input type="radio" class="custom-control-input" id="fixed" name="service_cost_type" value="unit" checked>
					<label class="custom-control-label" for="fixed">{{trans('messages.Per Unit')}}</label>
				</div>
			</div>
			<div class="custom-control custom-radio">
				<input type="radio" class="custom-control-input" id="perhour" name="service_cost_type" value="hour">
				<label class="custom-control-label" for="perhour">{{trans('messages.Per Hour')}}</label>
			</div>
		</div>
	</div>
@endif