<?php $__env->startSection('title', 'Banner Edit'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="<?php echo e(route('bannerimage.update', $data->id)); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <?php echo method_field('patch'); ?>
    <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Edit')); ?> <?php echo e(trans('messages.Banner')); ?></h4>
    <div class="form-group">
        <label><?php echo e(trans('messages.image_url')); ?> </label> <span class="text-danger">*</span>  
        <input type="text" name="banner_image_url" value="<?php echo e($data->url); ?>" class="form-control input-lg" required/>
        <?php if($errors->has('banner_image_url')): ?><p class="text-danger"><?php echo e($errors->first('banner_image_url')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <div class="m-b20">
        <div class="profile picture">
            <label><?php echo e(trans('messages.Image')); ?> (1024 * 500)</label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="banner_image" class="m-b15 p-2 borderGrey w-100"><br>
            <img src="<?php echo e(url('/media/bannerimages/'.$data->image)); ?>" class="img-thumbnail" id="wizardPicturePreview" 
            style="width:100px;height:100px;object-fit: cover;">
        </div>
        <?php if($errors->has('banner_image')): ?><p class="text-danger"><?php echo e($errors->first('banner_image')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Status')); ?></label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="banner_status" value="1" <?php if($data->status == 1): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="enable"><?php echo e(trans('messages.Enable')); ?></label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="banner_status" value="0" <?php if($data->status == 0): ?> checked <?php endif; ?>>
                <label class="custom-control-label" for="disable"><?php echo e(trans('messages.Disable')); ?></label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Update')); ?></button> 
    </div>
</form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/bannerimage/edit.blade.php ENDPATH**/ ?>