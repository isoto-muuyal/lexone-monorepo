<?php $__env->startSection('title', 'User Edit'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="<?php echo e(route('user.update', $user->id)); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <?php echo method_field('patch'); ?>
    <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Edit')); ?> <?php echo e(trans('messages.User')); ?></h4>
    <div class="form-group">
        <label><?php echo e(trans('messages.Name')); ?> </label> <span class="text-danger">*</span>  
        <input type="text" name="name" value="<?php echo e($user->name); ?>" class="form-control input-lg" required />
        <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Email')); ?> </label> <span class="text-danger">*</span>  
        <input type="text" name="email" value="<?php echo e($user['email']); ?>" class="form-control input-lg" required/>
        <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Mobile')); ?> </label> <span class="text-danger">*</span>  
        <input type="text" name="mobile" value="<?php echo e($user['mobile']); ?>" class="form-control input-lg" required/>
        <?php if($errors->has('mobile')): ?><p class="text-danger"><?php echo e($errors->first('mobile')); ?></p><?php endif; ?>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Update')); ?></button> 
    </div>
</form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/users/edit.blade.php ENDPATH**/ ?>