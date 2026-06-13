@extends('admin.layouts.sidebar')
@section('title', 'settlement | unpaid Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    {{__('messages.Settlement Details')}}
                </h4>
            </div>
        </div>
        <table id="example" class="table table-striped table-bordered mytable text-center">
            <tbody>
                <tr>
                    <th scope="col">{{__('messages.Name')}}</th>
                    <td class="fontSize15">
                        <a href="{{ route('tasker.show', ['id' => $tasker['_id']]) }}" style="cursor: pointer;">
                            {{$tasker->name}} ({{$tasker->rating}})
                        </a>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Price')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$price}}</b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Tax')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$tax}}</b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Commission')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$commission}}</b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Total')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$total}} </b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Reward')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$reward}}</b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Tasker Earnings')}}</th>
                    <td class="fontSize15">
                        <b>{{$currencySymbol}} {{$amount}}</b>
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Email')}}</th>
                    <td class="fontSize15">
                        {{$tasker->email}}
                    </td>
                </tr>
                <tr>
                    <th scope="col">{{__('messages.Mobile')}}</th>
                    <td class="fontSize15">
                        {{$tasker->mobile}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                {{__('messages.Booking Details')}}
            </h4>
        </div>
        <table id="example" class="table table-striped table-bordered w-100 mytable">
            <thead>
                <tr class="text-center">
                    <th scope="nosorting">{{__('messages.S.No')}}</th>
                    <th scope="nosorting">{{__('messages.User')}}</th>
                    <th class="nosorting">{{__('messages.Total Price')}}</th>
                    <th class="nosorting">{{__('messages.Status')}}</th>
                    <th class="nosorting">{{__('messages.Date')}}</th>
                    <th class="nosorting">{{__('messages.Show')}}</th>
                </tr>
            </thead>
            <tbody>
                @php $index =1; @endphp
                @if(!empty($bookings))
                    @foreach($bookings as $booking)
                        <tr class="text-center">
                            <td class="fontSize15">{{$index}}</td>
                            <td class="fontSize15">
                                @foreach($users as $user)
                                    @if($user->_id == $booking['userId'])
                                        {{$user->name}}
                                    @endif
                                @endforeach
                            </td>
                            <td class="fontSize15">
                                {{$currencySymbol}}  {{$booking['price']}} 
                            </td>
                            <td class="fontSize15"> 
                                @if($booking['status'] == 'requested')
                                    <h5><span class="badge badge-primary">Requested</span></h5>
                                @elseif($booking['status'] == 'completed')
                                    <h5><span class="badge badge-secondary">Completed</span></h5>
                                @elseif($booking['status'] == 'cancelled')
                                    <h5><span class="badge badge-danger">Cancelled</span></h5>
                                @elseif($booking['status'] == 'paid')
                                    <h5><span class="badge badge-success">Paid</span></h5>
                                @elseif($booking['status'] == 'started')
                                    <h5><span class="badge badge-warning">Started</span></h5>
                                @elseif($booking['status'] == 'accepted')
                                    <h5><span class="badge badge-primary">Accepted</span></h5>
                                @elseif($booking['status'] == 'refunded')
                                    <h5><span class="badge badge-primary">Refunded</span></h5>
                                @endif
                            </td>
                            <td class="fontSize15">
                                {{$booking['bookedWhen']->toDateTime()->format('d-m-Y')}} 
                            </td>
                            <td class="fontSize15 text-center">
                                <a href="{{ route('booking.show', ['id' => $booking['_id']]) }}" style="cursor: pointer;">
                                    <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                                </a>
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
    </div>
@endsection