@extends('admin.layouts.sidebar')
@section('title', 'Currency Add')
@section('content')

<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('currency.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="hidden" id="ajax_url" url="{{route('currency.ajaxcurrencyRate')}}" required/>
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Add')}} Currency</h4>

    <div class="form-group">
        <label>Currency details </label> <span class="text-danger">*</span>
        <select name="currency_details" class="form-control" id="currency-currencydetails" onchange="updateCurrencyCode();">
            @foreach($currencylist as $key=>$currency)
            <option value="{{$key}}">{{$currency}}</option>
            @endforeach
        </select>
    </div>

    <div class="form-group">
        <label>Currency code</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencycode" name="currencycode" placeholder="" value="" >
        @error('currencycode')
        <p class="text-danger">{{ $message }}</p>
        @enderror
    </div>
    
    <div class="form-group">
        <label>Currency symbol</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencysymbol" name="currencysymbol" placeholder="" value="">
        @error('currencysymbol')
        <p class="text-danger">{{ $message }}</p>
        @enderror
    </div>

    <div class="form-group">
        <label>Currency name</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencyname" name="currencyname" placeholder="" value="">
        @error('currencyname')
        <p class="text-danger">{{ $message }}</p>
        @enderror
    </div>

    <div class="form-group">
        <label>Currency Rate</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-price" name="price" placeholder="" value="">
        @error('price')
        <p class="text-danger">{{ $message }}</p>
        @enderror
    </div>

    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Add')}}</button>
    </div>

</form>
@endsection