@extends('admin.layouts.sidebar')
@section('title', 'Currency Edit')
@section('content')

<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="{{ route('currency.setdefaultcurrency') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="hidden" id="ajax_url" url="{{route('currency.ajaxcurrencyRate')}}" required/>
    <h4 class="blueTxtClr p-t10 p-b10">{{trans('messages.Default')}} Currency</h4>

    <div class="form-group">
        <label>Currency details </label> <span class="text-danger">*</span>
        <select name="currency_code" class="form-control" id="currency-currencydetails" onchange="updateCurrencyCode();">
            @foreach($currencyrecords as $key=>$currency)
                <?php
                // echo '<pre>'; print_r($currencyrecords); die;
                     if(isset($currency['defaultcurrency']) && $currency['defaultcurrency'] == '1'){
                        $options = "selected";
                    }else{
                        $options = "";
                    } 
                ?>
            <option value="{{$currency['currencycode']}}" <?= $options; ?> >{{$currency['currencycode']}}</option>
            @endforeach
        </select>
    </div>

    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10">{{trans('messages.Update')}}</button>
    </div>

</form>
@endsection