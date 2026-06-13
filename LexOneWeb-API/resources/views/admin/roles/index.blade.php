@extends('admin.layouts.sidebar')
@section('title', 'Roles')
@section('content')

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">@lang('messages.Are You Sure')</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>@lang('messages.notdeleteRole')</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Roles')}}</h4>
            </div>
            <div>
                <a href="{{ route('role.create') }}">
                    <button class="btn btn-info align-text-top border-0">
                        <i class="fa fa-plus" title="{{__('messages.Add')}}"></i> 
                        {{ __('messages.Add') }} {{ __('messages.Roles') }}
                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col">{{trans('messages.S.No')}}</th>
                        <th scope="col">{{trans('messages.Name')}}</th>
                        <th scope="col">{{trans('messages.description')}}</th>
                        <th class="nosorting">{{trans('messages.View')}}</th>
                        <th class="nosorting">{{trans('messages.Edit')}}</th>
                        <th class="nosorting">{{trans('messages.Delete')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    
                    @if(!empty($roles))
                        @foreach($roles as $role)
                            @if($name != $role['name'])
                                <tr class="text-center">
                                    <td class="fontSize15">{{$index}}</td>
                                    <td class="fontSize15">
                                        {{($role['name'])}}
                                    </td>
                                    <td class="fontSize15">
                                        {{$role['description']}}
                                    </td>
                                    <td class="fontSize15 text-center">
                                        <a href="{{ route('role.show', ['id' => $role['_id']]) }}" style="cursor: pointer;">
                                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                                        </a>
                                    </td>
                                    <td class="fontSize15">
                                        <a href="{{ route('role.edit', ['id' => $role['_id'] ]) }}" style="cursor: pointer;">
                                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i></button>
                                        </a>
                                    </td>
                                    <td class="fontSize15">
                                        @if ($role->admin_ids != [])
                                        {{-- <span><a type="button" data-toggle="modal" data-target="#deleteModal"><i class="lni lni-trash dark_stroke-transparent"></i></a></span> --}}
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#deleteModal">
                                            <i class="fa fa-trash" title="{{trans('messages.delete')}}"></i>
                                        </button>     
                                        @else
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$role['_id']}}">
                                            <i class="fa fa-trash" title="{{trans('messages.delete')}}"></i>
                                        </button> 
                                        @endif
                                    </td>
                                </tr>
                                @php $index++; @endphp
                            @endif
                        @endforeach
                    @else
                        <tr>
                            <td colspan="8">{{trans('messages.No records found')}}</td>
                        </tr>
                    @endif
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $roles->links() !!} </div>
        </div>
    </div>
    @foreach($roles as $role)
        <div class="modal fade" id="exampleModalCenter-{{$role['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {{__('messages.Are you sure you want to delete this item?')}}<br>
                        {{__('messages.If the roles are deleted then the corresponding moderator will also be deleted')}}
                    </div>
                    <div class="modal-footer">
                    <form action="{{ route('role.destroy', ['id' => $role['_id']]) }}" method="POST">
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
