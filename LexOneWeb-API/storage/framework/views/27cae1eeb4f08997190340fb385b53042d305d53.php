<?php $__env->startSection('title', 'Subcategory Edit'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('subcategory.update',['categoryId' => $categorydetails->_id])); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Edit')); ?> <?php echo e(trans('messages.Subcategory')); ?></h4>
    <div class="form-group">
        <label><?php echo e(trans('messages.Name')); ?> </label> <span class="text-danger">*</span>  
        <input type="text" class="form-control" name="category_name" placeholder="<?php echo e(trans('messages.Category Name')); ?>" value="<?php echo e($categorydetails->name); ?>" required>
        <?php if($errors->has('category_name')): ?><p class="text-danger"><?php echo e($errors->first('category_name')); ?></p><?php endif; ?>
    </div>
    <?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php $catelang = $language['langcode'] ?>
        <div class="form-group">
            <label><?php echo e($language['language']); ?> <?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class ="form-control" name="<?php echo e($language['langcode']); ?>" maxlength="30" value="<?php echo e($categorydetails->$catelang); ?>">
            <?php if($errors->has($language['langcode'])): ?><p class="text-danger"><?php echo e($errors->first($language['langcode'])); ?></p><?php endif; ?>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <div class="form-group">
        <label class="control-label" for="category-type"><?php echo e(trans('messages.Parent Category')); ?></label>
        <span class="text-danger">*</span>
        <select id="category-type" class="form-control" name="category_parent">
            <option value=""><?php echo e(trans('messages.Select')); ?></option>
            <?php $__currentLoopData = $maincategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $eachcategory): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <option value="<?php echo e($eachcategory->_id); ?>" <?php if(strval($categorydetails->parentCategory) === $eachcategory->_id): ?> selected <?php endif; ?>> 
                    <?php echo e($eachcategory->name); ?>  - <?php echo e($eachcategory->type); ?> 
                </option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>    
        </select>
        <?php if($errors->has('category_parent')): ?><p class="text-danger"><?php echo e($errors->first('category_parent')); ?></p><?php endif; ?>
    </div>
    <div class="m-b20">
        <div class="profile picture">
            <label><?php echo e(trans('messages.Image')); ?></label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="category_image" class="m-b15 p-2 borderGrey w-100"><br>
            <img src="<?php echo e(url('/media/categories/'.$categorydetails->image)); ?>" class="img-thumbnail" id="wizardPicturePreview"  style="width:100px;height:100px;object-fit: cover;">
        </div>
        <?php if($errors->has('category_image')): ?><p class="text-danger"><?php echo e($errors->first('category_image')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Status')); ?></label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="category_status" value="1" <?php if($categorydetails->status == 1): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="enable"><?php echo e(trans('messages.Enable')); ?></label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="category_status" value="0" <?php if($categorydetails->status == 0): ?> checked <?php endif; ?>>
                <label class="custom-control-label" for="disable"><?php echo e(trans('messages.Disable')); ?></label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Update')); ?></button> 
    </div>
</form>
<script>
    var errors = <?php echo json_encode($errors->any()); ?>;

    $(document).ready(function () {   
      if(errors == true){
        $("#morecategories").show();
      }else{
        $("#morecategories").hide();
      }
      });
  </script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/subcategories/edit.blade.php ENDPATH**/ ?>