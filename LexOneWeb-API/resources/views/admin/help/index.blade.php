@extends('admin.layouts.sidebar')
@section('title', 'Help')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Help')}}</h4>
            </div>
            <div>
                <a href="{{ route('help.create') }}">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="{{__('messages.Add')}}"></i> 
                        {{ __('messages.Add') }} {{ __('messages.Help') }}
                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col">{{__('messages.S.No')}}</th>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <th class="nosorting">{{__('messages.Type')}}</th>
                        <th class="nosorting">{{__('messages.Language')}}</th>
                        <th class="nosorting">{{__('messages.Edit')}}</th>
                        <th class="nosorting">{{__('messages.Delete')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($help))
                        @foreach($help as $help)
                            <tr class="text-center">
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    {{$help['name']}}
                                </td>
                                @if($help['type'] == "tasker")
                                    <td class="fontSize15">
                                        Tasker
                                    </td>
                                @else
                                    <td class="fontSize15">
                                        User
                                    </td>
                                @endif
                                @if($help['lang'] == "ar")
                                    <td class="fontSize15">
                                        Arabic
                                    </td>
                                @elseif($help['lang'] == "fr")
                                    <td class="fontSize15">
                                        French
                                    </td>
                                @elseif($help['lang'] == "en")
                                    <td class="fontSize15">
                                        English
                                    </td>
                                @endif
                                <td class="fontSize15">
                                    <a href="{{ route('help.edit', ['id' => $help['_id'] ]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <form action="{{ route('help.destroy', ['id' => $help['_id'] ]) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-danger align-text-top border-0"><i class="fa fa-trash" title="{{trans('messages.delete')}}"></i></button>
                                    </form>
                                </td>
                            </tr>
                            @php $index++; @endphp
                        @endforeach
                    @else
                        <tr>
                            <td colspan="8">{{trans('messages.No records found')}}</td>
                        </tr>
                    @endif
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>
@endsection
