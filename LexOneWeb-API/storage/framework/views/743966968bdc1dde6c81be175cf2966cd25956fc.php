<?php $__env->startSection('title', 'Social link Settings'); ?>
<?php $__env->startSection('content'); ?>
        <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('social-link.store')); ?>" method="post" enctype="multipart/form-data">
            <?php echo csrf_field(); ?>
            <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Social Link')); ?> <?php echo e(__('messages.Settings')); ?></h4>
            <div class="form-group">
                <label><?php echo e(__('messages.Facbook Link')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="fbLink" value="<?php echo e($sitesettings->fbLink); ?>"  placeholder="<?php echo e(__('messages.Facbook Link')); ?>" required>
                </div>		
            </div>
            <div class="form-group">
                <label><?php echo e(__('messages.Twitter Link')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="twitterLink" value="<?php echo e($sitesettings->twitterLink); ?>"  placeholder="<?php echo e(__('messages.Twitter Link')); ?>" required>
                </div>		
            </div>
            <div class="form-group">
                <label><?php echo e(__('messages.Instagram Link')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="instagramLink" value="<?php echo e($sitesettings->instagramLink); ?>"  placeholder="<?php echo e(__('messages.Instagram Link')); ?>" required>
                </div>		
            </div>
            <div class="form-group">
                <label><?php echo e(__('messages.Invite Link')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <input type="url" class="form-control"  name="inviteLink" value="<?php echo e($sitesettings->inviteLink); ?>"  placeholder="<?php echo e(__('messages.Invite Link')); ?>" required>
                </div>		
            </div>
            <div class="m-t20">
                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
            </div>
        </form>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/sociallinks/create.blade.php ENDPATH**/ ?>