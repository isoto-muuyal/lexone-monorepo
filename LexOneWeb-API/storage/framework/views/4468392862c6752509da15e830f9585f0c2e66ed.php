<?php $__env->startSection('title', 'Moderator | Create'); ?>
<?php $__env->startSection('content'); ?>
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('admin.store')); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Add Moderator')); ?></h4>
        <div class="form-group">
            <label> <?php echo e(__('messages.Name')); ?></label>	<span class="text-danger">*</span>  
            <input type="text" name="name" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));"  class="form-control" placeholder="name" value="<?php echo e(old('name')); ?>" required>
            <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(trans('messages.Email')); ?> </label> <span class="text-danger">*</span>  
            <input type="email" name="email" placeholder="<?php echo e(__('messages.Email')); ?>" value="<?php echo e(old('email')); ?>" class="form-control input-lg" required/>
            <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(trans('messages.Password')); ?> </label> <span class="text-danger">*</span>  
            <input type="password" name="password" placeholder="<?php echo e(__('Password')); ?>" class="form-control input-lg" required>
            <?php if($errors->has('password')): ?><p class="text-danger"><?php echo e($errors->first('password')); ?></p><?php endif; ?>
        </div>
            <div class="form-group">
                <label class="control-label" for="roles"><?php echo e(trans('messages.Role')); ?></label><span class="text-danger">*</span>  
                <select id="roles" class="form-control" name="roles" required>
                    <option value=""><?php echo e(trans('messages.Select')); ?></option>
                    <?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $roles): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($roles->name); ?>"> 
                            <?php echo e($roles->name); ?>

                        </option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>    
                </select>
            </div>
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
	    </div>
    </form>
<?php $__env->stopSection(); ?>       
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/moderators/create.blade.php ENDPATH**/ ?>