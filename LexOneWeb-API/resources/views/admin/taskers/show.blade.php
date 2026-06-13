@extends('admin.layouts.sidebar')
@section('title', 'User Detail')
@section('content')
    <script src="{{ URL::asset('public/admin_assets/js/ckeditor.js') }}"></script>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    {{$tasker->name}}
                    @if($tasker->rating)
                        <a href="{{ route('review.index', ['taskerid' => $tasker['_id']]) }}" style="font-size:14px;">
                            ({{$tasker->rating}} <i class="fa fa-star" aria-hidden="true"></i>)
                        </a>
                    @else
                        ({{__('messages.No Rating')}})
                    @endif
                    @if($tasker->onlineStatus == 0)
                        <p style="font-size:14px;"><i class="fa fa-circle" aria-hidden="true" style="color:#808080;font-size:14px;"></i> {{__('messages.Last seen')}} : {{$lastActive}}</p>
                    @else
                        <p style="font-size:14px;"><i class="fa fa-circle"  aria-hidden="true" style="color:#008000;font-size:14px;"></i>{{__('messages.Online')}}</p>
                    @endif
                </h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    @if(!empty($tasker->about))
                        <tr>
                            <th scope="col">
                                {{__('messages.About')}}
                            </th>
                            <td class="fontSize15">
                                {{$tasker->about}}
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <th scope="col">
                            {{__('messages.Image')}}
                        </th>
                        @if(!empty($tasker->image))
                            <td class="fontSize15">
                                <img src="{{url('/media/taskers/'.$tasker->image)}}" style="height:80px;">
                            </td>
                        @else
                            <td class="fontSize15">
                                <p>Image Unavailable</p>
                            </td>
                        @endif
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Email')}}
                        </th>
                        <td class="fontSize15">
                            {{$tasker->email}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Location')}}
                        </th>
                        @if($tasker->location)
                            <td class="fontSize15">
                                {{$tasker->location}}
                            </td>
                        @else
                            <td class="fontSize15">
                                {{__('messages.No Location')}}
                            </td>
                        @endif
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Mobile')}}
                        </th>
                        <td class="fontSize15">
                            {{$tasker->mobile}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Status')}}
                        </th>
                        <td class="fontSize15">
                            @if($tasker->status == 0 )
                                {{__('messages.Disabled')}}
                            @else
                                {{__('messages.Enabled')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Verification Status')}}
                        </th>
                        <td class="fontSize15">
                            @if($tasker->verified == 0 )
                                {{__('messages.Unverified')}}
                            @else
                                {{__('messages.Verified')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Portfolio')}}
                        </th>
                        <td class="fontSize15">
                            @forelse($documents as $document)
                                <a href=# data-toggle="modal" data-target="#exampleModal{{$document->id}}"> 
                                    <img src="{{url('/media/portfolio/'.$document->media_name)}}" style="height:40px;width:40px;">
                                </a>
                            @empty
                                {{__('messages.No Portfolio')}}
                            @endforelse
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Tasks Completed')}}
                        </th>
                        <td class="fontSize15">
                           {{ $totalJobs }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            {{__('messages.Earnings')}}
                        </th>
                        <td class="fontSize15">
                            {{$currencySymbol}} {{$revenue}}
                        </td>
                    </tr>
                    @if($reward)
                        <tr>
                            <th scope="col">
                                {{__('messages.Rewards')}}
                            </th>
                            <td class="fontSize15">
                                {{$currencySymbol}} {{$reward}}
                            </td>
                        </tr>
                    @endif
                </tbody>
                @if($services != null)
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                {{__('messages.Tasker')}} {{__('messages.Service')}}
                            </h4>
                        </div>
                        <thead>
                            <tr>
                                <th scope="col">{{__('messages.S.No')}}</th>
                                <th class="nosorting">{{__('messages.Service')}}</th>
                                <th class="nosorting">{{__('messages.Price')}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @php $index =1; @endphp
                            @if(!empty($pricings))
                                @foreach($pricings as $pricing)
                                    <tr>
                                        <td class="fontSize15">{{$index}}</td>
                                        <td class="fontSize15">
                                            @foreach($services as $service)
                                                @if($service->_id == $pricing['serviceId'])
                                                <a href="{{ route('service.show', ['serviceId' => $service['_id']]) }}" style="cursor: pointer;">
                                                    {{$service->name}}
                                                </a>
                                                @endif
                                            @endforeach
                                        </td>
                                        <td class="fontSize15">{{$currencySymbol}} {{$pricing['price']}}</td>
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
                @endif
            </table>
        </div>
    </div>
    @foreach ($documents as $document) 
        <div class="modal fade" id="exampleModal{{$document->id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">              
                    <div class="modal-body">
                        <p>{{$document->media_name}}</p>
                        <img src="{{url('/media/portfolio/'.$document->media_name)}}" class="imagepreview img-responsive center-block" style="width:100%; position:center;" >
                    </div>
                </div>
            </div>
        </div>  
    @endforeach
   
    <script>
        var lastActive = <?php echo json_encode($lastActive); ?>;
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var localtime = d.setUTCSeconds(lastActive);
        document.getElementById("myText").innerHTML = localtime;
    </script>
@endsection