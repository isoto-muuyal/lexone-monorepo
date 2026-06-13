@extends('admin.layouts.sidebar')
@section('title', 'App Settings')
@section('content')
    <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('app.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.App Settings')}}</h4>
        <div class="form-group">
            <label>{{__('messages.Docs Limit')}}</label><span class="text-danger">*</span>  
            
            <div class="form-group field-public_key">
                <input type="number" class="form-control" min="1" max="100" name="docsLimit"  value="{{$sitesettings->docsLimit}}" placeholder="{{__('messages.Docs Limit')}}" required>
            </div>		
        </div>
        <div class="form-group">
            <label>{{__('messages.Portfolio Limit')}}</label><span class="text-danger">*</span>  
            <div class="form-group field-public_key">
                <input type="number" class="form-control" min="1" max="100" name="portfolioLimit"  value="{{$sitesettings->portfolioLimit}}" placeholder="{{__('messages.Portfolio Limit')}}" required>
            </div>		
        </div>
        <div class="form-group">
            <label>{{__('messages.Guideline')}}</label><span class="text-danger">*</span>  
            <textarea id="editor1" name="guideLine" maxlength="1200">
                {{$sitesettings->guideLine}}
            </textarea>
            @if ($errors->has('guideLine'))<p class="text-danger">{{ $errors->first('guideLine') }}</p>@endif
        </div>
        <a href=# id="guideLineFr"><u>{{__('messages.Add In French Language')}}</u></a>
        <div class="form-group" id="french">
            <label>{{__('messages.Guideline')}}</label><span class="text-danger">*</span>  
            <textarea id="editor2" name="guideLineFr" maxlength="1200">
                {{$sitesettings->guideLineFr}}
            </textarea>
            @if ($errors->has('guideLineFr'))<p class="text-danger">{{ $errors->first('guideLineFr') }}</p>@endif
        </div>
        <br>
        <a href=# id="guideLineAr"><u>{{__('messages.Add In Arabic Language')}}</u></a>
        <div class="form-group" id="arabic">
            <label>{{__('messages.Guideline')}}</label><span class="text-danger">*</span>  
            <textarea id="editor3" name="guideLineAr" maxlength="1200">
                {{$sitesettings->guideLineAr}}
            </textarea>
            @if ($errors->has('guideLineAr'))<p class="text-danger">{{ $errors->first('guideLineAr') }}</p>@endif
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
    <script>
        $(document).ready(function () {
            $("#french").hide();
            $("#arabic").hide();
            $("#guideLineFr").click(function(){
                $("#french").slideToggle(250);
            });
            $("#guideLineAr").click(function(){
                $("#arabic").slideToggle(250);
            });
        });
    </script>
@endsection       
