@extends('admin.layouts.sidebar')
@section('title', 'Jobs Detail')
@section('content')
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
     <div>
        <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Jobs')}} {{__('messages.Detail')}}</h4>
    </div>
</div>
<div class="table-responsive text-center">
    <table id="example" class="table table-striped table-bordered mytable">
        <tbody>
            <tr>
                <th scope="col">{{__('messages.Title Of The Job')}}</th>
                <td class="fontSize15">
                    {{ucwords($needs->bookedName)}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Status')}}</th>
                <td class="fontSize15">
                    {{$jobstatus}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Date')}}</th>
                <td class="fontSize15">
                    {{$bookedWhen}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.User')}}</th>
                <td class="fontSize15">
                    <a href="{{ route('user.show', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                        {{ucwords($user->name)}}
                    </a>
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Description')}}</th>
                <td class="fontSize15">
                    {{$needs->bookedFor}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Location')}}</th>
                <td class="fontSize15">
                    @if ($needs->sourcelocation)
                    <b>From</b> : {{$needs->sourcelocation}}<br>
                    @endif
                    @if ($needs->destLocation)
                    <b>To</b> : {{$needs->destLocation}}
                    @endif
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Tasker')}}</th>
                <td class="fontSize15">
                    @if($tasker)
                    <a href="{{ route('tasker.show', ['id' => $tasker['_id']]) }}" style="cursor: pointer;">
                        {{$tasker->name}}
                    </a>
                    @else
                    {{__('messages.Not Assigned')}}
                    @endif
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Main Category')}}</th>
                <td class="fontSize15">
                    <a href="{{ route('category.show', ['categoryId' => $category['_id']]) }}" style="cursor: pointer;">
                        {{$category->name}}
                    </a>
                </td>
            </tr> 
            <tr>
                <th scope="col">{{__('messages.Sub Category')}}</th>
                <td class="fontSize15">
                    <a href="{{ route('subcategory.show', ['subcategoryId' => $subCategory['_id']]) }}" style="cursor: pointer;">
                        {{$subCategory->name}}
                    </a>
                </td>
            </tr>

            <tr>
                <th scope="col">{{__('messages.Job Price')}}</th>
                <td class="fontSize15">
                    {{$currencySymbol}} {{$needs->price}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Tax')}}</th>
                <td class="fontSize15">
                    {{$currencySymbol}} {{$needs->tax}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Commission')}}</th>
                <td class="fontSize15">
                    {{$currencySymbol}} {{$needs->commission}}
                </td>
            </tr>
            <tr>
                <th scope="col">{{__('messages.Total Price')}}</th>
                <td class="fontSize15">
                    {{$currencySymbol}} {{$needs->total}}
                </td>
            </tr>
            @if($needs->reward)
            <tr>
                <th scope="col">
                    {{__('messages.Rewards')}}
                </th>
                <td class="fontSize15">
                    {{$currencySymbol}} {{$needs->reward}}
                </td>
            </tr>
            @endif
        </tbody>
        @if($services != null)
        <table class="table table-striped table-bordered w-100 mytable">
            <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    {{__('messages.Booking')}} {{__('messages.Detail')}}
                </h4>
            </div>
            <thead>
                <tr>
                    <th scope="col">{{__('messages.S.No')}}</th>
                    <th class="nosorting">{{__('messages.Service')}}</th>
                    <th class="nosorting">{{__('messages.Price')}}</th>
                    <th class="nosorting">{{__('messages.Quantity')}} </th>
                    <th class="nosorting">{{__('messages.Total')}}</th>
                </tr>
            </thead>
            <tbody>
                @php $index =1; @endphp
                @if(!empty($bookingdetails))
                @foreach($bookingdetails as $bookingdetail)
                <tr>
                    <td class="fontSize15">{{$index}}</td>
                    <td class="fontSize15">
                        @foreach($services as $service)
                        @if($service->_id == $bookingdetail['serviceId'])
                        <a href="{{ route('service.show', ['serviceId' => $service['_id']]) }}" style="cursor: pointer;">
                            {{$service->name}} 
                        </a>
                        @endif
                        @endforeach
                    </td>
                    <td class="fontSize15">
                        {{$currencySymbol}} {{round($bookingdetail->price,2)}}
                    </td>
                    <td class="fontSize15">
                        {{$bookingdetail['quantity']}} {{$bookingdetail['pricing']}}
                    </td>
                    <td class="fontSize15">{{$currencySymbol}} {{round($bookingdetail['total'],2)}}</td>
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