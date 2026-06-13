@extends('admin.layouts.sidebar')
@section('title', 'Role Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Role')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <td class="fontSize15">
                                {{$role->name}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.description')}}</th>
                        <td class="fontSize15">
                                {{$role->description}}
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Permissions')}}</th>
                        <td class="fontSize15">
                        @forelse($permission as $permission)
                                {{ucwords($permission['name'])}}<br>
                        @empty
                            {{__('messages.No')}} {{__('messages.Permissions')}}
                        @endforelse
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection