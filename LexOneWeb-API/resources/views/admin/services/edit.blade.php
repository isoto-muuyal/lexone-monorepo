@extends('admin.layouts.sidebar')
@section('title', 'Service Edit')
@section('content')
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('service.update',['serviceId' => $servicedetails->_id]) }}" method="POST"  enctype="multipart/form-data">
    @csrf
    <input type="hidden" id="ajax_url" url="{{route('service.ajaxsubcategories')}}" />
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Edit')}} {{trans('messages.Service')}}</h4>
    <div class="form-group">
        <label>{{trans('messages.Name')}}</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" name="service_name" placeholder="{{trans('messages.Service Name')}}" value="{{ $servicedetails->name }}" required>
        @if ($errors->has('service_name'))<p class="text-danger">{{ $errors->first('service_name') }}</p>@endif
    </div>
    @foreach($languages as $language)
        <?php $catelang = $language['langcode'] ?>
        <div class="form-group">
            <label>{{$language['language']}} {{__('messages.Name')}} </label> <span class="text-danger">*</span>  
            <input type="text" class ="form-control" name="{{$language['langcode']}}" maxlength="30" value="{{$servicedetails->$catelang}}">
            @if ($errors->has($language['langcode']))<p class="text-danger">{{ $errors->first($language['langcode']) }}</p>@endif
        </div>
    @endforeach
    <div class="form-group">
        <label class="control-label" for="category-type">{{trans('messages.Main Category')}}</label>
        <span class="text-danger">*</span>
        <select id="category-type" class="form-control" name="service_category_parent">
            <option value="">{{trans('messages.Select')}}</option>
            @foreach ($maincategories as $eachcategory)
                <option value="{{ $eachcategory->_id }}" @if(strval($servicedetails->mainCategory) === $eachcategory->_id) selected @endif> 
                {{ $eachcategory->name }} - {{ $eachcategory->type }} 
                </option>
            @endforeach    
        </select>
        @if ($errors->has('category_parent'))<p class="text-danger">{{ $errors->first('category_parent') }}</p>@endif
    </div>
    <div class="form-group">
        <div class="m-b20">
        <div class="profile picture">
            <label>{{trans('messages.Image')}}</label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="service_image" class="m-b15 p-2 borderGrey w-100" ><br>
            <img src="{{url('/media/services/'.$servicedetails->image)}}" class="img-thumbnail" id="wizardPicturePreview" style="width:100px;height:100px;object-fit: cover;">
        </div>
        @if ($errors->has('service_image'))<p class="text-danger">{{ $errors->first('service_image') }}</p>@endif
    </div>
    <div class="advanced_service_sec">
    </div>
    <div id="element">
        <div class="form-group">
            <label class="control-label" for="category-type">{{trans('messages.Sub Category')}}</label>
            <span class="text-danger">*</span>
            <select id="category-type" class="form-control" name="service_subcategory_parent">
                @if(!empty($subcategories))
                    @foreach ($subcategories as $eachcategory)
                        <option value="{{ $eachcategory->id }}" @if(($servicedetails->subCategory) == $eachcategory->id) selected @endif> 
                            {{ $eachcategory->name }}
                        </option>
                    @endforeach  
                @endif  
            </select>
            @if ($errors->has('service_subcategory_parent'))<p class="text-danger">{{ $errors->first('service_subcategory_parent') }}</p>@endif
        </div>
        @if($price_required)
            <div class="form-group">
                <label>{{trans('messages.Service Cost')}} </label>  
                <input type="number" class="form-control"  min="1" step=".01" max="999999"  name="service_cost" placeholder="{{trans('messages.Minimum Service Cost is')}} <?php echo $setting->currencySymbol.' '.$setting->minimumAmount; ?>" value="{{ $servicedetails->serviceCost }}" required>
                @if ($errors->has('service_cost'))<p class="text-danger">{{ $errors->first('service_cost') }}</p>@endif
            </div>
            <div class="form-group">
                <label>{{trans('messages.Cost Type')}}</label>
                <div class="m-b20 d-flex">
                    <div class="m-r50">
                        <div class="custom-control custom-radio">
                            <input type="radio" class="custom-control-input" id="unit" name="service_cost_type" value="unit" @if($servicedetails->costType == "unit") checked @endif>
                            <label class="custom-control-label" for="unit">{{trans('messages.Per Unit')}}</label>  
                        </div>
                    </div>
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="perhour" name="service_cost_type" value="hour" @if($servicedetails->costType == "hour") checked @endif>

                        <label class="custom-control-label" for="perhour">{{trans('messages.Per Hour')}}</label>
                    </div>
                </div>
            </div>
        @endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Status')}}</label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="service_status" value="1"  @if($servicedetails->status == 1) checked @endif>
                    <label class="custom-control-label" for="enable">{{trans('messages.Enable')}}</label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="service_status" value="0" @if($servicedetails->status == 0) checked @endif>
                <label class="custom-control-label" for="disable">{{trans('messages.Disable')}}</label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Update')}}</button> 
    </div>
    
</form>
@endsection