<?php $__env->startSection('title', 'Help | Edit'); ?>
<?php $__env->startSection('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
        <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('help.update',['id' => $help->_id])); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?> 
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Edit')); ?> <?php echo e(__('messages.Help')); ?></h4>
        <div class="form-group">
            <div class="col-lg-2">
                <select id="status-selector" name="languageType" class="form-control">
                    <option value="en" <?php if(strval($help->lang) === "en"): ?> selected <?php endif; ?>>English</option>
                    <!-- <option value="ar" <?php if(strval($help->lang) === "ar"): ?> selected <?php endif; ?>>Arabic</option> -->
                    <option value="fr" <?php if(strval($help->lang) === "fr"): ?> selected <?php endif; ?>>French</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Page Title')); ?></label><span class="text-danger">*</span> 	
            <input type="text" name="name" class="form-control" placeholder="<?php echo e(__('messages.Page Title')); ?>" value="<?php echo e($help->name); ?>" required>
            <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label>Description </label>	<span class="text-danger">*</span> 
            <textarea id="editor1" name="description" required>
                <?php if($help): ?>
                    <?php echo e($help->description); ?>

                <?php endif; ?>
            </textarea>
            <?php if($errors->has('description')): ?><p class="text-danger"><?php echo e($errors->first('description')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label><?php echo e(trans('messages.Content type')); ?></label><span class="text-danger">*</span> 
            <div class="m-b20 d-flex">
                <div class="m-r50">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="users" name="type" value="user" <?php if($help->type == 'user'): ?> checked <?php endif; ?>>
                        <label class="custom-control-label" for="users"><?php echo e(__('messages.User')); ?></label>
                    </div>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="taskers" name="type" value="tasker" <?php if($help->type == 'tasker'): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="taskers"><?php echo e(__('messages.Tasker')); ?></label>
                </div>
            </div>
        </div>
        <div class="m-t20">
            <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Save')); ?></button> 
        </div>
    </form>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/help/edit.blade.php ENDPATH**/ ?>