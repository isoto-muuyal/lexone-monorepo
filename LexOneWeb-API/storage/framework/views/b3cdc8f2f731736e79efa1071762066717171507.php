<title> <?php echo e(env('APP_NAME')); ?>  | <?php echo $__env->yieldContent('title'); ?></title>
<?php $__env->startSection('content'); ?>
<div class="d-table w-100 h-100 text-center position-absolute">
    <div class="centerAlignment">
        <div class="wrapper fadeInDown  d-flex align-items-center justify-content-center w-100 h-100">
            <div id="loginform" class="borderRadious-3 position-relative p-0 text-center m-r20 m-l20">
                <form class="m-b25 p-4" method="POST" action="<?php echo e(route('admin.authentication')); ?>">
                    <?php echo csrf_field(); ?>
                    <div class="m-b15">
                        <img src="<?php echo e(url('/media/admin_assets/logo.png')); ?>" class="height40"/>
                    </div>
                    <input type="email" name="email" class="p-t15 p-b15 p-l15 w-100 m-b15"  placeholder="<?php echo e(__('Email')); ?>">
                    <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
                    <input type="password" name="password" class="p-t15 p-b15 p-l15 w-100"  placeholder="<?php echo e(__('Password')); ?>">
                    <?php if($errors->has('password')): ?><p class="text-danger"><?php echo e($errors->first('password')); ?></p><?php endif; ?>
                    <div class="m-t20">
                        <button type="submit" class="btn-block bgBlue whiteTxtClr p-t10 p-b10 p-r30 p-l30 borderRadious-3 fontSize13 border-0"><?php echo e(__('Login')); ?></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.main', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/auth/login.blade.php ENDPATH**/ ?>