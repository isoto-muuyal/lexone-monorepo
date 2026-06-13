@extends('admin.layouts.sidebar')
@section('title', 'Booking Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    {{__('messages.Booking')}}
                </h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">
                            {{__('messages.User')}}
                        </th>
                        <td class="fontSize15">
                            @foreach($users as $user)
                                @if($user->_id == $booking['userId'])
                                <a href="{{ route('user.show', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                    {{$user->name}}
                                </a>
                                @endif
                            @endforeach         
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Tasker')}}
                        </th>
                        <td class="fontSize15">
                            @foreach($users as $user)
                                @if($user->_id == $booking['taskerId'])
                                <a href="{{ route('tasker.show', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                    {{$user->name}}  
                                </a>
                                @endif
                            @endforeach         
                        </td>
                    </tr>
                    <?php if($booking->locationType === 'home' || $booking->locationType === 'transport') { ?>
                    <tr>
                        <th scope="col">
                            {{__('messages.Location')}}
                        </th>
                        <td class="fontSize15">
                            {{$booking->sourcelocation}} 
                        </td>
                    </tr>
                    <?php } ?>
                    <?php if($booking->locationType === 'transport') { ?>
                    <tr>
                        <th scope="col">
                            {{__('messages.Location')}}
                        </th>
                        <td class="fontSize15">
                            {{$booking->destLocation}} 
                        </td>
                    </tr>
                    <?php } ?>
                    <tr>
                        <th scope="col">
                            {{__('messages.Category')}}
                        </th>
                        <td class="fontSize15">
                            <a href="{{ route('category.show', ['categoryId' => $category['_id']]) }}" style="cursor: pointer;">
                                {{$category->name}} 
                            </a>    
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Subcategory')}}
                        </th>
                        <td class="fontSize15">
                            <a href="{{ route('subcategory.show', ['subcategoryId' => $subCategory->id]) }}" style="cursor: pointer;">
                                {{$subCategory->name}} 
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="col">
                            {{__('messages.Booked Date')}}
                        </th>
                        <td class="fontSize15">
                            {{$booking->bookedWhen->toDateTime()->format('d-m-Y') }} 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Price')}}
                        </th>
                        <td class="fontSize15">
                            {{$currencySymbol}} {{ $booking->price }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Status')}}
                        </th>
                        <td class="fontSize15">
                            {{ $booking->status }} 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.OTP')}}
                        </th>
                        <td class="fontSize15">
                            {{ $booking->otp }} 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Tax')}}
                        </th>
                        <td class="fontSize15">
                            {{$currencySymbol}} {{ $booking->tax }} 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Commission')}}
                        </th>
                        <td class="fontSize15">
                            {{$currencySymbol}} {{ $booking->commission }} 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Total Price')}}
                        </th>
                        <td class="fontSize15">
                            {{$currencySymbol}} {{ $booking->total }} 
                        </td>
                    </tr>
                </tbody>
                @if($services != null)
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                {{__('messages.Booking')}} {{__('messages.Detail')}}
                            </h4>
                        </div>
                        <?php //echo "<pre>"; print_r($bookingdetails[0]); ?>
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
                                            {{$currencySymbol}} {{$bookingdetail->price}}
                                        </td>
                                        <td class="fontSize15">
                                            {{$bookingdetail['quantity']}} {{$bookingdetail['pricing']}}
                                        </td>
                                        <td class="fontSize15">{{$currencySymbol}} {{$bookingdetail['total']}}</td>
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