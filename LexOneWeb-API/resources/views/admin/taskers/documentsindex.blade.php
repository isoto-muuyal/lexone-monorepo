@extends('admin.layouts.sidebar')
@section('title', 'Tasker Documents')
@section('content')
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
        <div>
            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                {{__('messages.Tasker')}} {{__('messages.Documents')}}
            </h4>
        </div>
    </div>
    <table id="example" class="table table-striped table-bordered mytable">
        <tbody>
            <tr>
                <th scope="col">
                    {{__('messages.Tasker')}} {{__('messages.Name')}}
                </th>
                <td class="fontSize15">
                    {{$tasker->name}}
                </td>
            </tr>
            <tr>
                <th scope="col">
                    {{__('messages.Status')}}
                </th>
                <td class="fontSize15">
                    @if($tasker->verified == 0)
                    {{__('messages.Pending')}}
                    @elseif($tasker->verified == 1)
                    {{__('messages.Approved')}}
                    @endif
                </td>
            </tr>
            <tr>
                <th scope="col">
                    {{__('messages.Documents')}}
                </th>
                <td class="fontSize15">
                    @forelse ($documents as $document)
                    {{$document->media_name}}
                    <a href="{{ url('/media/documents/'.$document->media_name)}}" target="_blank"> 
                        <i class="fa fa-eye ml-1" aria-hidden="true"></i>
                    </a>
                    <br>
                    @empty
                    <p>{{__('messages.No')}} {{__('messages.Documents')}}</p>
                    @endforelse
                </td>
            </tr>
        </tbody>
    </table>
    @if($tasker->verified == 0)
    <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
        <i class="fa fa-check" title="{{__('messages.Add')}}"></i> 
        {{__('messages.Approve')}} {{__('messages.Tasker')}}
    </button>
    @elseif($tasker->verified == 1)
    <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
        <i class="fa fa-ban" title="{{__('messages.Add')}}"></i> 
        {{__('messages.Unapprove')}} {{__('messages.Tasker')}}
    </button>
    @endif
</div>
</div>

<!-- Modal -->
<div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">{{__('messages.Are You Sure')}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                @if($tasker->verified == 0)
                    {{__('messages.Do you want to approve this tasker booking activity?')}}<br><br>
                    <h6>Note: Please verify the tasker certificate and details to approve the tasker booking activity.</h6>
                @elseif($tasker->verified == 1)
                    {{__('messages.Do you want to disable this tasker booking  activity?')}}<br><br> 
                    <h6>Note: Once disabled tasker can’t able to do bookings.</h6>
                @endif
            </div>
            <div class="modal-footer">
                @if($tasker->verified == 0)
                <a href="{{ route('tasker.pendingStatus', ['id' => $tasker['userId'], 'taskerStatus' =>1 ]) }}" >
                    <button class="btn btn-success align-text-top border-0">
                        <i class="fa fa-check" title="{{__('messages.Add')}}"></i> 
                        {{__('messages.Approve')}} {{__('messages.Tasker')}}
                    </button>
                </a>
                @elseif($tasker->verified == 1)
                <a href="{{ route('tasker.pendingStatus', ['id' => $tasker['userId'], 'taskerStatus' =>0 ]) }}" >
                    <button class="btn btn-danger align-text-top border-0">
                        <i class="fa fa-ban" title="{{__('messages.Add')}}"></i> 
                        {{__('messages.Unapprove')}} {{__('messages.Tasker')}}
                    </button>
                </a>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection