<?php $__env->startSection('title', 'Payment Settings'); ?>
<?php $__env->startSection('content'); ?>
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('payment.store')); ?>" method="post" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Stripe Payment Gateway - Configuration and Settings')); ?></h4>
        <div class="form-group">
            <label>Stripe Type</label><span class="text-danger">*</span>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="Live" name="payment_type" value="live" <?php if($sitesettings->paymentType == 'live'): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="Live"><?php echo e(__('messages.Live')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="Sandbox" name="payment_type" value="sandbox" <?php if($sitesettings->paymentType == 'sandbox'): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="Sandbox"><?php echo e(__('messages.Sandbox')); ?></label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Stripe Public Key')); ?></label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a>
            <span class="text-danger"> *</span>
            <div class="form-group field-public_key">
                <input type="text" id="public_key" class="form-control" name="stripePublicKey" value="<?php echo e($sitesettings->stripePublicKey); ?>" required>
            </div>
            <p class="text-danger" id="Sitesettings_stripePublicKey_em_"></p>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Stripe Private Id')); ?></label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a> <span class="text-danger"> *</span>
            <div class="form-group field-Private_id">
                <input type="text" id="Private_id" class="form-control" name="stripePrivateKey" value="<?php echo e($sitesettings->stripePrivateKey); ?>" placeholder="<?php echo e(__('messages.Stripe Private Id')); ?>" required>
            </div>
        </div>

        <div class="form-group">
            <label><?php echo e(__('messages.Stripe Client Id')); ?></label>
            <a href="https://stripe.com/docs/keys" target="blank">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a> <span class="text-danger"> *</span>
            <div class="form-group field-Private_id">
                <input type="text" id="Private_id" class="form-control" name="stripeClientId" value="<?php echo e($sitesettings->stripeClientId); ?>" placeholder="<?php echo e(__('messages.Stripe Client Id')); ?>" required>
            </div>
        </div>


        <div class="form-group">
            <div >
                <h5>Add Card Details to tasker Pay</h5>
            </div>
            <label class=" control-label">Card Number</label>
            <div class="addCard">
                <input type="text" class="form-control" id="stripe_card" name="stripe_card" value="<?php echo e($card_data['stripe_card']); ?>" maxlength="16" placeholder="4242424242424242">
            </div>
            <div class="stripe_card_keyerrcls errorcls"></div>
        </div>

        <div class="form-group">
            <label class=" control-label">Card Expiry</label>
            <div class="cardExpiry">
                <input type="number" class="form-control" id="stripe_month" name="stripe_month" min="1" max="12" value="<?php echo e($card_data['stripe_month']); ?>" maxlength="2" placeholder="1 - 12">
            </div>
            <div class="">
                <input type="text" class="form-control" id="stripe_year" name="stripe_year" value="<?php echo e($card_data['stripe_year']); ?>" maxlength="4" placeholder="">
            </div>
            <div class="stripe_expiry_keyerrcls errorcls"></div>
        </div>

        <div class="form-group">
            <label class=" control-label">Card CVC</label>
            <div class="">
                <input type="text" class="form-control" id="stripe_cvc" name="stripe_cvc" value="<?php echo e($card_data['stripe_cvc']); ?>" maxlength="4" placeholder="314">
            </div>
            <div class="stripe_cvc_keyerrcls errorcls"></div>
        </div>

        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>
        </div>
    </form>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/payment/create.blade.php ENDPATH**/ ?>