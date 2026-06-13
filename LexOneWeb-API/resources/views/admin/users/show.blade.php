@extends('admin.layouts.sidebar')
@section('title', 'User Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    {{$user->name}}
                    @if($user->onlineStatus == 0)
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
                    <tr>
                        <th scope="col">{{__('messages.Image')}}</th>
                        <td class="fontSize15">
                            @if($user->image)
                                <img src="{{url('/media/users/'.$user->image)}}" style="height:80px;">
                            @else
                                <img src="{{url('/media/users/user.png')}}" style="height:80px;">
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Email')}}</th>
                        <td class="fontSize15">
                            {{$user['email']}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Joined Date')}}</th>
                        <td class="fontSize15">
                                {{$userJoined}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Device Platform')}}</th>
                        <td class="fontSize15">
                                {{$user->devicePlatform}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Bookings')}}</th>
                        <td class="fontSize15">
                                {{$bookingCount}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Posted Jobs')}}</th>
                        <td class="fontSize15">
                                {{$userJobs}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script>
        var lastActive = <?php echo json_encode($lastActive); ?>;
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var localtime = d.setUTCSeconds(lastActive);
        document.getElementById("myText").innerHTML = localtime;
    </script>

@endsection