<?php $__env->startSection('title', 'City | Create'); ?>
<?php $__env->startSection('content'); ?>
<script src="<?php echo e(URL::asset('public/admin_assets/js/jquery-1.11.1/jquery.min.js')); ?>"></script>
<link rel="stylesheet" href="<?php echo e(URL::asset('public/admin_assets/css/select2.min.css')); ?>">
<script src="<?php echo e(URL::asset('public/admin_assets/js/select2.min.js')); ?>"></script>
<script src="<?php echo e(URL::asset('public/admin_assets/js/geodata.js')); ?>"></script>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
	<div class="d-flex justify-content-between  flex-column flex-sm-row">
		<div>
			<h4 class="m-b25 blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Location')); ?></h4>
		</div>
		<div>
			<button class="btn btn-primary align-text-top border-0 m-b10"  data-toggle="modal" data-target="#exampleModalCenter">
				<?php echo e(__('messages.Change')); ?> <?php echo e(__('messages.Country')); ?>

			</button>
		</div>
	</div>
	<form action="<?php echo e(route('location.store')); ?>" method="post" enctype="multipart/form-data">
		<?php echo csrf_field(); ?>
		<div class="form-group">
			<div class="form-row">
				<div class="col-12">
					<?php echo $__env->make('admin.location.alpha2code', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
				</div>
				<div class="col-12">
					<label><?php echo e(__('messages.State')); ?></label><span class="text-danger">*</span> 
					<select name="state" class="states form-control" id="stateId" required>
						<option value="">Select State</option>
					</select><br>
					<?php if($errors->has('state')): ?><p class="text-danger"><?php echo e($errors->first('state')); ?></p><?php endif; ?>
				</div>
				<div class="col-12 " id="cityhide">
					<label><?php echo e(__('messages.City')); ?></label><span class="text-danger">*</span> 
					<select name="city[]" class="cities form-control mul-select " id="cityId" multiple="true"  required>
						<option value="" ></option>
					</select>
					<?php if($errors->has('city')): ?><p class="text-danger"><?php echo e($errors->first('city')); ?></p><?php endif; ?>
				</div>
			</div>
			<div class="m-t20">
				<button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
			</div>
		</div>
	</form>
	<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<?php echo e(__('messages.If You Change country entire states and cities will be deleted are you sure to proceed')); ?>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					<a href="<?php echo e(route('location.truncate')); ?>">
						<button type="button" class="btn btn-primary"><?php echo e(__('messages.Proceed')); ?></button>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/location/create.blade.php ENDPATH**/ ?>