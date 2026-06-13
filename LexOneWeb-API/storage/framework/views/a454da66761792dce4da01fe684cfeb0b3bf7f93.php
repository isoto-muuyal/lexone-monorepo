<?php $__env->startSection('title', 'Site Settings'); ?>
<?php $__env->startSection('content'); ?>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('sitesettings.store')); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <input type="hidden" id="country_ajax" url="<?php echo e(route('location.ajaxsubcategories')); ?>" required/>
        <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Site Settings')); ?> </h4>
        <div class="form-group">
            <label><?php echo e(__('messages.Site Name')); ?></label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="site_name" placeholder="<?php echo e(__('messages.Site Name')); ?>" value="<?php echo e($sitesettings->siteName); ?>" required>
            <?php if($errors->has('site_name')): ?><p class="text-danger"><?php echo e($errors->first('site_name')); ?></p><?php endif; ?>
        </div>
        <div class="m-b20">
            <div class="profile picture">
                <label><?php echo e(__('messages.Site Icon')); ?></label>
                <input type="file" id="wizard-picture" name="site_icon" class="m-b15 p-2 borderGrey w-100" accept="image/png"><br>
                <img  src="<?php echo e(url('media/admin_assets/fav-icon')); ?>" class="img-thumbnail" id="wizardPicturePreview" style="width:100px;height:100px;object-fit: cover;">
            </div>
            <?php if($errors->has('site_icon')): ?><p class="text-danger"><?php echo e($errors->first('site_icon')); ?></p><?php endif; ?>
        </div>
        <div class="m-b20">
            <div class="profile picture">
                <label><?php echo e(__('messages.Site Logo')); ?></label>
                <input type="file" id="wizard-picture-add" name="site_logo" class="m-b15 p-2 borderGrey w-100" accept="image/png"><br>
                <img  src="<?php echo e(url('media/admin_assets/logo.png')); ?>" class="img-thumbnail" id="wizardPicturePreviewAdd"
                style="width:100px;height:100px;object-fit: cover;">
            </div>
            <?php if($errors->has('site_logo')): ?><p class="text-danger"><?php echo e($errors->first('site_logo')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Contact Email')); ?> </label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="contact_email" placeholder="<?php echo e(__('messages.Contact Email')); ?>" value="<?php echo e($sitesettings->contactEmail); ?>" required>
            <?php if($errors->has('contact_email')): ?><p class="text-danger"><?php echo e($errors->first('contact_email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label>WhatsApp Support Phone</label>
            <input type="text" class="form-control" name="support_phone" placeholder="e.g. +15551234567" value="<?php echo e($sitesettings->supportPhone); ?>">
            <small class="form-text text-muted">Include country code. This number will be used for the WhatsApp contact button in the mobile app.</small>
            <?php if($errors->has('support_phone')): ?><p class="text-danger"><?php echo e($errors->first('support_phone')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Copyright Text')); ?> </label> <span class="text-danger">*</span>
            <input type="text" class="form-control" name="copyright_text" placeholder="<?php echo e(__('messages.Copyright Text')); ?>" value="<?php echo e($sitesettings->copyrightText); ?>" required>
            <?php if($errors->has('copyright_text')): ?><p class="text-danger"><?php echo e($errors->first('copyright_text')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-6">
                    <label><?php echo e(__('messages.Tax')); ?></label><span class="text-danger">*</span>
                    <div class="form-group ">
                        <div class="input-group mb-2">
                            <input type="number" class="form-control" name="tax" value="<?php echo e($sitesettings->tax); ?>" required>
                            <div class="input-group-prepend">
                                <div class="input-group-text">%</div>
                            </div>
                        </div>
                    </div>
                    <?php if($errors->has('tax')): ?><p class="text-danger"><?php echo e($errors->first('tax')); ?></p><?php endif; ?>
                </div>
                <div class="col-6">
                    <label><?php echo e(__('messages.Commission')); ?></label><span class="text-danger">*</span>
                    <div class="form-group">
                        <div class="input-group mb-2">
                            <input type="number" min="1" step=".01" class="form-control" name="commission" value="<?php echo e($sitesettings->commission); ?>"  required>
                            <div class="input-group-prepend">
                                <div class="input-group-text">%</div>
                            </div>
                        </div>
                    </div>
                    <?php if($errors->has('commission')): ?><p class="text-danger"><?php echo e($errors->first('commission')); ?></p><?php endif; ?>
                </div>
            </div>
        </div>
        <?php echo $__env->make('admin.settings.currency', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
        <div class="form-group">
            <label><?php echo e(__('messages.Minimum Amount')); ?> </label>
                <a href="https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts" target="blank">
                    <i class="fa fa-info-circle" aria-hidden="true" style="color:#000"></i>
                </a>
                <span class="text-danger">*</span>
            <input type="number" min="1" step=".01" class="form-control" name="minimumAmount" placeholder="<?php echo e(__('messages.Minimum Amount')); ?>" value="<?php echo e($sitesettings->minimumAmount); ?>" required>
            <?php if($errors->has('minimumAmount')): ?><p class="text-danger"><?php echo e($errors->first('minimumAmount')); ?></p><?php endif; ?>
        </div>
        <!-- <div class="form-group">
            <label>Payout Date<span class="text-danger">*</span></label>
            <input type="number" min="1" maxlength="6" id="payout_date" class="form-control" name="payoutDate" placeholder="Payout Date" value="<?php echo e($sitesettings->payoutDate); ?>" required>
            <?php if($errors->has('payoutDate')): ?><p class="text-danger"><?php echo e($errors->first('payoutDate')); ?></p><?php endif; ?>
        </div> -->
        <input type="hidden" id="payout_date" class="form-control" name="payoutDate" placeholder="Payout Date" value="2" >

        <div class="form-group">
            <label>Footer Banner Youtube Video Title <span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeTitle" placeholder="Youtube Video Title" value="<?php echo e($sitesettings->youtubeTitle); ?>" required>
            <?php if($errors->has('youtubeTitle')): ?><p class="text-danger"><?php echo e($errors->first('youtubeTitle')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label>Footer Banner Youtube Video Link <span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeLink" placeholder="Youtube Video Link" value="<?php echo e($sitesettings->youtubeLink); ?>" required>
            <?php if($errors->has('youtubeLink')): ?><p class="text-danger"><?php echo e($errors->first('youtubeLink')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label>Footer Banner Youtube Description<span class="text-danger">*</span></label>
            <input type="text" min="1" class="form-control" name="youtubeDescription" placeholder="Youtube Description" value="<?php echo e($sitesettings->youtubeDescription); ?>" required>
            <?php if($errors->has('youtubeDescription')): ?><p class="text-danger"><?php echo e($errors->first('youtubeDescription')); ?></p><?php endif; ?>
        </div>

        <div class="form-group">
                <label><?php echo e(__('messages.Google Adsense')); ?> </label>
                <div class="m-b20 d-flex">
                <div class="m-r50">
                <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="googleadsense_enable" name="googleadsense" value="true" <?php if($sitesettings->googleadsense == "true"): ?> checked <?php endif; ?>>
                <label class="custom-control-label" for="googleadsense_enable"><?php echo e(__('messages.Enable')); ?></label>
                </div>
                </div>
                <div class="m-r50">
                <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="googleadsense_disable" name="googleadsense" value="false"  <?php if($sitesettings->googleadsense == "false"): ?> checked <?php endif; ?>>
                <label class="custom-control-label" for="googleadsense_disable"><?php echo e(__('messages.Disable')); ?></label>
                </div>
                </div>
                </div>
            <label><?php echo e(__('messages.Instant Location')); ?> </label>
            <i class="fa fa-info-circle" aria-hidden="true" data-toggle="modal" data-target="#exampleModalCenter"></i>
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="tasker" name="instantLocation" value="true" <?php if($sitesettings->instantLocation == "true"): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="tasker"><?php echo e(__('messages.Enable')); ?></label>
                    </div>
                </div>
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="userandroid" name="instantLocation" value="false"  <?php if($sitesettings->instantLocation == "false"): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="userandroid"><?php echo e(__('messages.Disable')); ?></label>
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
              <h5 class="modal-title" id="exampleModalLongTitle">Instant Location</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                By enabling Instant Location, the tasks will be allocated to the tasker based on the current location of the tasker.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/settings/sitesettings.blade.php ENDPATH**/ ?>