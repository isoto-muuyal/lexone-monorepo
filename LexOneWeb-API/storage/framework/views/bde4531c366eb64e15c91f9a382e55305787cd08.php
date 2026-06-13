<?php $__env->startSection('title', 'Tasker Edit'); ?>
<?php $__env->startSection('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
    <form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20"  action="<?php echo e(route('tasker.update', $tasker->id)); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <?php echo method_field('patch'); ?>
        <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Edit')); ?> <?php echo e(__('messages.Tasker')); ?></h4>
        <div class="form-group">
            <label><?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" name="name" value="<?php echo e($tasker->name); ?>" class="form-control input-lg" required/>
            <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Email')); ?> </label> <span class="text-danger">*</span>  
            <input type="email" name="email" value='<?php echo e($tasker->email); ?>' class="form-control input-lg" required/>
            <?php if($errors->has('email')): ?><p class="text-danger"><?php echo e($errors->first('email')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Mobile')); ?> </label> <span class="text-danger">*</span>  
            <input type="tel" name="mobile" value='<?php echo e($tasker->mobile); ?>' class="form-control input-lg"required />
            <?php if($errors->has('mobile')): ?><p class="text-danger"><?php echo e($errors->first('mobile')); ?></p><?php endif; ?>
        </div>
        <?php if($instantLocation == "false"): ?>
            <?php if(!empty($tasker->location)): ?>
                <div class="form-group">
                    <label><?php echo e(__('messages.Location')); ?> </label> <span class="text-danger">*</span>  
                    <select id="category-type" class="form-control" name="location" required>
                        <option value=""><?php echo e(trans('messages.Select')); ?></option>
                        <?php $__currentLoopData = $cities; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $location): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <option value="<?php echo e($location->city); ?>" <?php if(strval($tasker->location) === $location->city): ?> selected <?php endif; ?>> 
                                <?php echo e($location->city); ?>, <?php echo e($location->state); ?>.
                            </option>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                </div>
            <?php endif; ?>
        <?php else: ?>
            <div class="form-group">
                <label><?php echo e(__('messages.Location')); ?> </label> <span class="text-danger">*</span>  
                <input  name="location" value="<?php echo e($tasker->location); ?>" class="form-control input-lg" readonly />
                
            </div>
        <?php endif; ?>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Update')); ?></button> 
        </div>
    </form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/taskers/edit.blade.php ENDPATH**/ ?>