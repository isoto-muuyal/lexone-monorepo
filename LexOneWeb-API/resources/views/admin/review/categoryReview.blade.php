@extends('admin.layouts.sidebar')
@section('title', 'Category Review ')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
            <h4 class="blueTxtClr p-t10 p-b10">{{$category->name}} {{__('messages.Reviews')}}</h4>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr>
                        <th scope="col">{{__('messages.S.No')}}</th>
                        <th class="nosorting">{{__('messages.User')}}</th>
                        <th class="nosorting">{{__('messages.Review')}}</th>
                        <th class="nosorting">{{__('messages.Rating')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($reviews))
                        @foreach($reviews as $review)
                            <tr >
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    @foreach($userNames as $userName)
                                        @if($userName['_id'] == $review['userId'])
                                            <a href="{{ route('user.show', ['id' => $u->_id]) }}" style="cursor: pointer;">
                                                {{$userName['name']}} 
                                            </a>
                                        @endif
                                    @endforeach
                                </td>
                               
                                <td class="fontSize15">
                                    {{$review['description']}}
                                </td>
                                <td class="fontSize15">{{$review['rating']}}</td>
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
        <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
    </div>
@endsection
