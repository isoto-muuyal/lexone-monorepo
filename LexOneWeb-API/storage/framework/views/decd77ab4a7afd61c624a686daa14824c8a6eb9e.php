<?php $__env->startSection('title', 'Moderator | Edit'); ?>
<?php $__env->startSection('content'); ?>
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('admin.update', $admin->id)); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Edit Moderator')); ?></h4>
        <div class="form-group">
            <label> <?php echo e(__('messages.Name')); ?></label>	<span class="text-danger">*</span>  
            <input type="text" name="name" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));"  class="form-control" value="<?php echo e($admin->name); ?>" placeholder="name">
        </div>
        <div class="form-group">
            <label> <?php echo e(__('messages.Email')); ?></label><span class="text-danger">*</span>  
            <input type="text" name="email" class="form-control" value="<?php echo e($admin->email); ?>" placeholder="email">
            <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label class="control-label" for="category-type"><?php echo e(__('messages.Role')); ?></label><span class="text-danger">*</span>  
            <select id="category-type" class="form-control" name="roles">
                <option value=""><?php echo e(__('messages.Select')); ?></option>
                <?php $__currentLoopData = $role; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="checkbox checkbox-styled">
                        <label>
                            <option value="<?php echo e($role->name); ?>" <?php if($roleName->name == $role->name): ?> selected <?php endif; ?>> 
                                <?php echo e($role->name); ?> 
                            </option>
                        </label>
                    </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
        </div>  
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
	    </div>
    </form>
<script>
    $("#check").click(function () {
        $('.check').not(this).prop('checked', this.checked);
    });
</script>
<?php $__env->stopSection(); ?>       
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/moderators/edit.blade.php ENDPATH**/ ?>