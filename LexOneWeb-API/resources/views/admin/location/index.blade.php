@extends('admin.layouts.sidebar')
@section('title', 'Cities')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    @if($settings->instantLocation == 'false')
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
            <h4 class="blueTxtClr p-t10 p-b10">{{ __('messages.City')}} {{ __('messages.Settings')}}</h4>
                </div>
                <div>
                    <a href="{{ route('location.create') }}">
                        <button class="btn btn-primary align-text-top border-0 m-b10">
                            <i class="fa fa-plus" title="{{__('messages.Add')}}"></i> 
                            {{ __('messages.Add') }} {{ __('messages.Location') }}
                        </button>
                    </a>
                </div>
            </div>
            <div class="">
                <form method="GET" action="{{ route('location.search') }}">
                    <div class="form-group row">
                        <div class="col-lg-2">
                            <select id="language-selector" name="search_for" class="form-control">
                                <option value="city" <?php if($search_for === "city") { echo "selected"; } ?>>{{__('messages.City')}}</option>
                                <option value="state" <?php if($search_for === "state") { echo "selected"; } ?>>{{__('messages.State')}}</option>
                            </select>
                        </div>
                        <div class="col-lg-6">&nbsp;</div>
                        <div class="col-lg-4">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control search_filter" value="{{$search}}"  placeholder="{{__('messages.Search Location')}}" name="search" autocomplete="off" maxlength="30">
                                <input type="hidden" name="sort" value="createdAt">
                                <input type="hidden" name="direction" value="desc">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit">{{__('messages.Search')}}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="table-responsive">
                <table id="example" class="table table-striped table-bordered w-100 mytable">
                    <thead>
                        <tr class="text-center">
                            <th scope="col">{{__('messages.S.No')}}</th>
                            <th scope="col">@sortablelink('city',trans('messages.City'))</th>
                            <th scope="col">@sortablelink('state',trans('messages.State'))</th>
                            <th class="nosorting">{{__('messages.Country')}}</th>
                            <th class="nosorting">{{__('messages.Delete')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php $index =1; @endphp
                        @if(!empty($cities))
                            @foreach($cities as $city)
                                <tr class="text-center">
                                    <td class="fontSize15">{{$index}}</td>
                                    <td class="fontSize15">
                                        {{$city['city']}}
                                    </td>
                                    <td class="fontSize15">
                                        {{$city['state']}}
                                    </td>
                                    <td class="fontSize15">
                                        {{$city['country']}}
                                    </td>
                                    <td class="fontSize15">
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$city['_id']}}">
                                            <i class="fa fa-trash" title="{{__('messages.delete')}}">
                                            </i>
                                        </button>
                                    </td>
                                </tr>
                                @php $index++; @endphp
                            @endforeach
                        @else
                            <tr>
                                <td colspan="8">{{__('messages.No records found')}}</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
                <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
            </div>
        </div>
    @else
        <form action="{{ route('location.store') }}" method="post" enctype="multipart/form-data">
            @csrf
            <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Location Settings')}}</h4>
            <div class="form-group">
                <label>{{__('messages.Max distance coverage to find Tasker')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <div class="input-group mb-2">
                        <input type="number" class="form-control" min="1" step=".01"  name="maxDistance"  value="{{$settings->maxDistance}}" placeholder="{{__('messages.Maximum radius coverage')}}" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text">km</div>
                        </div>
                    </div>
                    @if ($errors->has('maxDistance'))<p class="text-danger">{{ $errors->first('maxDistance') }}</p>@endif
                </div>	
                <label>{{__('messages.Max distance for ride')}}</label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <div class="input-group mb-2">
                        <input type="number" class="form-control" min="1" step=".01"  name="rideDistance"  value="{{$settings->rideDistance}}" placeholder="{{__('messages.Ride Radius Coverage')}}" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text">km</div>
                        </div>
                    </div>
                    @if ($errors->has('rideDistance'))<p class="text-danger">{{ $errors->first('rideDistance') }}</p>@endif
                </div>		
            </div>
            <div class="m-t20">
                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
            </div>
        </form>
    @endif
    <!-- Modal -->
    @foreach($cities as $city)
        <div class="modal fade" id="exampleModalCenter-{{$city['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{__('messages.Are you sure you want to delete this item?')}}
                    </div>
                    <div class="modal-footer">
                    <form action="{{ route('location.destroy', ['id' => $city['_id']]) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger align-text-top border-0">
                            {{__('messages.delete')}}
                        </button>
                    </form>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
@endsection
