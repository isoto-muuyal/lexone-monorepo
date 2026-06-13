@extends('admin.layouts.sidebar')
@section('title', 'Taskers')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10">{{ $approved == 0 ? "Unverified" :($approved == 1?"Verified":"Deleted") }} {{__('messages.Taskers')}} </h4>
            </div>
            <div class="d-flex gap-2">
                @php
                    $exportUrl = $approved == 1
                        ? route('tasker.export', ['filter' => 'approved'])
                        : ($approved == 0
                            ? route('tasker.export', ['filter' => 'pending'])
                            : route('tasker.export'));
                @endphp
                <a href="{{ $exportUrl }}">
                    <button class="btn btn-success align-text-top border-0 m-b10">
                        <i class="fa fa-download"></i> Export CSV
                    </button>
                </a>
                <a href="{{ route('tasker.create') }}">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="{{__('messages.Add')}}"></i>
                        {{__('messages.Add')}} {{__('messages.Tasker')}}
                    </button>
                </a>
            </div>
        </div>
        <div class="">
            @if($approved == 0)
                <form method="GET" action="{{ route('tasker.search',['tasker' => $tasker = 'pending']) }}">
            @elseif($approved == 1)
                <form method="GET" action="{{ route('tasker.search',['tasker' => $tasker = 'approved']) }}">
            @else
                <form method="GET" action="{{ route('tasker.search') }}">
            @endif
                    <div class="form-group row">
                        <div class="col-lg-2">
                            <select  id="language-selector" name="search_for" class="form-control">
                                <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>>{{__('messages.Name')}}</option>
                                <option value="email" <?php if($search_for === "email") { echo "selected"; } ?>>{{__('messages.Email')}}</option>
                                <option value="mobile" <?php if($search_for === "mobile") { echo "selected"; } ?>>{{__('messages.Mobile')}}</option>
                            </select>
                        </div>
                        <div class="col-lg-6">&nbsp;</div>
                        <div class="col-lg-4">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control search_filter" placeholder="{{__('messages.Search taskers')}}" name="search" autocomplete="off" value="{{$search}}" maxlength="30">
                                <input type="hidden" name="sort" value="createdAt">
                                <input type="hidden" name="direction" value="desc">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit">{{__('messages.Search')}}</button>
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
                        <th scope="col">{{__('messages.S.No')}}</th>
                        <th scope="col">@sortablelink('name',__('messages.Name'))</th>
                        <th scope="col">@sortablelink('email',__('messages.Email'))</th>
                        <th scope="col">@sortablelink('mobile',__('messages.Mobile'))</th>
                        <th class="nosorting">{{__('messages.Documents')}}</th>
                        <th class="nosorting">{{__('messages.View')}}</th>
                        <th class="nosorting">{{__('messages.Edit')}}</th>
                        <th class="nosorting">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($userrecords))
                        @foreach($userrecords as $user)
                        @if($user['email'] != 'tasker@idemand.com')
                            <tr >
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    {{$user['name']}}
                                </td>
                                <td class="fontSize15">{{$user['email']}}</td>
                                <td class="fontSize15">{{$user['mobile']}}</td>
                                <td class="fontSize15 text-center">
                                    <a href="{{ route('taskerdocument.index', ['id' => $user['_id']]) }}" target="blank" >
                                        <button class="btn btn-info align-text-top border-0">
                                            <i class="fa fa-files-o" title="{{__('messages.Documents')}}" aria-hidden="true"></i>
                                        </button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('tasker.show', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0">
                                            <i class="fa fa-eye" title="{{__('messages.Show')}}"></i>
                                        </button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('tasker.edit', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="{{__('messages.Edit')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15 text-center" style="white-space:nowrap;">
                                    @if(($user['status'] ?? 1) == 0)
                                        <button class='btn btn-success btn-sm align-text-top border-0' title="Enable account" data-toggle="modal" data-target="#exampleModalCenter-{{$user['_id']}}">
                                            <i class="fa fa-unlock"></i>
                                        </button>
                                    @elseif(($user['status'] ?? 1) == 1)
                                        <button class='btn btn-warning btn-sm align-text-top border-0' title="Disable account" data-toggle="modal" data-target="#exampleModalCenter-{{$user['_id']}}">
                                            <i class="fa fa-lock"></i>
                                        </button>
                                    @else
                                        <button class='btn btn-secondary btn-sm align-text-top border-0' title="Restore account" data-toggle="modal" data-target="#exampleModalCenter-{{$user['_id']}}">
                                            <i class="fa fa-undo"></i>
                                        </button>
                                    @endif
                                    @if($approved != 2)
                                        @if($user['verified'] == 0)
                                            <button class='btn btn-success btn-sm align-text-top border-0' title="Approve tasker" data-toggle="modal" data-target="#exampleModalCenter2-{{$user['_id']}}">
                                                <i class="fa fa-check"></i>
                                            </button>
                                        @else
                                            <button class='btn btn-info btn-sm align-text-top border-0' title="Unapprove tasker" data-toggle="modal" data-target="#exampleModalCenter2-{{$user['_id']}}">
                                                <i class="fa fa-ban"></i>
                                            </button>
                                        @endif
                                    @endif
                                    @if($approved != 2)
                                        <button class='btn btn-danger btn-sm align-text-top border-0' title="Delete tasker" data-toggle="modal" data-target="#deleteModal-{{$user['_id']}}">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    @else
                                        <button class='btn btn-danger btn-sm align-text-top border-0' title="Permanently delete tasker and all related data" data-toggle="modal" data-target="#destroyModal-{{$user['_id']}}">
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
                        <td colspan="8">{{__('messages.No records found')}}</td>
                    </tr>
                    @endif
                </tbody>
            </table>
            <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
        </div>
    </div>


    @foreach($userrecords as $user)
        <!-- Tasker Status enable or disable modal -->
        <div class="modal fade" id="exampleModalCenter-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        @if(($user['status'] ?? 1) == 0)
                             {{__('messages.Do you want to enable this account?')}}
                        @elseif(($user['status'] ?? 1) == 1)
                            {{__('messages.Do you want to disable this account?')}}
                        @else
                            {{__('messages.Do you want to restore this account?')}}
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if(($user['status'] ?? 1) == 0)
                            <a href="{{ route('tasker.changeuserstatus', ['userId' => $user['userId'], 'userStatus' => 1 ]) }}" style="cursor: pointer;">
                                <button type="button" class="btn btn-success">{{__('messages.Enable')}}</button>
                            </a>
                        @elseif(($user['status'] ?? 1) == 1)
                            <a href="{{ route('tasker.changeuserstatus', ['userId' => $user['userId'], 'userStatus' => 0 ]) }}" style="cursor: pointer;">
                            <button type="button" class="btn btn-danger">{{__('messages.Disable')}}</button>
                            </a>
                        @else
                             <a href="{{ route('tasker.restore', ['id' => $user['_id']]) }}" style="cursor: pointer;">
                                <button type="button"  class="btn btn-warning">{{__('messages.Restore')}} </button>
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Tasker Status approve or unapprove modal -->
        <div class="modal fade" id="exampleModalCenter2-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        @if($user['verified'] == 0)
                             {{__('messages.Do you want to Approve this account?')}}
                             <p style="font-size: 12px; color:red">Note: Please verify the tasker certificate and details to approve the tasker booking activity</p>
                        @else
                            {{__('messages.Do you want to Unapprove this account?')}}
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if($user['verified'] == 0)
                            <a href="{{ route('tasker.pendingStatus', ['id' => $user['userId'], 'taskerStatus' =>1 ]) }}" style="cursor: pointer;">
                                <button class='btn btn-success align-text-top border-0'>
                                    {{__('messages.Approve')}}
                                </button>
                            </a>
                        @else
                            <a href="{{ route('tasker.pendingStatus', ['id' => $user['userId'], 'taskerStatus' =>0 ]) }}" style="cursor: pointer;">
                                <button class='btn btn-danger align-text-top border-0'>
                                    {{__('messages.Unapprove')}}
                                </button>
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        @if($approved != 2)
        {{-- Soft-delete confirmation modal --}}
        <div class="modal fade" id="deleteModal-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="deleteModalTitle-{{$user['_id']}}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalTitle-{{$user['_id']}}">Delete Tasker</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete <strong>{{ $user['name'] }}</strong>?
                        Their account will be moved to the deleted list and they will no longer be able to accept bookings.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <a href="{{ route('tasker.softdelete', ['id' => $user['_id']]) }}">
                            <button type="button" class="btn btn-danger">Delete</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @else
        {{-- Permanent delete confirmation modal --}}
        @php $dep = ($dependencyInfo ?? [])[$user['_id']] ?? ['reviews' => 0, 'media' => 0, 'pricings' => 0, 'devices' => 0, 'logs' => 0]; @endphp
        <div class="modal fade" id="destroyModal-{{$user['_id']}}" tabindex="-1" role="dialog" aria-labelledby="destroyModalTitle-{{$user['_id']}}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="destroyModalTitle-{{$user['_id']}}">Permanently Delete Tasker</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>This action is <strong>irreversible</strong>. Permanently deleting <strong>{{ $user['name'] }}</strong> will also remove:</p>
                        <ul>
                            <li><strong>{{ $dep['reviews'] }}</strong> review(s) about this tasker</li>
                            <li><strong>{{ $dep['media'] }}</strong> media file(s) (portfolio &amp; documents)</li>
                            <li><strong>{{ $dep['pricings'] }}</strong> service pricing(s)</li>
                            <li><strong>{{ $dep['devices'] }}</strong> device token(s)</li>
                            <li><strong>{{ $dep['logs'] }}</strong> approval log(s)</li>
                        </ul>
                        <p class="text-muted"><small>Booking history is preserved for accounting purposes.</small></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <form action="{{ route('tasker.destroy', ['id' => $user['_id']]) }}" method="POST" style="display:inline;">
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
