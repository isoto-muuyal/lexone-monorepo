<?php $__env->startSection('title', 'Tasker Create'); ?>
<?php $__env->startSection('content'); ?>
<script src="//geodata.solutions/includes/countrystatecity.js"></script>
<script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('tasker.store')); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Tasker')); ?></h4>
        <div class="form-group">
            <label><?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class="form-control" name="name" maxlength="30"  placeholder="<?php echo e(__('messages.Enter')); ?> <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Name')); ?>" value="<?php echo e(old('name')); ?>" required>
            <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Email')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" name="email" placeholder="<?php echo e(__('messages.Enter')); ?> <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Email')); ?>" value="<?php echo e(old('email')); ?>" class="form-control input-lg" required/>
            <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Mobile')); ?> </label> <span class="text-danger">*</span>  
            <input type="tel" name="mobile" placeholder="<?php echo e(__('messages.Enter')); ?> <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Mobile')); ?>" value="<?php echo e(old('mobile')); ?>" class="form-control input-lg" required/>
            <small class="text-danger">&nbsp;Add an mobile number with +(countrycode) (Phone number) Eg: +91876543210</small>
            <?php if($errors->has('mobile')): ?><p class="text-danger"><?php echo e($errors->first('mobile')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Password')); ?> </label> <span class="text-danger">*</span>  <span toggle="#password-field" class="fa fa-fw fa-eye field_icon toggle-password"></span>
            <input type="password" name="password"   placeholder="<?php echo e(__('Password')); ?>"  value="<?php echo e(old('Password')); ?>"  class="form-control input-lg pass_log_id" required>
            <?php if($errors->has('password')): ?><p class="text-danger"><?php echo e($errors->first('password')); ?></p><?php endif; ?>
        </div>
        <?php if($instantLocation == "false"): ?>
            <div class="form-group">
                <label><?php echo e(__('messages.Location')); ?> </label> <span class="text-danger">*</span>  
                <select id="category-type" class="form-control" name="location" required>
                    <option value=""><?php echo e(trans('messages.Select')); ?></option>
                    <?php $__currentLoopData = $cities; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $location): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($location->city); ?>" > 
                            <?php echo e($location->city); ?>, <?php echo e($location->state); ?>.
                        </option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </select>
            </div>
        <?php endif; ?>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
        </div>
    </form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/taskers/create.blade.php ENDPATH**/ ?>