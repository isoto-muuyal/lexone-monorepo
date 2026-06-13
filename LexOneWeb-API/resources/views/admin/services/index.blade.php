@extends('admin.layouts.sidebar')
@section('title', 'Services')
@section('content')
    @php use App\Models\Category; @endphp
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
            <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Services')}}</h4>
            </div>
            <div>
                <a href="{{ route('service.add') }}">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="{{trans('messages.Add')}}"></i> 
                        {{trans('messages.Add')}} {{trans('messages.Service')}}
                    </button>
                </a>
            </div>
        </div>
        <div class="">
            <form method="GET" action="{{ route('service.search') }}">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="language-selector" name="search_for" class="form-control">
                            <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>>{{trans('messages.Name')}}</option>
                        </select>
                    </div>
                    <div class="col-lg-6">&nbsp;</div>
                    <div class="col-lg-4">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control search_filter" value="{{$search}}" placeholder="{{ trans('messages.Search services')}}" name="search" autocomplete="off" maxlength="30">
                            <input type="hidden" name="sort" value="createdAt">
                            <input type="hidden" name="direction" value="desc">
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit">{{trans('messages.Search')}}</button>
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
                        <th scope="col">{{trans('messages.S.No')}}</th>
                        <th scope="col">@sortablelink('name',trans('messages.Name'))</th>
                        <th class="nosorting">{{trans('messages.View')}}</th>
                        <th class="nosorting">{{trans('messages.Edit')}}</th>
                        <th class="nosorting">{{trans('messages.Action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($servicerecords))
                    @foreach($servicerecords as $service)
                    <tr class="text-center">
                        <td class="fontSize15">{{$index}}</td>
                        <td class="fontSize15">{{$service['name']}}</td>
                        <td class="fontSize15 text-center">
                            <a href="{{ route('service.show', ['serviceId' => $service['_id']]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15">
                            <a href="{{ route('service.edit', ['serviceId' => $service['_id'] ]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center">
                            @if($service['status'] == 0)
                                <button class='btn btn-success align-text-top border-0' data-toggle="modal" data-target="#exampleModalCenter-{{$service['_id']}}">
                                    <i class="fa fa-unlock" title="{{trans('messages.Enable')}}"></i>
                                </button>
                            @else
                                <button class='btn btn-danger align-text-top border-0' data-toggle="modal" data-target="#exampleModalCenter-{{$service['_id']}}">
                                    <i class="fa fa-lock" title="{{trans('messages.Disable')}}"></i>
                                </button>
                            @endif
                        </td>
                    </tr>
                    @php $index++; @endphp
                    @endforeach
                    @else
                    <tr>
                        <td colspan="8">{{trans('messages.No records found')}}</td>
                    </tr>
                    @endif
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>
    @foreach($servicerecords as $service)
        <div class="modal fade" id="exampleModalCenter-{{$service['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        @if($service['status'] == 0)
                             {{__('messages.Do you want to enable this Service?')}}
                        @else
                            {{__('messages.Do you want to disable this Service?')}} 
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if($service['status'] == 0)
                            <a href="{{route('service.activestatus', ['serviceId' => $service['_id'], 'serviceStatus' => 1 ]) }}" style="cursor: pointer;" >
                                <button type="button" class="btn btn-success">{{__('messages.Enable')}}</button>
                            </a>
                        @else
                            <a href="{{ route('service.activestatus', ['serviceId' =>  $service['_id'], 'serviceStatus' => 0 ]) }}" style="cursor: pointer;" >
                                <button type="button" class="btn btn-danger">{{__('messages.Disable')}}</button>
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endforeach
@endsection
