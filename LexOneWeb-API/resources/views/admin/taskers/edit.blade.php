@extends('admin.layouts.sidebar')
@section('title', 'Tasker Edit')
@section('content')
    <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="{{ route('tasker.update', $tasker->id) }}" method="POST"  enctype="multipart/form-data">
        @csrf
        @method('patch')
        <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Edit')}} {{__('messages.Tasker')}}</h4>
        <div class="form-group">
            <label>{{__('messages.Name')}} </label> <span class="text-danger">*</span>  
            <input type="text" name="name" value="{{ $tasker->name }}" class="form-control input-lg" required/>
            @if ($errors->has('name'))<p class="text-danger">{{ $errors->first('name') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Email')}} </label> <span class="text-danger">*</span>  
            <input type="email" name="email" value='{{$tasker->email}}' class="form-control input-lg" required/>
            @if ($errors->has('email'))<p class="text-danger">{{ $errors->first('email') }}</p>@endif
        </div>
        <div class="form-group">
            <label>{{__('messages.Mobile')}} </label> <span class="text-danger">*</span>  
            <input type="tel" name="mobile" value='{{ $tasker->mobile }}' class="form-control input-lg"required />
            @if ($errors->has('mobile'))<p class="text-danger">{{ $errors->first('mobile') }}</p>@endif
        </div>
        @if($instantLocation == "false")
            @if(!empty($tasker->location))
                <div class="form-group">
                    <label>{{__('messages.Location')}} </label> <span class="text-danger">*</span>  
                    <select id="category-type" class="form-control" name="location" required>
                        <option value="">{{trans('messages.Select')}}</option>
                        @foreach($cities as $location)
                            <option value="{{ $location->city }}" @if(strval($tasker->location) === $location->city) selected @endif> 
                                {{$location->city}}, {{$location->state}}.
                            </option>
                        @endforeach
                    </select>
                </div>
            @endif
        @else
            <div class="form-group">
                <label>{{__('messages.Location')}} </label> <span class="text-danger">*</span>  
                <input  name="location" value="{{$tasker->location}}" class="form-control input-lg" readonly />
                {{-- @if ($errors->has('mobile'))<p class="text-danger">{{ $errors->first('mobile') }}</p>@endif --}}
            </div>
        @endif
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10">{{__('messages.Update')}}</button> 
        </div>
    </form>
@endsection