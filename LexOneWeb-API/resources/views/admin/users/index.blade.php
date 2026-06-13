@extends('admin.layouts.sidebar')
@section('title', 'Users')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10">{{ $approved == 1 ? "Approved" : ($approved == 0 ? "Verification" : "Deleted") }} {{__('messages.Users')}} </h4>
            </div>
            <div>
                @php
                    $exportUrl = $approved == 1
                        ? route('user.export', ['filter' => 'approved'])
                        : ($approved == 0
                            ? route('user.export', ['filter' => 'pending'])
                            : route('user.export'));
                @endphp
                <a href="{{ $exportUrl }}">
                    <button class="btn btn-success align-text-top border-0 m-b10">
                        <i class="fa fa-download"></i> Export CSV
                    </button>
                </a>
            </div>
        </div>
        <div class="">
            @if($approved == 0)
                <form method="GET" action="{{ route('user.search',['user' => $user = 'pending']) }}">
            @elseif($approved == 1)
                <form method="GET" action="{{ route('user.search',['user' => $user = 'approved']) }}">
            @else
                <form method="GET" action="{{ route('user.search') }}">
            @endif
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="language-selector" name="search_for" class="form-control">
                            <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>>{{trans('messages.Name')}}</option>
                            <option value="email" <?php if($search_for === "email") { echo "selected"; } ?>>{{trans('messages.Email')}}</option>
                            <option value="mobile" <?php if($search_for === "mobile") { echo "selected"; } ?>>{{trans('messages.Mobile')}}</option>
                        </select>
                    </div>
                    <div class="col-lg-6">&nbsp;</div>
                    <div class="col-lg-4">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control search_filter"  name="search" autocomplete="off" placeholder="{{ trans('messages.Search users')}}"  value="{{$search}}" maxlength="30">
                            <input type="hidden" name="sort" value="createdAt">
                            <input type="hidden" name="direction" value="desc">
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit">{{trans('messages.Search')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr>
                        <th scope="col">{{trans('messages.S.No')}}</th>
                        <th scope="col">@sortablelink('name',trans('messages.Name'))</th>
                        <th scope="col">@sortablelink('email',trans('messages.Email'))</th>
                        <th class="nosorting">{{trans('messages.View')}}</th>
                        <th class="nosorting">{{trans('messages.Edit')}}</th>
                        <th class="nosorting">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($userrecords))
                    @foreach($userrecords as $user)
                    @if($user['email'] !== 'user@idemand.com')
                    <tr>
                        <td class="fontSize15">{{$index}}</td>
                        <td class="fontSize15">{{$user['name']}}</td>
                        <td class="fontSize15">{{$user['email']}}</td>
                        <td class="fontSize15">
                            <a href="{{ route('user.show', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15">
                            <a href="{{ route('user.edit', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0">
                                    <i class="fa fa-edit" title="{{trans('messages.Edit')}}"></i>
                                </button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center" style="white-space:nowrap;">
                            @if($user['status'] === 0)
                                <button class='btn btn-success btn-sm align-text-top border-0' title="Enable account" data-toggle="modal" data-target="#exampleModalCenter{{$index}}">
                                    <i class="fa fa-unlock"></i>
                                </button>
                            @elseif($user['status'] === 1)
                                <button class='btn btn-warning btn-sm align-text-top border-0' title="Disable account" data-toggle="modal" data-target="#exampleModalCenter{{$index}}">
                                    <i class="fa fa-lock"></i>
                                </button>
                            @else
                                <button class='btn btn-secondary btn-sm align-text-top border-0' title="Restore account" data-toggle="modal" data-target="#exampleModalCenter{{$index}}">
                                    <i class="fa fa-undo"></i>
                                </button>
                            @endif
                            @if($approved != 2)
                                <button class='btn btn-danger btn-sm align-text-top border-0' title="Delete user" data-toggle="modal" data-target="#deleteModal-{{$user['_id']}}">
                                    <i class="fa fa-trash"></i>
                                </button>
                            @else
                                <button class='btn btn-danger btn-sm align-text-top border-0' title="Permanently delete user and all related data" data-toggle="modal" data-target="#destroyModal-{{$user['_id']}}">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            @endif
                        </td>
                    </tr>
                    @php $index++; @endphp
                    @endif
                    @endforeach
                    @else
                    <tr>
                        <td colspan="6">{{trans('messages.No records found')}}</td>
                    </tr>
                    @endif
                    
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>
    <!-- Modal -->
    @php $modalindex =1; @endphp
    @foreach($userrecords as $user)
        <div class="modal fade" id="exampleModalCenter{{$modalindex}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        @if($user['status'] == 0)
                            {{__('messages.Do you want to enable this account?')}}  
                        @elseif($user['status'] == 1)
                            {{__('messages.Do you want to disable this account?')}}  
                        @else
                            {{__('messages.Do you want to restore this account?')}}
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if($user['status'] == 0)
                            <a href="{{ route('user.changeuserstatus', ['userId' => $user['userId'], 'userStatus' =>1 ]) }}" style="cursor: pointer;">
                                <button type="button"  class="btn btn-success">{{__('messages.Enable')}} </button>
                            </a>
                        @elseif($user['status'] == 1)
                             <a href="{{ route('user.changeuserstatus', ['userId' => $user['userId'], 'userStatus' => 0 ]) }}" style="cursor: pointer;">
                                <button type="button" class="btn btn-danger">{{__('messages.Disable')}}</button>
                            </a>
                        @else
                             <a href="{{ route('user.restore', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                <button type="button"  class="btn btn-warning">{{__('messages.Restore')}} </button>
                            </a>
                            
                        @endif
                    </div>
                </div>
            </div>
        </div>
        @php $modalindex++; @endphp

        @if($approved != 2)
        {{-- Soft-delete confirmation modal --}}
        <div class="modal fade" id="deleteModal-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="deleteModalTitle-{{$user['_id']}}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalTitle-{{$user['_id']}}">Delete User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete <strong>{{ $user['name'] }}</strong>?
                        Their account will be moved to the deleted list and they will no longer be able to log in.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <a href="{{ route('user.softdelete', ['id' => $user['_id']]) }}">
                            <button type="button" class="btn btn-danger">Delete</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @else
        {{-- Permanent delete confirmation modal --}}
        @php $dep = ($dependencyInfo ?? [])[$user['_id']] ?? ['reviews' => 0, 'devices' => 0]; @endphp
        <div class="modal fade" id="destroyModal-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="destroyModalTitle-{{$user['_id']}}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="destroyModalTitle-{{$user['_id']}}">Permanently Delete User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>This action is <strong>irreversible</strong>. Permanently deleting <strong>{{ $user['name'] }}</strong> will also remove:</p>
                        <ul>
                            <li><strong>{{ $dep['reviews'] }}</strong> review(s) written by this user</li>
                            <li><strong>{{ $dep['devices'] }}</strong> device token(s)</li>
                        </ul>
                        <p class="text-muted"><small>Booking history is preserved for accounting purposes.</small></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <form action="{{ route('user.destroy', ['id' => $user['_id']]) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Permanently Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        @endif
    @endforeach
@endsection