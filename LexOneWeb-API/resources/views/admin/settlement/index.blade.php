@extends('admin.layouts.sidebar')
@section('title', 'Unpaid Settlement')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Unpaid Settlement')}} </h4>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="nosorting">{{__('messages.S.No')}}</th>
                        <th class="nosorting">{{__('messages.Name')}}</th>
                        <th class="nosorting">{{__('messages.Email')}}</th>
                        <th class="nosorting">{{__('messages.Amount')}}</th>
                        <th class="nosorting">{{__('messages.Reward')}}</th>
                        <th class="nosorting">{{__('messages.Tax')}}</th>
                        <th class="nosorting">{{__('messages.Commission')}}</th>
                        <th class="nosorting">{{__('messages.Total')}}</th>
                        <th class="nosorting">{{__('messages.Show')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($taskers))
                        @foreach($taskers as $tasker)
                            <tr class="text-center">
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    {{$tasker['name']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['email']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['price']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['reward']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['tax']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['commission']}}
                                </td>
                                <td class="fontSize15">
                                    {{$tasker['total']}}
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('settlement.show', ['id' => $tasker['_id'] ]) }}" style="cursor: pointer;">
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
    
@endsection
