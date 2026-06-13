<div class="form-group">
	<label class="control-label" for="sub-category-type"><?php echo e(trans('messages.Sub Category')); ?></label>
	<select id="sub-category-type" class="form-control" name="service_subcategory_parent" required>
		<option value=""><?php echo e(trans('messages.Select')); ?></option>
		<?php if(!empty($subcategories)): ?>
			<?php $__currentLoopData = $subcategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $subcategory): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
				<option value="<?php echo e($subcategory->_id); ?>"><?php echo e($subcategory->name); ?></option>
			<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
		<?php endif; ?>
	</select>
	<?php if($errors->has('service_subcategory_parent')): ?><p class="text-danger"><?php echo e($errors->first('service_subcategory_parent')); ?></p><?php endif; ?>
</div>
<?php if($price_required): ?>
	<div class="form-group">
		<label><?php echo e(trans('messages.Service Cost')); ?> </label>  
		<input type="number" min="1" step=".01" max="999999" class="form-control" name="service_cost" placeholder="<?php echo e(trans('messages.Minimum Service Cost is')); ?> <?php echo $setting->currencySymbol.' '.$setting->minimumAmount; ?>">
		<?php if($errors->has('service_cost')): ?><p class="text-danger"><?php echo e($errors->first('service_cost')); ?></p><?php endif; ?>
	</div>
	<div class="form-group">
		<label><?php echo e(trans('messages.Cost Type')); ?></label>
		<div class="m-b20 d-flex">
			<div class="m-r50">
				<div class="custom-control custom-radio">
					<input type="radio" class="custom-control-input" id="fixed" name="service_cost_type" value="unit" checked>
					<label class="custom-control-label" for="fixed"><?php echo e(trans('messages.Per Unit')); ?></label>
				</div>
			</div>
			<div class="custom-control custom-radio">
				<input type="radio" class="custom-control-input" id="perhour" name="service_cost_type" value="hour">
				<label class="custom-control-label" for="perhour"><?php echo e(trans('messages.Per Hour')); ?></label>
			</div>
		</div>
	</div>
<?php endif; ?><?php /**PATH /var/www/html/resources/views/admin/ajax/subcategories-select.blade.php ENDPATH**/ ?>