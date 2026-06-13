@extends('admin.layouts.sidebar')
@section('title', 'Bookings')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Bookings')}} </h4>
            </div>
        </div>
        <div class="">
            <form method="GET" action="{{ route('booking.select') }}">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="status-selector" name="search_for" class="form-control">
                            <option value="all" <?php if($search_for === "all") { echo "selected"; } ?>>All</option>
                            <option value="requested"<?php if($search_for === "requested") { echo "selected"; } ?>>Requested</option>
                            <option value="started"<?php if($search_for === "started") { echo "selected"; } ?>>Started</option>
                            <option value="cancelled"<?php if($search_for === "cancelled") { echo "selected"; } ?>>Cancelled</option>
                            <option value="paid"<?php if($search_for === "paid") { echo "selected"; } ?>>Paid</option>
                            <option value="completed"<?php if($search_for === "completed") { echo "selected"; } ?>>Completed</option>
                            <option value="accepted"<?php if($search_for === "accepted") { echo "selected"; } ?>>Accepted</option>
                            <option value="refunded"<?php if($search_for === "refunded") { echo "selected"; } ?>>Refunded</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="nosorting">{{__('messages.S.No')}}</th>
                        <th class="nosorting">{{__('messages.User')}}</th>
                        <th scope="col">@sortablelink('total',trans('messages.Total Price'))</th>
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
                                    {{$currencySymbol}} {{$booking['total']}} 
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
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            $("#status-selector").change(function(){
                this.form.submit();
            });
        });
    </script>
@endsection
