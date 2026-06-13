@extends('admin.layouts.sidebar')
@section('title', 'Banners')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.banners')}}</h4>
            </div>
            <div>
                <a href="{{ route('bannerimage.create') }}">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="{{__('messages.Add')}}"></i> 
                        {{ __('messages.Add') }} {{ __('messages.Banner') }}
                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col">{{__('messages.S.No')}}</th>
                        <th scope="col">{{__('messages.image_url')}}</th>
                        <th scope="col">{{__('messages.Image')}}</th>
                        <th class="nosorting">{{__('messages.View')}}</th>
                        <th class="nosorting">{{__('messages.Edit')}}</th>
                        <th class="nosorting">{{__('messages.Delete')}}</th>
                        <th class="nosorting">{{__('messages.Action')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($banners))
                        @foreach($banners as $banner)
                            <tr class="text-center">
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    <a href="{{$banner['url']}}" target="blank" style="color:#000;">
                                        {{$banner['url']}}
                                    </a>
                                </td>
                                <td class="fontSize15"><img src="{{url('/media/bannerimages/'.$banner['image'])}}" style="height:80px;"></td>
                                <td class="fontSize15">
                                    <a href="{{ route('bannerimage.show', ['id' => $banner['_id'] ]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('bannerimage.edit', ['id' =>$banner['_id']  ]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2-{{$banner['_id']}}">
                                        <i class="fa fa-trash" title="{{trans('messages.delete')}}">
                                        </i>
                                    </button>
                                </td>
                                <td class="fontSize15">
                                    @if($banner['status'] == 0)
                                        <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$banner['_id']}}">
                                            <i class="fa fa-unlock" title="{{trans('messages.Enable')}}"></i>
                                        </button>
                                    @else
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$banner['_id']}}">
                                            <i class="fa fa-lock" title="{{trans('messages.Disable')}}"></i>
                                        </button>
                                    @endif
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

     <!-- Disable Modal -->
    @foreach($banners as $banner)
        <div class="modal fade" id="exampleModalCenter-{{$banner['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        @if($banner['status'] == 0)
                            {{__('messages.Do you want to enable this banner?')}}  
                        @else
                            {{__('messages.Do you want to disable this banner?')}}
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if($banner['status'] == 0)
                            <a href="{{route('bannerimage.activestatus', ['id' => $banner['_id'], 'bannerstatus' => 1 ]) }}" style="cursor: pointer;">
                                <button type="button" class="btn btn-success">{{__('messages.Enable')}} </button>
                            </a>
                        @else
                            <a href="{{ route('bannerimage.activestatus', ['id' =>  $banner['_id'], 'bannerstatus' => 0 ]) }}" style="cursor: pointer;">
                                <button type="button" class="btn btn-danger">{{__('messages.Disable')}}</button>
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endforeach
    
    <!-- Delete Modal -->
    @foreach($banners as $banner)
        <div class="modal fade" id="exampleModalCenter2-{{$banner['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{__('messages.Do you want to delete this banner?')}}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{{__('messages.No')}}</button>
                        <form action="{{ route('bannerimage.destroy', ['id' => $banner['_id']]) }}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
                                {{__('messages.Yes')}}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
@endsection