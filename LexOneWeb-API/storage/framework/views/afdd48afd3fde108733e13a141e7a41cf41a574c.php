<?php
use App\Classes\MyClass;
$myClass = new MyClass();
$settings = $myClass->site_settings();
?>
<?php $__env->startSection('title', 'Notification'); ?>

<?php $__env->startSection('content'); ?>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
   <div class="d-flex justify-content-between  flex-column flex-sm-row">
       <div>
        <h4 class="m-b25 blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Push Notification')); ?></h4>
        </div>
    </div>
    <div class="">
        <div class="materialTab">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link <?php if($active_tab === 'general'): ?> active <?php endif; ?>" id="general-tab" data-toggle="tab" href="#general" role="tab"
                    aria-controls="profile" aria-selected="false"><?php echo e(trans('messages.Ios')); ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link <?php if($active_tab === 'changepassword'): ?> active <?php endif; ?>" id="password-tab" data-toggle="tab" href="#password" role="tab"
                    aria-controls="contact" aria-selected="false"><?php echo e(trans('messages.Android')); ?></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="web-tab" data-toggle="tab" href="#web" role="tab"
                    aria-controls="contact" aria-selected="false"><?php echo e(trans('messages.Web')); ?></a>
                </li>
            </ul>
            <div class="tab-content p-t20 p-b20" id="myTabContent">
                <div class="tab-pane <?php if($active_tab === 'general'): ?> active <?php endif; ?>" id="general" role="tabpanel" aria-labelledby="general-tab">
                    <p class="card-text d-inline text-danger"><?php echo e(__('messages.Note : This notification will be send to all IOS device users')); ?></p><br>
                    <!-- <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'ios'])); ?>" method="get" enctype="multipart/form-data" onsubmit="return validatemsg()"> -->
                    <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'ios'])); ?>" method="get" enctype="multipart/form-data">
                        <?php echo csrf_field(); ?>
                        <div class="form-group mt-3">
                            <label class="card-title"><?php echo e(trans('messages.Push notification for IOS')); ?></label><span class="text-danger">*</span>
                            <textarea class="form-control" name="msg" id="msg" cols="30" rows="6" maxlength="500" placeholder="<?php echo e(trans('messages.500 Characters only allowed')); ?>" required></textarea>
                            <?php if($errors->has('msg')): ?><p class="text-danger"><?php echo e($errors->first('msg')); ?></p><?php endif; ?>
                            <span class="text-danger" id="msgerr"></span>
                            <label class=" mt-3"><?php echo e(__('messages.Send to')); ?></label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="tasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="tasker"><?php echo e(__('messages.Tasker')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="users" name="userType" value="user">
                                        <label class="custom-control-label" for="users"><?php echo e(__('messages.User')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="all" name="userType" value="all">
                                        <label class="custom-control-label" for="all"><?php echo e(__('messages.Both')); ?></label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1"><?php echo e(__('messages.Send')); ?></button>
                            
                        </div>
                    </form>
                </div>
                <div class="tab-pane <?php if($active_tab === 'changepassword'): ?> active <?php endif; ?>" id="password" role="tabpanel" aria-labelledby="password-tab">
                    <p class="card-text d-inline text-danger"><?php echo e(trans('messages.Note : This notification will be send to all Android device users')); ?></p><br>
                    <!-- <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'android'])); ?>" class="" method="get" onsubmit="return validateandroidmsg()"> -->
                        <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'android'])); ?>" class="" method="get">
                        <?php echo csrf_field(); ?>
                        <div class="form-group mt-3">
                            <label class="card-title"><?php echo e(trans('messages.Push notification for Android')); ?></label><span class="text-danger">*</span>
                            <textarea class="form-control" name="msgg" id="msgg" cols="30" rows="6" maxlength="500" placeholder="<?php echo e(trans('messages.500 Characters only allowed')); ?>" required></textarea>
                            <?php if($errors->has('msgg')): ?><p class="text-danger"><?php echo e($errors->first('msgg')); ?></p><?php endif; ?>
                            <span class="text-danger" id="msgerr"></span>
                            <label  class=" mt-3"><?php echo e(__('messages.Send to')); ?></label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="andtasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="andtasker"><?php echo e(__('messages.Tasker')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="userandroid" name="userType" value="user">
                                        <label class="custom-control-label" for="userandroid"><?php echo e(__('messages.User')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="androidall" name="userType" value="all">
                                        <label class="custom-control-label" for="androidall"><?php echo e(__('messages.Both')); ?></label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1"><?php echo e(trans('messages.Send')); ?></button>
                        </div>                  
                    </form>
                </div>

                <div class="tab-pane " id="web" role="tabpanel" aria-labelledby="web-tab">
                    <p class="card-text d-inline text-danger"><?php echo e(trans('messages.Note : This notification will be send to all Web device users')); ?></p><br>
                    <!-- <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'android'])); ?>" class="" method="get" onsubmit="return validateandroidmsg()"> -->
                        <form action="<?php echo e(route('dashboard.sendalert', ['dtype' => 'web'])); ?>" class="" method="get">
                        <?php echo csrf_field(); ?>
                        <div class="form-group mt-3">
                            <label class="card-title"><?php echo e(trans('messages.Push notification for Web')); ?></label><span class="text-danger">*</span>
                            <textarea class="form-control" name="wmsg" id="wmsg" cols="30" rows="6" maxlength="500" placeholder="<?php echo e(trans('messages.500 Characters only allowed')); ?>" required></textarea>
                            <?php if($errors->has('wmsg')): ?><p class="text-danger"><?php echo e($errors->first('wmsg')); ?></p><?php endif; ?>
                            <span class="text-danger" id="msgerr"></span>
                            <label  class=" mt-3"><?php echo e(__('messages.Send to')); ?></label><span class="text-danger">*</span>  
                            <div class="m-b20 d-flex">
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webtasker" name="userType" value="tasker" checked>
                                        <label class="custom-control-label" for="webtasker"><?php echo e(__('messages.Tasker')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webandroid" name="userType" value="user">
                                        <label class="custom-control-label" for="webandroid"><?php echo e(__('messages.User')); ?></label>
                                    </div>
                                </div>
                                <div class="m-r50">
                                    <div class="custom-control custom-radio">
                                        <input type="radio" class="custom-control-input" id="webandroidall" name="userType" value="all">
                                        <label class="custom-control-label" for="webandroidall"><?php echo e(__('messages.Both')); ?></label>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary mt-1"><?php echo e(trans('messages.Send')); ?></button>
                        </div>                  
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/notification.blade.php ENDPATH**/ ?>