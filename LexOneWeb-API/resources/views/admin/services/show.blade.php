@extends('admin.layouts.sidebar')
@section('title', 'Service Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Service')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <td class="fontSize15">{{$servicedetail->name}}</td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Image')}}</th>
                        @if(!empty($servicedetail['image']))
                            <td class="fontSize15">
                                <img src="{{url('/media/services/'.$servicedetail['image'])}}"  style="height:80px;">
                            </td>
                        @else
                            <td class="fontSize15">
                                <p>Image Unavailable</p>
                            </td>
                        @endif
                    </tr>
                    @if($price_required)
                        <tr>
                            <th scope="col">{{__('messages.Service Cost')}}</th>
                            <td class="fontSize15">
                                {{$currencySymbol}} {{ $servicedetail->serviceCost }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="col">{{__('messages.Cost Type')}}</th>
                            <td class="fontSize15">
                            @if($servicedetail->costType == "hour" )
                                {{__('messages.Per Hour')}}
                            @elseif($servicedetail->costType == "unit")
                                {{__('messages.Per Unit')}}
                            @else
                                {{__('messages.Fixed')}}
                            @endif
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <th scope="col">{{__('messages.Status')}}</th>
                        <td class="fontSize15">
                            @if($servicedetail->status == 0 )
                                {{__('messages.Disabled')}}
                            @else
                                {{__('messages.Enabled')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.category')}}</th>
                        <td class="fontSize15">
                            <a href="{{ route('category.show', ['categoryId' => $maincategory['_id']]) }}" style="cursor: pointer;">
                                {{ $maincategory->name }}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.category type')}}</th>
                        <td class="fontSize15">
                            {{ $maincategory->type }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Featured')}} {{__('messages.category')}}</th>
                        <td class="fontSize15">
                            @if($maincategory->featured == 0 )
                                {{__('messages.No')}}
                            @else
                                {{__('messages.Yes')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Subcategory')}}</th>
                        <td class="fontSize15">
                            <a href="{{ route('subcategory.show', ['subcategoryId' => $subcategory->id]) }}" style="cursor: pointer;">
                                {{ $subcategory->name }} 
                            </a>
                        </td>
                    </tr>
                </tbody>
                @if($taskers != "")
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                {{__('messages.Service')}} {{__('messages.Taskers')}} 
                            </h4>
                        </div>
                        <thead>
                            <tr>
                                <th scope="col">{{__('messages.S.No')}}</th>
                                <th class="nosorting">{{__('messages.Name')}}</th>
                                <th class="nosorting">{{__('messages.Email')}}</th>
                                <th class="nosorting">{{__('messages.Mobile')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @php $index =1; @endphp
                            @if(!empty($taskers))
                                @foreach($taskers as $tasker)
                                    <tr>
                                        <td class="fontSize15">{{$index}}</td>
                                        <td class="fontSize15">
                                            <a href="{{ route('tasker.show', ['id' => $tasker['_id']]) }}" style="cursor: pointer;">
                                                {{$tasker->name}}
                                            </a>
                                        </td>
                                        <td class="fontSize15">
                                                {{$tasker->email}}
                                        </td>
                                        <td class="fontSize15">
                                                {{$tasker->mobile}}
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
                @endif
            </table>
        </div>
    </div>
@endsection