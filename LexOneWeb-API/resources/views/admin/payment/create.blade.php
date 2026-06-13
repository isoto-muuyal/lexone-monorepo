@extends('admin.layouts.sidebar')
@section('title', 'Payment Settings')
@section('content')
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="{{ route('payment.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <h4 class="m-b25  blueTxtClr p-t10 p-b10">{{__('messages.Stripe Payment Gateway - Configuration and Settings')}}</h4>
        <div class="form-group">
            <label>Stripe Type</label><span class="text-danger">*</span>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="Live" name="payment_type" value="live" @if($sitesettings->paymentType == 'live') checked @endif>
                        <label class="custom-control-label" for="Live">{{__('messages.Live')}}</label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="Sandbox" name="payment_type" value="sandbox" @if($sitesettings->paymentType == 'sandbox') checked @endif>
                    <label class="custom-control-label" for="Sandbox">{{__('messages.Sandbox')}}</label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>{{__('messages.Stripe Public Key')}}</label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a>
            <span class="text-danger"> *</span>
            <div class="form-group field-public_key">
                <input type="text" id="public_key" class="form-control" name="stripePublicKey" value="{{$sitesettings->stripePublicKey}}" required>
            </div>
            <p class="text-danger" id="Sitesettings_stripePublicKey_em_"></p>
        </div>
        <div class="form-group">
            <label>{{__('messages.Stripe Private Id')}}</label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a> <span class="text-danger"> *</span>
            <div class="form-group field-Private_id">
                <input type="text" id="Private_id" class="form-control" name="stripePrivateKey" value="{{$sitesettings->stripePrivateKey}}" placeholder="{{__('messages.Stripe Private Id')}}" required>
            </div>
        </div>

        <div class="form-group">
            <label>{{__('messages.Stripe Client Id')}}</label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a> <span class="text-danger"> *</span>
            <div class="form-group field-Private_id">
                <input type="text" id="Private_id" class="form-control" name="stripeClientId" value="{{$sitesettings->stripeClientId}}" placeholder="{{__('messages.Stripe Client Id')}}" required>
            </div>
        </div>


        <div class="form-group">
            <div >
                <h5>Add Card Details to tasker Pay</h5>
            </div>
            <label class=" control-label">Card Number</label>
            <div class="addCard">
                <input type="text" class="form-control" id="stripe_card" name="stripe_card" value="{{$card_data['stripe_card']}}" maxlength="16" placeholder="4242424242424242">
            </div>
            <div class="stripe_card_keyerrcls errorcls"></div>
        </div>

        <div class="form-group">
            <label class=" control-label">Card Expiry</label>
            <div class="cardExpiry">
                <input type="number" class="form-control" id="stripe_month" name="stripe_month" min="1" max="12" value="{{$card_data['stripe_month']}}" maxlength="2" placeholder="1 - 12">
            </div>
            <div class="">
                <input type="text" class="form-control" id="stripe_year" name="stripe_year" value="{{$card_data['stripe_year']}}" maxlength="4" placeholder="">
            </div>
            <div class="stripe_expiry_keyerrcls errorcls"></div>
        </div>

        <div class="form-group">
            <label class=" control-label">Card CVC</label>
            <div class="">
                <input type="text" class="form-control" id="stripe_cvc" name="stripe_cvc" value="{{$card_data['stripe_cvc']}}" maxlength="4" placeholder="314">
            </div>
            <div class="stripe_cvc_keyerrcls errorcls"></div>
        </div>

        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>
        </div>
    </form>
</div>
@endsection