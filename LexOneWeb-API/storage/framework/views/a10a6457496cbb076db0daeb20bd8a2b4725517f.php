<?php $__env->startSection('title', 'Notification Settings'); ?>
<?php $__env->startSection('content'); ?>
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('notification.store')); ?>" method="post" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Notification Management')); ?></h4>
        <div class="form-group">
            <label><?php echo e(__('messages.API Key for Push notification')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="pushNotification"   value="<?php echo e($sitesettings->pushNotification); ?>"  required>
            <?php if($errors->has('pushNotification')): ?><p class="text-danger"><?php echo e($errors->first('pushNotification')); ?></p><?php endif; ?>
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/notification/create.blade.php ENDPATH**/ ?>