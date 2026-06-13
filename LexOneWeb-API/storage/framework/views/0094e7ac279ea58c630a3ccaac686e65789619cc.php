<?php $__env->startSection('title', 'Service Create'); ?>
<?php $__env->startSection('content'); ?>
<form class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20" action="<?php echo e(route('service.store')); ?>" method="POST"  enctype="multipart/form-data">
	<?php echo csrf_field(); ?>
	<input type="hidden" id="ajax_url" url="<?php echo e(route('service.ajaxsubcategories')); ?>" required/>
	<h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Service')); ?></h4>
	
	<div class="form-group">
		<label> <?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
		<input type="text" class="form-control" id="service_name" name="service_name" value="<?php echo e(old("service_name")); ?>" maxlength="30" placeholder="<?php echo e(__('messages.Service')); ?> <?php echo e(__('messages.Name')); ?>" required>
		<?php if($errors->has('service_name')): ?><p class="text-danger"><?php echo e($errors->first('service_name')); ?></p><?php endif; ?>
	</div>
	<a href=# id="RTL"><u><?php echo e(__('messages.Add Names In Other Languages')); ?></u></a>
	<div id="morecategories">
		<?php $__currentLoopData = $languages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $language): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
			<div class="form-group">
				<label><?php echo e($language['language']); ?> <?php echo e(__('messages.Name')); ?> </label> <span class="text-danger">*</span>  
				<input type="text" class="form-control" name=<?php echo e($language['langcode']); ?> maxlength="30" placeholder="<?php echo e(__('messages.Service')); ?> <?php echo e(__('messages.Name')); ?>" value="<?php echo e(old($language['langcode'])); ?>">
                <?php if($errors->has($language['langcode'])): ?><p class="text-danger"><?php echo e($errors->first($language['langcode'])); ?></p><?php endif; ?>
			</div>
		<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
	</div>
	<br>
	<br>
	<div class="form-group">
		<label class="control-label" for="category-type"><?php echo e(__('messages.Main Category')); ?></label>
		<select id="category-type" class="form-control" name="service_category_parent" required>
			<option value=" "><?php echo e(__('messages.Select')); ?></option>
			<?php $__currentLoopData = $maincategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $eachcategory): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
			<option value="<?php echo e($eachcategory->_id); ?>"> 
				<?php echo e($eachcategory->name); ?> - <?php echo e($eachcategory->type); ?> 
			</option>
			<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>    
		</select>
		<?php if($errors->has('service_category_parent')): ?><p class="text-danger"><?php echo e($errors->first('service_category_parent')); ?></p><?php endif; ?>
	</div>
	<div class="form-group">
		<div class="m-b20">
			<div class="profile picture">
				<label><?php echo e(__('messages.Image')); ?></label> <span class="text-danger">*</span>
				<input type="file" accept="image/image/gif,image/jpeg" id="wizard-picture" name="service_image" class="m-b15 p-2 borderGrey w-100" required><br>
				<img src="" class="borderCurve borderGradient picture-src dnone" id="wizardPicturePreview"
				style="width:100px;height:100px;object-fit: cover;" >
			</div>
			<?php if($errors->has('service_image')): ?><p class="text-danger"><?php echo e($errors->first('service_image')); ?></p><?php endif; ?>
		</div>
	</div>
	<div class="advanced_service_sec">
	</div>
	<div class="form-group">
		<label><?php echo e(__('messages.Status')); ?></label>
		<div class="m-b20 d-flex">
			<div class="m-r50">
				<div class="custom-control custom-radio">
					<input type="radio" class="custom-control-input" id="enable" name="service_status" value="1" checked>
					<label class="custom-control-label" for="enable"><?php echo e(__('messages.Enable')); ?></label>
				</div>
			</div>
			<div class="custom-control custom-radio">
				<input type="radio" class="custom-control-input" id="disable" name="service_status" value="0">
				<label class="custom-control-label" for="disable"><?php echo e(__('messages.Disable')); ?></label>
			</div>
		</div>
	</div>
	<div class="m-t20">
		<button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
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
	window.onload = function (e) {
      document.getElementById("category-type").selectedIndex = 0;
    };
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/services/create.blade.php ENDPATH**/ ?>