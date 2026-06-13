<?php $__env->startSection('title', 'Email Settings'); ?>
<?php $__env->startSection('content'); ?>
<div class="content-page">
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('email.store')); ?>" method="post" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Email Settings - SMTP Settings')); ?></h4>
        <div class="form-group">
            <label><?php echo e(__('messages.SMTP Port')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="smtpPort"  placeholder="<?php echo e(__('messages.SMTP Port')); ?>" value="<?php echo e($sitesettings->smtpPort); ?>" required>
            <?php if($errors->has('port')): ?><p class="text-danger"><?php echo e($errors->first('port')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.SMTP Host')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="smtpHost"  placeholder="<?php echo e(__('messages.SMTP Host')); ?>" value="<?php echo e($sitesettings->smtpHost); ?>" required>
            <?php if($errors->has('host')): ?><p class="text-danger"><?php echo e($errors->first('host')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.SMTP Email')); ?> </label> <span class="text-danger">*</span>  
            <input type="email" class="form-control" name="smtpEmail"  placeholder="<?php echo e(__('messages.SMTP Email')); ?>" value="<?php echo e($sitesettings->smtpEmail); ?>" required>
            <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group" id="password">
            <label><?php echo e(__('messages.Password')); ?> </label> <span class="text-danger">*</span> <span toggle="#password-field" style="display:none;" class="fa fa-fw fa-eye field_icon toggle-password"></span>
            <input type="password" name="smtpPassword" placeholder="<?php echo e(__('Password')); ?>" value="<?php echo e($sitesettings->smtpPassword); ?>"  class="form-control input-lg pass_log_id" required>
            <?php if($errors->has('password')): ?><p class="text-danger"><?php echo e($errors->first('password')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.SMTP SSL')); ?></label>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="enable" name="smtpStatus" value="1"  <?php if($sitesettings->smtpStatus == 1 || $sitesettings->smtpStatus == "" ): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="enable"><?php echo e(__('messages.Enable')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="disable" name="smtpStatus" value="0"  <?php if($sitesettings->smtpStatus == 0): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="disable"><?php echo e(__('messages.Disable')); ?></label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/emails/create.blade.php ENDPATH**/ ?>