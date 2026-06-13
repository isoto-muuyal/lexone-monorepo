<?php $__env->startSection('title', 'Adsense Settings'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('adsense.store')); ?>" method="post" enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Adsense')); ?> <?php echo e(__('messages.Settings')); ?></h4>
    <div class="form-group">
        <label><?php echo e(__('messages.Google AD Client')); ?></label><span class="text-danger">*</span>  
        <div class="form-group field-public_key">
            <input type="text" class="form-control"  name="googleadclient" value="<?php echo e($sitesettings->googleadclient); ?>"  placeholder="<?php echo e(__('messages.Google AD Client')); ?>" required>
        </div>		
    </div>
    <div class="form-group">
        <label><?php echo e(__('messages.Google AD Slot')); ?></label><span class="text-danger">*</span>  
        <div class="form-group field-public_key">
            <input type="text" class="form-control"  name="googleadslot" value="<?php echo e($sitesettings->googleadslot); ?>"  placeholder="<?php echo e(__('messages.Google AD Slot')); ?>" required>
        </div>		
    </div>
    <div class="m-t20">
        <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
    </div>
</form>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/adsense/create.blade.php ENDPATH**/ ?>