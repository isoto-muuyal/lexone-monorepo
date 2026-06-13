<?php $__env->startSection('title', 'Profile'); ?>
<?php $__env->startSection('content'); ?>
<form action="<?php echo e(route('appupdate.store')); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.App Update Management')); ?> <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#exampleModalCenter"></i> </h4>
            </div>
            <div class="">
                <div class=" align-self-center">
                    <h6 class="p-t10">App update</h6>
                    <div class="custom-control custom-switch">
                        <input type="checkbox" name="status" class="custom-control-input" id="customSwitch1" <?php if($sitesettings->status == "true"): ?>checked <?php endif; ?>>
                        <label class="custom-control-label" for="customSwitch1"></label>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label><?php echo e(trans('messages.Android Version')); ?> </label> <span class="text-danger">*</span>  
            <input type="number" class="form-control" name="androidVersion" min="1" max="999999"  maxlength="6" value="<?php echo e($sitesettings->androidVersion); ?>" placeholder="<?php echo e(trans('messages.Android Version')); ?>"  required>
            <?php if($errors->has('androidVersion')): ?><p class="text-danger"><?php echo e($errors->first('androidVersion')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Update Type')); ?></label><span class="text-danger">*</span>  
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="true" name="androidForceUpdate" value="true" <?php if($sitesettings->androidForceUpdate == "true"): ?> checked <?php endif; ?> >
                        <label class="custom-control-label" for="true"><?php echo e(__('messages.Force Update')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="false" name="androidForceUpdate" value="false" <?php if($sitesettings->androidForceUpdate == "false"): ?> checked <?php endif; ?> >
                    <label class="custom-control-label" for="false"><?php echo e(__('messages.Normal Update')); ?></label>
                </div>
            </div>
        </div>
        <br>
        <hr style="border-top: 2px solid rgba(122, 176, 221, 0.952)">
        <br>
        <div class="form-group">
            <label><?php echo e(trans('messages.IOS Version')); ?> </label> <span class="text-danger">*</span>  
            <input type="number" class="form-control" name="iosVersion" min="1" max="999999"  step=".01" maxlength="6" value="<?php echo e($sitesettings->iosVersion); ?>" placeholder="<?php echo e(trans('messages.Ios Version')); ?>"  required>
            <?php if($errors->has('iosVersion')): ?><p class="text-danger"><?php echo e($errors->first('iosVersion')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Update Type')); ?></label><span class="text-danger">*</span>  
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="iosforce" name="iosForceUpdate" value="true" <?php if($sitesettings->iosForceUpdate == "true"): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="iosforce"><?php echo e(__('messages.Force Update')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="iosnormal" name="iosForceUpdate" value="false" <?php if($sitesettings->iosForceUpdate == "false"): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="iosnormal"><?php echo e(__('messages.Normal Update')); ?></label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
        </div>
    </div>
</form>
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">App Update</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                Enable this settings to intimate the user to update the app.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/app/forceupdate.blade.php ENDPATH**/ ?>