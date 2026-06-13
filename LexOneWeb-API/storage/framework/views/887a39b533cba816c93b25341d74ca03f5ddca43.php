<?php $__env->startSection('title', 'Service Edit'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('service.update',['serviceId' => $servicedetails->_id])); ?>" method="POST"  enctype="multipart/form-data">
    <?php echo csrf_field(); ?>
    <input type="hidden" id="ajax_url" url="<?php echo e(route('service.ajaxsubcategories')); ?>" />
    <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Edit')); ?> <?php echo e(trans('messages.Service')); ?></h4>
    <div class="form-group">
        <label><?php echo e(trans('messages.Name')); ?></label> <span class="text-danger">*</span>
        <input type="text" class="form-control" name="service_name" placeholder="<?php echo e(trans('messages.Service Name')); ?>" value="<?php echo e($servicedetails->name); ?>" required>
        <?php if($errors->has('service_name')): ?><p class="text-danger"><?php echo e($errors->first('service_name')); ?></p><?php endif; ?>
    </div>
    <?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <?php $catelang = $language['langcode'] ?>
        <div class="form-group">
            <label><?php echo e($language['language']); ?> <?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
            <input type="text" class ="form-control" name="<?php echo e($language['langcode']); ?>" maxlength="30" value="<?php echo e($servicedetails->$catelang); ?>">
            <?php if($errors->has($language['langcode'])): ?><p class="text-danger"><?php echo e($errors->first($language['langcode'])); ?></p><?php endif; ?>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <div class="form-group">
        <label class="control-label" for="category-type"><?php echo e(trans('messages.Main Category')); ?></label>
        <span class="text-danger">*</span>
        <select id="category-type" class="form-control" name="service_category_parent">
            <option value=""><?php echo e(trans('messages.Select')); ?></option>
            <?php $__currentLoopData = $maincategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $eachcategory): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <option value="<?php echo e($eachcategory->_id); ?>" <?php if(strval($servicedetails->mainCategory) === $eachcategory->_id): ?> selected <?php endif; ?>> 
                <?php echo e($eachcategory->name); ?> - <?php echo e($eachcategory->type); ?> 
                </option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>    
        </select>
        <?php if($errors->has('category_parent')): ?><p class="text-danger"><?php echo e($errors->first('category_parent')); ?></p><?php endif; ?>
    </div>
    <div class="form-group">
        <div class="m-b20">
        <div class="profile picture">
            <label><?php echo e(trans('messages.Image')); ?></label> <span class="text-danger">*</span>
            <input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="service_image" class="m-b15 p-2 borderGrey w-100" ><br>
            <img src="<?php echo e(url('/media/services/'.$servicedetails->image)); ?>" class="img-thumbnail" id="wizardPicturePreview" style="width:100px;height:100px;object-fit: cover;">
        </div>
        <?php if($errors->has('service_image')): ?><p class="text-danger"><?php echo e($errors->first('service_image')); ?></p><?php endif; ?>
    </div>
    <div class="advanced_service_sec">
    </div>
    <div id="element">
        <div class="form-group">
            <label class="control-label" for="category-type"><?php echo e(trans('messages.Sub Category')); ?></label>
            <span class="text-danger">*</span>
            <select id="category-type" class="form-control" name="service_subcategory_parent">
                <?php if(!empty($subcategories)): ?>
                    <?php $__currentLoopData = $subcategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $eachcategory): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($eachcategory->id); ?>" <?php if(($servicedetails->subCategory) == $eachcategory->id): ?> selected <?php endif; ?>> 
                            <?php echo e($eachcategory->name); ?>

                        </option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>  
                <?php endif; ?>  
            </select>
            <?php if($errors->has('service_subcategory_parent')): ?><p class="text-danger"><?php echo e($errors->first('service_subcategory_parent')); ?></p><?php endif; ?>
        </div>
        <?php if($price_required): ?>
            <div class="form-group">
                <label><?php echo e(trans('messages.Service Cost')); ?> </label>  
                <input type="number" class="form-control"  min="1" step=".01" max="999999"  name="service_cost" placeholder="<?php echo e(trans('messages.Minimum Service Cost is')); ?> <?php echo $setting->currencySymbol.' '.$setting->minimumAmount; ?>" value="<?php echo e($servicedetails->serviceCost); ?>" required>
                <?php if($errors->has('service_cost')): ?><p class="text-danger"><?php echo e($errors->first('service_cost')); ?></p><?php endif; ?>
            </div>
            <div class="form-group">
                <label><?php echo e(trans('messages.Cost Type')); ?></label>
                <div class="m-b20 d-flex">
                    <div class="m-r50">
                        <div class="custom-control custom-radio">
                            <input type="radio" class="custom-control-input" id="unit" name="service_cost_type" value="unit" <?php if($servicedetails->costType == "unit"): ?> checked <?php endif; ?>>
                            <label class="custom-control-label" for="unit"><?php echo e(trans('messages.Per Unit')); ?></label>  
                        </div>
                    </div>
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="perhour" name="service_cost_type" value="hour" <?php if($servicedetails->costType == "hour"): ?> checked <?php endif; ?>>

                        <label class="custom-control-label" for="perhour"><?php echo e(trans('messages.Per Hour')); ?></label>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
    <div class="form-group">
        <label><?php echo e(trans('messages.Status')); ?></label>
        <div class="m-b20 d-flex">
            <div class="m-r50">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="enable" name="service_status" value="1"  <?php if($servicedetails->status == 1): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="enable"><?php echo e(trans('messages.Enable')); ?></label>
                </div>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" id="disable" name="service_status" value="0" <?php if($servicedetails->status == 0): ?> checked <?php endif; ?>>
                <label class="custom-control-label" for="disable"><?php echo e(trans('messages.Disable')); ?></label>
            </div>
        </div>
    </div>
    <div class="m-t20">
        <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Update')); ?></button> 
    </div>
    
</form>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/services/edit.blade.php ENDPATH**/ ?>