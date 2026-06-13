@extends('admin.layouts.sidebar')
@section('title', 'Moderators')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Moderators')}}</h4>
            </div>
            <div>
                <a href="{{ route('admin.create') }}">
                    <button class="btn btn-info align-text-top border-0">
                        <i class="fa fa-plus" title="{{__('messages.Add')}}"></i> 
                        {{ __('messages.Add') }} {{ __('messages.Moderators') }}
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
                        <th scope="col">{{__('messages.Email')}}</th>
                        <th class="nosorting">{{__('messages.View')}}</th>
                        <th class="nosorting">{{__('messages.Edit')}}</th>
                        <th class="nosorting">{{__('messages.Delete')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index = 1; @endphp
                    @forelse($admin as $admin)
                        @if($name != $admin['name'])
                            <tr class="text-center">
                                <td class="fontSize15">
                                    {{$index}}
                                </td>
                                <td class="fontSize15">
                                    {{$admin['name']}}
                                </td>
                                <td class="fontSize15">
                                    {{$admin['email']}}
                                </td>
                                <td class="fontSize15 text-center">
                                    <a href="{{ route('admin.show', ['id' => $admin['_id']]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('admin.edit', ['id' => $admin['_id'] ]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <form action="{{ route('admin.destroy', ['id' => $admin['_id']]) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-danger align-text-top border-0" >
                                            <i class="fa fa-trash" title="{{trans('messages.delete')}}"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            @php $index++; @endphp
                        @endif
                    @empty
                        <tr>
                            <td colspan="8">{{trans('messages.No records found')}}</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>
    @forelse($admin as $admins)
        <div class="modal fade" id="exampleModalCenter-{{$admin['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{__('messages.Are you sure you want to delete this item?')}}
                    </div>
                    <div class="modal-footer">
                    <form action="{{ route('admin.destroy', ['id' => $admin['_id']]) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger align-text-top border-0">
                            {{__('messages.delete')}}
                        </button>
                    </form>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
@endsection
