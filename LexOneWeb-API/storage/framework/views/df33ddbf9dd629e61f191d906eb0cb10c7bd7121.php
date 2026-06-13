<?php $__env->startSection('title', 'Help | Create'); ?>
<?php $__env->startSection('title', 'Help'); ?>
<?php $__env->startSection('content'); ?>
<style>
textarea#CKEditor1 { display: none;}
</style>
<script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
<form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('help.store')); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>    
    <input type="hidden" id="tasker" name="help" value="add">
    <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Add Help')); ?></h4>
    <div class="form-group">
        <div class="col-lg-2">
            <select id="status-selector" name="languageType" class="form-control">
                <option value="en">English</option>
                <option value="fr">French</option>
            </select>
          
        </div>
    </div>
    <div class="form-group">
        <label><?php echo e(__('messages.Page Title')); ?> </label><span class="text-danger">*</span> 
        <input type="text" name="name" class="form-control" placeholder="<?php echo e(__('messages.Page Title')); ?>" value="<?php echo e(old('name')); ?>" minlength="3" maxlength="30" required>
        <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
    </div>
  
    <div class="form-group">
        <label>Description </label><span class="text-danger">*</span> 
        <textarea id="editor1" name="description" required>
        </textarea>
        <?php if($errors->has('description')): ?><p class="text-danger"><?php echo e($errors->first('description')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Content type')); ?></label><span class="text-danger">*</span> 
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="type" value="user" checked>
                    <label class="custom-control-label" for="enable"><?php echo e(__('messages.User')); ?></label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="type" value="tasker">
                <label class="custom-control-label" for="disable"><?php echo e(__('messages.Tasker')); ?></label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Save')); ?></button> 
    </div>
</form>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/help/create.blade.php ENDPATH**/ ?>