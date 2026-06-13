@extends('admin.layouts.sidebar')
@section('title', 'Jobs')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10">{{__('messages.Jobs')}}</h4>
            </div>
        </div>
        <div class="">
            <form method="GET" action="{{ route('needs.select') }}">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="status-selector" name="search_for" class="form-control">
                            <option value="all" <?php if($search_for === "all") { echo "selected"; } ?>>All</option>
                            <option value="requested"<?php if($search_for === "requested") { echo "selected"; } ?>>Requested</option>
                            <option value="started"<?php if($search_for === "started") { echo "selected"; } ?>>Started</option>
                            <option value="cancelled"<?php if($search_for === "cancelled") { echo "selected"; } ?>>Cancelled</option>
                            <option value="paid"<?php if($search_for === "paid") { echo "selected"; } ?>>Paid</option>
                            <option value="completed"<?php if($search_for === "completed") { echo "selected"; } ?>>Completed</option>
                            <option value="expired"<?php if($search_for === "expired") { echo "selected"; } ?>>Expired</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col">{{__('messages.S.No')}}</th>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <th scope="col">{{__('messages.Status')}}</th>
                        <th scope="col">{{__('messages.Posted By')}}</th>
                        <th scope="col">{{__('messages.View')}}</th>
                        <th scope="col">{{__('messages.Status')}}</th>
                    </tr>
                </thead>
                <tbody>
                    @php $index =1; @endphp
                    @if(!empty($userNeeds))
                        @foreach($userNeeds as $book)
                            <tr class="text-center">
                                <td class="fontSize15">{{$index}}</td>
                                <td class="fontSize15">
                                    {{ $book['bookedName'] }} 
                                </td>
                                <td class="fontSize15"> 
                                    @if($expired == 1)
                                        <h5><span class="badge badge-danger">Expired</span></h5>
                                    @elseif($book['status'] == 'completed')
                                        <h5><span class="badge badge-secondary">Completed</span></h5>
                                    @elseif($book['status'] == 'cancelled')
                                        <h5><span class="badge badge-danger">Cancelled</span></h5>
                                    @elseif($book['status'] == 'paid')
                                        <h5><span class="badge badge-success">Paid</span></h5>
                                    @elseif($book['status'] == 'started')
                                        <h5><span class="badge badge-warning">Started</span></h5>
                                    @elseif($book['status'] == 'accepted')
                                        <h5><span class="badge badge-success">Accepted</span></h5>
                                    @elseif($book['status'] == 'refunded')
                                        <h5><span class="badge badge-danger">Refunded</span></h5>
                                    @elseif($book['status'] == 'requested')
                                        <h5><span class="badge badge-primary">Requested</span></h5>
                                    @endif
                                </td>
                                <td class="fontSize15">
                                    @foreach($users as $user)
                                        @if($user->_id == $book['userId'])
                                            {{ $user->name}}
                                        @endif
                                    @endforeach
                                </td>
                                <td class="fontSize15">
                                    <a href="{{ route('needs.show', ['id' => $book['_id'] ]) }}" style="cursor: pointer;"  >
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="{{trans('messages.Show')}}"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    @if($book['needStatus'] == 1)
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$book['_id']}}">
                                            <i class="fa fa-lock" title="{{trans('messages.Disable')}}"></i>
                                        </button>
                                    @else 
                                            <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-{{$book['_id']}}">
                                                <i class="fa fa-unlock" title="{{trans('messages.Enable')}}"></i>
                                            </button>
                                        </a>
                                    @endif
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
        <div class="pagination-wrapper"> {!! $pagination->render() !!} </div>
    </div>
     <!-- Modal -->
    @foreach($userNeeds as $user)
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
                        @if($user['needStatus'] == 0)
                             {{__('messages.Do you want to enable this Job?')}}
                        @else
                            {{__('messages.Do you want to disable this Job?')}} 
                        @endif
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        @if($user['needStatus'] == 0)
                            <a href="{{route('needs.changeStatus', ['id' => $user['_id'], 'needStatus' => 1 ]) }}" style="cursor: pointer;" >
                                <button type="button" class="btn btn-success">{{__('messages.Enable')}}</button>
                            </a>
                        @else
                            <a href="{{ route('needs.changeStatus', ['id' =>  $user['_id'], 'needStatus' => 0 ]) }}" style="cursor: pointer;" >
                                <button type="button" class="btn btn-danger">{{__('messages.Disable')}}</button>
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endforeach
    <script>
        $(document).ready(function () {
            $("#status-selector").change(function(){
                this.form.submit();
            });
        });
    </script>
@endsection