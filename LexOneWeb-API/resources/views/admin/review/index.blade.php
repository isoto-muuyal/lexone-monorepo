@extends('admin.layouts.sidebar')
@section('title', 'Reviews')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
            <h4 class="blueTxtClr p-t10 p-b10">{{$tasker->name}} {{__('messages.Reviews')}}</h4>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr>
                        <th scope="nosorting">{{__('messages.S.No')}}</th>
                        <th class="nosorting">{{__('messages.User')}}</th>
                        <th class="nosorting">{{__('messages.Review')}}</th>
                        <th class="nosorting">{{__('messages.Rating')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if($user != "")
                        @foreach($reviews as $b)
                            <tr >
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    @foreach($user as $u)
                                        @if($u->_id == $b['userId'])
                                            <a href="{{ route('user.show', ['id' => $u->_id]) }}" style="cursor: pointer;">
                                                {{$u->name}}
                                            </a>
                                        @endif
                                    @endforeach
                                </td>
                                <td class="fontSize15">
                                    {{$b['description']}}
                                </td>
                                <td class="fontSize15">{{$b['rating']}}</td>
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
