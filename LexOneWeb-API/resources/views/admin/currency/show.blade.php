@extends('admin.layouts.sidebar')
@section('title', 'Service Detail')
@section('content')
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">Currency details</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    
                    {{-- <tr>
                        <th scope="col">country code</th>
                        <td class="fontSize15">{{$currencydetail->countrycode}}</td>
                    </tr> --}}
                    <tr>
                        <th scope="col">currency code</th>
                        <td class="fontSize15">{{$currencydetail->currencycode}}</td>
                    </tr>
                    <tr>
                        <th scope="col">Currency symbol</th>
                        <td class="fontSize15">{{$currencydetail->currencysymbol}}</td>
                    </tr>
                    {{-- <tr>
                        <th scope="col">Country name</th>
                        <td class="fontSize15">{{$currencydetail->countryname}}</td>
                    </tr> --}}
                    <tr>
                        <th scope="col">Price</th>
                        <td class="fontSize15">{{$currencydetail->price}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
@endsection