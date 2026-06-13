@extends('admin.layouts.sidebar')
@section('title', 'Category Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">{{__('messages.Category')}} {{__('messages.Detail')}}</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">{{__('messages.Name')}}</th>
                        <td class="fontSize15">{{$categorydetail->name}}</td>
                    </tr>
                    @if ($categorydetail->arabicName)
                        <tr>
                            <th scope="col">{{__('messages.اسم')}}</th>
                            <td class="fontSize15">{{$categorydetail->arabicName}}</td>
                        </tr>
                    @endif
                    @if ($categorydetail->frenchName)
                    <tr>
                        <th scope="col">{{__('messages.Nom')}}</th>
                        <td class="fontSize15">{{$categorydetail->frenchName}}</td>
                    </tr>
                    @endif
                    
                    <tr>
                        <th scope="col">{{__('messages.Image')}}</th>
                            <td class="fontSize15">
                                <img src="{{url('/media/categories/'.$categorydetail->image)}}"  style="height:80px;">
                            </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Type')}}</th>
                        <td class="fontSize15">{{$categorydetail->type}}</td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Status')}}</th>
                        <td class="fontSize15">
                            @if($categorydetail->status == 0 )
                                {{__('messages.Disabled')}}
                            @else
                                {{__('messages.Enabled')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Featured')}}</th>
                        <td class="fontSize15">
                            @if($categorydetail->featured == 1 )
                                {{__('messages.Enabled')}}
                            @else
                                {{__('messages.Disabled')}}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">{{__('messages.Subcategories')}}</th>
                        <td class="fontSize15">
                            @forelse ($subcategorydetails as $eachcategory)
                                    <a href="{{ route('subcategory.show', ['subcategoryId' => $eachcategory['_id']]) }}" style="cursor: pointer;">
                                        {{ $eachcategory->name }}
                                    </a><br>
                            @empty 
                                {{__('messages.No Subcategories')}}
                            @endforelse
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection