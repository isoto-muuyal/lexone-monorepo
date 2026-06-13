@extends('admin.layouts.sidebar')
@section('title', 'Banner Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{trans('messages.Banner')}} {{trans('messages.Detail')}}</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">{{trans('messages.image_url')}}</th>
                        <td class="fontSize15">
                            <a href="//{{ $banner->url }}"style="color:#000;">
                                {{$banner->url}}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Image')}}</th>
                        <td class="fontSize15"><img src="{{url('/media/bannerimages/'.$banner->image)}}" style="height:80px;"></td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Status')}}</th>
                        <td class="fontSize15">
                            @if($banner->status == 0 )
                                {{trans('messages.Disable')}}
                            @else
                                {{trans('messages.Enable')}}
                            @endif
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection