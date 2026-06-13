<?php $__env->startSection('title', 'Profile'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
        <div>
        <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Profile')); ?></h4>
            </div>
        </div>
        <div class="">
            <div class="materialTab">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link <?php if($active_tab === 'general'): ?> active <?php endif; ?>" id="general-tab" data-toggle="tab" href="#general" role="tab"
                        aria-controls="profile" aria-selected="false"><?php echo e(trans('messages.General')); ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link <?php if($active_tab === 'changepassword'): ?> active <?php endif; ?>" id="password-tab" data-toggle="tab" href="#password" role="tab"
                        aria-controls="contact" aria-selected="false"><?php echo e(trans('messages.Change Password')); ?></a>
                    </li>
                </ul>
                <div class="tab-content p-t20 p-b20" id="myTabContent">
                    <div class="tab-pane <?php if($active_tab === 'general'): ?> active <?php endif; ?>" id="general" role="tabpanel" aria-labelledby="general-tab">
                        <form action="<?php echo e(route('admin.updateprofile')); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <div class="form-group">
                                <label><?php echo e(trans('messages.Name')); ?></label>   
                                <input type="text" name="admin_username" class="form-control" value="<?php echo e($adminrecords->name); ?>">
                                <?php if($errors->has('admin_username')): ?><p class="text-danger"><?php echo e($errors->first('admin_username')); ?></p><?php endif; ?>
                            </div>
                            <div class="form-group">
                                <label><?php echo e(trans('messages.Email')); ?></label>   
                                <input type="email" name="admin_email" class="form-control" value="<?php echo e($adminrecords->email); ?>">
                                <?php if($errors->has('admin_email')): ?><p class="text-danger"><?php echo e($errors->first('admin_email')); ?></p><?php endif; ?>
                            </div>
                            <div class="m-t20">
                                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10"> <?php echo e(trans('messages.Save')); ?></button> 
                            </div>
                        </form>
                    </div>
                    <div class="tab-pane <?php if($active_tab === 'changepassword'): ?> active <?php endif; ?>" id="password" role="tabpanel" aria-labelledby="password-tab">
                        <form action="<?php echo e(route('admin.changepassword')); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <div class="form-group">
                                <label><?php echo e(trans('messages.Old Password')); ?></label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-password"></span>   
                                <input   type="password" name="admin_old_password" name="admin_old_password" class="form-control pass_log_id"  required>
                                <?php if($errors->has('admin_old_password')): ?><p class="text-danger"><?php echo e($errors->first('admin_old_password')); ?></p><?php endif; ?>
                            </div>
                            <div class="form-group">
                                <label><?php echo e(trans('messages.New Password')); ?></label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-new-password"></span>   
                                <input id="new_password" type="password" name="admin_new_password" name="admin_new_password"  class="form-control " required>
                                <?php if($errors->has('admin_new_password')): ?><p class="text-danger"><?php echo e($errors->first('admin_new_password')); ?></p><?php endif; ?>
                            </div>
                            <div class="form-group">
                                <label><?php echo e(trans('messages.Confirm New Password')); ?></label><span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-confirm-password"></span>   
                                <input id="confirm_new_password" type="password" name="admin_confirm_password" name="admin_confirm_password" class="form-control " required>
                                <?php if($errors->has('admin_confirm_password')): ?><p class="text-danger"><?php echo e($errors->first('admin_confirm_password')); ?></p><?php endif; ?>
                            </div>
                            <div class="m-t20">
                                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10"> <?php echo e(trans('messages.Save')); ?></button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).on('click', '.toggle-new-password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $("#new_password");
            input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
        });
        $(document).on('click', '.toggle-confirm-password', function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $("#confirm_new_password");
            input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
        });
    </script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/profile.blade.php ENDPATH**/ ?>