@extends('admin.layouts.sidebar')
@section('title', 'Category Create')

@section('content')
  <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
  <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('category.store') }}" method="POST"  enctype="multipart/form-data">
      @csrf
      <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Add')}} {{trans('messages.Category')}}</h4>
      <div class="form-group">
          <label>{{trans('messages.Name')}} </label> <span class="text-danger">*</span>
          <input type="text" class="form-control" name="category_name" maxlength="30" placeholder="{{trans('messages.Category')}} {{trans('messages.Name')}}" value="{{old('category_name')}}" required>
          @if ($errors->has('category_name'))<p class="text-danger">{{ $errors->first('category_name') }}</p>@endif
      </div>
      <a href="#" id="RTL"><u>{{__('messages.Add Names In Other Languages')}}</u></a>
      <div id="morecategories">
        @foreach($languages as $language)
            <div class="form-group">
              <label>{{$language['language']}} {{__('messages.Name')}} </label> <span class="text-danger">*</span>  
              <input type="text" class ="form-control" name="{{$language['langcode']}}" maxlength="30" placeholder="{{__('messages.Category')}} {{__('messages.Name')}}" value="{{ old($language['langcode']) }}">
              @if ($errors->has($language['langcode']))<p class="text-danger">{{ $errors->first($language['langcode']) }}</p>@endif
            </div>
        @endforeach
      </div>
      <div class="form-group">
          <label>{{trans('messages.Type')}}</label>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="professional" name="category_type" value="professional" checked>
                      <label class="custom-control-label" for="professional">{{trans('messages.Professional')}}
                          <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#pro"></i>
                      </label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="marketplace" name="category_type" value="marketplace">
                  <label class="custom-control-label" for="marketplace">{{trans('messages.Marketplace')}}

                  </label>
                  <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#mar"></i>
              </div>
          </div>
      </div>
      <div class="form-group">
        <label class="control-label" for="location-type">{{__('messages.Location Type')}}</label>
        <span class="text-danger">*</span>
        <select id="location-type" class="form-control" name="locationType" required>
          <option value="">{{trans('messages.Select')}}</option>
          <option value="transport" {{ old('locationType') == "transport" ? 'selected' : '' }}>{{__('messages.Transport')}}</option>
          <option value="remote" {{ old('locationType') == "remote" ? 'selected' : '' }}>{{__('messages.Remote')}}</option>
          <option value="home" {{ old('locationType') == "home" ? 'selected' : '' }}>{{__('messages.Home')}}</option>
        </select>
        @if ($errors->has('locationType'))<p class="text-danger">{{ $errors->first('locationType') }}</p>@endif
      </div>
      <div class="m-b20">
          <div class="profile picture">
              <label>{{trans('messages.Image')}}</label> <span class="text-danger">*</span>
              <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="category_image" class="m-b15 p-2 borderGrey w-100" required><br>
              <img src="" class="borderCurve borderGradient picture-src dnone" id="wizardPicturePreview"
              style="width:100px;height:100px;object-fit: cover;">
          </div>
          @if ($errors->has('category_image'))<p class="text-danger">{{ $errors->first('category_image') }}</p>@endif
      </div>
      <div class="form-group">
          <label>{{trans('messages.Status')}}</label><span class="text-danger">*</span>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="enable" name="category_status" value="1" checked>
                      <label class="custom-control-label" for="enable">{{trans('messages.Enable')}}</label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="disable" name="category_status" value="0">
                  <label class="custom-control-label" for="disable">{{trans('messages.Disable')}}</label>
              </div>
          </div>
      </div>
      <div class="form-group">
          <label>{{trans('messages.Featured')}}</label><span class="text-danger">*</span>
          <div class="m-b20 d-flex">
              <div class="m-r50">
                  <div class="custom-control custom-radio">
                      <input type="radio" class="custom-control-input" id="Yes" name="category_feature" value="1" checked>
                      <label class="custom-control-label" for="Yes">{{trans('messages.Yes')}}</label>
                  </div>
              </div>
              <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" id="No" name="category_feature" value="0">
                  <label class="custom-control-label" for="No">{{trans('messages.No')}}</label>
              </div>
          </div>
      </div>
      <div class="form-group" >
        <label>{{__('messages.How It Works')}}</label>
        <textarea class="form-control" name="description" id="editor1" cols="30" rows="6" maxlength="1200" >
          {{ Request::old('description') }}
        </textarea>
        @if ($errors->has('description'))<p class="text-danger">{{ $errors->first('description') }}</p>@endif
      </div>
      <div class="form-group" >
        <label>{{__('messages.FAQ')}}</label>
        <textarea class="form-control" name="faq" id="editor2" cols="30" rows="6" maxlength="1200" >
          {{ Request::old('faq') }}
        </textarea>
        @if ($errors->has('faq'))<p class="text-danger">{{ $errors->first('faq') }}</p>@endif
      </div>
      <div class="form-group" >
        <label>{{__('messages.Description')}}</label>
        <textarea class="form-control" name="about" id="editor3" cols="30" rows="6" maxlength="1200" >
          {{ Request::old('about') }}
        </textarea>
        @if ($errors->has('about'))<p class="text-danger">{{ $errors->first('about') }}</p>@endif
      </div>
      @foreach($languages as $language)
        <div >
          <a href="#" id="collapse{{$language['code']}}"><u>{{$language['language']}} Language</u></a><br>
          
          <div id="expand{{$language['code']}}">
            <label>{{__('messages.About')}}</label>
            <textarea class="form-control" name="about{{$language['language']}}" id="count{{$language['language']}}" cols="30" rows="6" maxlength="1200" >
              {{ old('about' . $language['language']) }}
            </textarea>
            @if ($errors->has('about' . $language['language']))<p class="text-danger">{{ $errors->first('about' . $language['language']) }}</p>@endif
            <label>{{__('messages.FAQ')}}</label>
            <textarea class="form-control" name="faq{{$language['language']}}" id="about{{$language['language']}}" cols="30" rows="6" maxlength="1200" >
              {{ old('faq' . $language['language']) }}
            </textarea>
            @if ($errors->has('faq' . $language['language']))<p class="text-danger">{{ $errors->first('faq' . $language['language']) }}</p>@endif
            <label>{{__('messages.Description')}}</label>
            <textarea class="form-control" name="description{{$language['language']}}" id="Description{{$language['language']}}" cols="30" rows="6" maxlength="1200" >
              {{ old('description' . $language['language']) }}
            </textarea>
            @if ($errors->has('description' . $language['language']))<p class="text-danger">{{ $errors->first('description' . $language['language']) }}</p>@endif
          </div>
         
        </div>
      @endforeach
      <div class="m-t20">
          <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Save')}}</button>
      </div>
  </form>
  <!-- Modal -->
  <div class="modal fade" id="pro" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Professional</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Professional category has fixed price which cannot be changed by the tasker.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="mar" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Market Place</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Marketplace category does not have fixed price which can be given by the tasker.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  @foreach($languages as $language)
    <script>
      var errors = <?php echo json_encode($errors->any()); ?>;

      $(document).ready(function () {
        if(errors == true){
          $("#morecategories").show();
        }else{
          $("#morecategories").hide();
        }
    

        var collapse =<?php echo json_encode($language['code']); ?>;
        var expand =<?php echo json_encode($language['code']); ?>;
        var more = "#expand"+expand;
        var collapse2 = "#collapse"+collapse;
        if(errors == true){
          $(more).show();
        }else{
          $(more).hide();
        }
        $(collapse2).click(function(){
          $(more).slideToggle(250);
        });
      });
        var count =<?php echo json_encode($language['language'] ); ?>;
        var id = "#count"+count;
        if($(id).length )  {
        ClassicEditor
        .create(document.querySelector(id), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }

        var count2 =<?php echo json_encode($language['language'] ); ?>;
        var id2 = "#about"+count2
        if($(id2).length )  {
        ClassicEditor
        .create(document.querySelector(id2), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }
        var count3 =<?php echo json_encode($language['language'] ); ?>;
        var id3 = "#Description"+count3
        if($(id3).length )  {
        ClassicEditor
        .create(document.querySelector(id3), {
          toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
        })
        .then(editor => {
          window.editor = editor;
        })
        .catch(err => {
            // console.error(err.stack);
          });
        }
    </script>
  @endforeach
@endsection
