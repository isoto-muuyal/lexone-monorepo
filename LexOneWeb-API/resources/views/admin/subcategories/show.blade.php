@extends('admin.layouts.sidebar')
@section('title', 'Sub Category Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Sub Category')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <td class="fontSize15">{{$subcategorydetail->name}}</td>
                    </tr>
                    @if ($subcategorydetail->arabicName)
                        <tr>
                            <th scope="col">{{__('messages.اسم')}}</th>
                            <td class="fontSize15">{{$subcategorydetail->arabicName}}</td>
                        </tr>
                    @endif
                    @if ($subcategorydetail->frenchName)
                        <tr>
                            <th scope="col">{{__('messages.Nom')}}</th>
                            <td class="fontSize15">{{$subcategorydetail->frenchName}}</td>
                        </tr>
                    @endif
                    <tr>
                        <th scope="col">{{__('messages.Image')}}</th>
                        <td class="fontSize15"><img src="{{url('/media/categories/'.$subcategorydetail['image'])}}" style="height:80px;">
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Status')}}</th>
                        <td class="fontSize15">
                            @if($subcategorydetail->status == 0 )
                                {{__('messages.Disabled')}}
                            @else
                                {{__('messages.Enabled')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Parent Category')}}</th>
                        <td class="fontSize15">
                            <a href="{{ route('category.show', ['categoryId' => $categories['_id']]) }}" style="cursor: pointer;">
                                {{ $categories->name }} 
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Category Type')}}</th>
                        <td class="fontSize15">
                            {{ $categories->type }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Featured')}}</th>
                        <td class="fontSize15">
                            @if($categories->featured == 0 )
                                {{__('messages.No')}}
                            @else
                                {{__('messages.Yes')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{trans('messages.Services')}}</th>
                        <td class="fontSize15">
                            @forelse ($services as $service)
                                    <a href="{{ route('service.show', ['serviceId' => $service['_id']]) }}" style="cursor: pointer;">
                                    {{$service->name}}
                                    </a><br>
                            @empty 
                                {{__('messages.No Services')}}
                            @endforelse
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection