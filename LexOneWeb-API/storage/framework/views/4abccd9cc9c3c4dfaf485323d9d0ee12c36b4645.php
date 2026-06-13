<?php $__env->startSection('title', 'Banner Create'); ?>
<?php $__env->startSection('content'); ?>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('bannerimage.store')); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Add')); ?> <?php echo e(trans('messages.Banner')); ?></h4>
        <div class="form-group">
            <label><?php echo e(trans('messages.image_url')); ?> </label> <span class="text-danger">*</span>  
            <input type="text"  class="form-control" name="banner_image_url" placeholder="<?php echo e(trans('messages.image_url')); ?>" value="<?php echo e(old('banner_image_url')); ?>" required>
            <?php if($errors->has('banner_image_url')): ?><p class="text-danger"><?php echo e($errors->first('banner_image_url')); ?></p><?php endif; ?>
        </div>
        <div class="m-b20">
            <div class="profile picture">
                <label><?php echo e(trans('messages.Image')); ?> (1024 * 500)</label> <span class="text-danger">*</span>
                <input type="file" accept="image/image/gif,image/jpeg"  id="wizard-picture" name="banner_image" class="m-b15 p-2 borderGrey w-100 image"   required><br>
                <img src="" class="borderCurve borderGradient picture-src dnone" id="wizardPicturePreview"
                style="width:100px;height:100px;object-fit: cover;">
            </div>
            <?php if($errors->has('banner_image')): ?><p class="text-danger"><?php echo e($errors->first('banner_image')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(trans('messages.Status')); ?></label>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="enable" name="banner_status" value="1" checked>
                        <label class="custom-control-label" for="enable"><?php echo e(trans('messages.Enable')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="disable" name="banner_status" value="0">
                    <label class="custom-control-label" for="disable"><?php echo e(trans('messages.Disable')); ?></label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Save')); ?></button> 
        </div>
    </form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/bannerimage/create.blade.php ENDPATH**/ ?>