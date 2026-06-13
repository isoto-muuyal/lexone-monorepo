@extends('admin.layouts.sidebar')
@section('title', 'Subcategory Edit')
@section('content')
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('subcategory.update',['categoryId' => $categorydetails->_id]) }}" method="POST"  enctype="multipart/form-data">
    @csrf
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Edit')}} {{trans('messages.Subcategory')}}</h4>
    <div class="form-group">
        <label>{{trans('messages.Name')}} </label> <span class="text-danger">*</span>  
        <input type="text" class="form-control" name="category_name" placeholder="{{trans('messages.Category Name')}}" value="{{$categorydetails->name}}" required>
        @if ($errors->has('category_name'))<p class="text-danger">{{ $errors->first('category_name') }}</p>@endif
    </div>
    @foreach($languages as $language)
        <?php $catelang = $language['langcode'] ?>
        <div class="form-group">
            <label>{{$language['language']}} {{__('messages.Name')}} </label> <span class="text-danger">*</span>  
            <input type="text" class ="form-control" name="{{$language['langcode']}}" maxlength="30" value="{{$categorydetails->$catelang}}">
            @if ($errors->has($language['langcode']))<p class="text-danger">{{ $errors->first($language['langcode']) }}</p>@endif
        </div>
    @endforeach
    <div class="form-group">
        <label class="control-label" for="category-type">{{trans('messages.Parent Category')}}</label>
        <span class="text-danger">*</span>
        <select id="category-type" class="form-control" name="category_parent">
            <option value="">{{trans('messages.Select')}}</option>
            @foreach ($maincategories as $eachcategory)
                <option value="{{ $eachcategory->_id }}" @if(strval($categorydetails->parentCategory) === $eachcategory->_id) selected @endif> 
                    {{ $eachcategory->name }}  - {{ $eachcategory->type }} 
                </option>
            @endforeach    
        </select>
        @if ($errors->has('category_parent'))<p class="text-danger">{{ $errors->first('category_parent') }}</p>@endif
    </div>
    <div class="m-b20">
        <div class="profile picture">
            <label>{{trans('messages.Image')}}</label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="category_image" class="m-b15 p-2 borderGrey w-100"><br>
            <img src="{{url('/media/categories/'.$categorydetails->image)}}" class="img-thumbnail" id="wizardPicturePreview"  style="width:100px;height:100px;object-fit: cover;">
        </div>
        @if ($errors->has('category_image'))<p class="text-danger">{{ $errors->first('category_image') }}</p>@endif
    </div>
    <div class="form-group">
        <label>{{trans('messages.Status')}}</label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="category_status" value="1" @if($categorydetails->status == 1) checked @endif>
                    <label class="custom-control-label" for="enable">{{trans('messages.Enable')}}</label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="category_status" value="0" @if($categorydetails->status == 0) checked @endif>
                <label class="custom-control-label" for="disable">{{trans('messages.Disable')}}</label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Update')}}</button> 
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
  </script>
@endsection