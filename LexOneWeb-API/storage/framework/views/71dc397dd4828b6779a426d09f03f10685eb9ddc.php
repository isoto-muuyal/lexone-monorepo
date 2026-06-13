<?php $__env->startSection('title', 'Currency Edit'); ?>
<?php $__env->startSection('content'); ?>

<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('currency.update',['currencyId' => $currencydetails->_id])); ?>" method="POST" enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <input type="hidden" id="ajax_url" url="<?php echo e(route('currency.ajaxcurrencyRate')); ?>" required/>
    <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Edit')); ?> Currency</h4>

    <div class="form-group">
        <label>Currency details </label> <span class="text-danger">*</span>
        <select name="currency_code" class="form-control" id="currency-currencydetails" onchange="updateCurrencyCode();">
            <?php $__currentLoopData = $currencylist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key=>$currency): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php
                    if($currencydetails->currencycode == $currency){
                        $options = 'selected="selected"';
                    }else{
                        $options = '';
                    }
                ?>
            <option value="<?php echo e($key); ?>" <?= $options; ?> ><?php echo e($currency); ?></option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </select>
    </div>

    <div class="form-group">
        <label>Currency code</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencycode" name="currencycode" placeholder="" value="<?php echo e($currencydetails->currencycode); ?>" readonly>
        <?php $__errorArgs = ['currencycode'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <p class="text-danger"><?php echo e($message); ?></p>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
    </div>
    
    <div class="form-group">
        <label>Currency symbol</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencysymbol" name="currencysymbol" placeholder="" value="<?php echo e($currencydetails->currencysymbol); ?>" readonly>
        <?php $__errorArgs = ['currencysymbol'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <p class="text-danger"><?php echo e($message); ?></p>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
    </div>

    <div class="form-group">
        <label>Currency name</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-currencyname" name="currencyname" placeholder="" value="<?php echo e($currencydetails->currencyname); ?>" readonly>
        <?php $__errorArgs = ['currencyname'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <p class="text-danger"><?php echo e($message); ?></p>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
    </div>

    <div class="form-group">
        <label>Currency Rate</label> <span class="text-danger">*</span>
        <input type="text" class="form-control" id="currency-price" name="price" placeholder="" value="<?php echo e($currencydetails->price); ?>" readonly>
        <?php $__errorArgs = ['price'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
        <p class="text-danger"><?php echo e($message); ?></p>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
    </div>

    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Update')); ?></button>
    </div>

</form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/currency/edit.blade.php ENDPATH**/ ?>