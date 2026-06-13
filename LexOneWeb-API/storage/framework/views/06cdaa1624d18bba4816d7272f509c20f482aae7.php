<?php $__env->startSection('title', 'Role | Edit'); ?>
<?php $__env->startSection('content'); ?>
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('role.update', $role->id)); ?>" method="POST"  enctype="multipart/form-data">
        <?php echo csrf_field(); ?>    
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Edit Role')); ?></h4>
        <div class="form-group">
            <label> <?php echo e(__('messages.Name')); ?></label>	<span class="text-danger">*</span>
            <input type="text" onkeypress="return ((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode == 8 || event.charCode == 32 || (event.charCode >= 48 && event.charCode <= 57));" name="name" class="form-control" value="<?php echo e($role->name); ?>" placeholder="name" required>
            <?php if($errors->has('name')): ?><p class="text-danger"><?php echo e($errors->first('name')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
            <label> <?php echo e(__('messages.Description')); ?></label><span class="text-danger">*</span>	
            <input type="text" name="description" class="form-control" value="<?php echo e($role->description); ?>" placeholder="description" required>
            <?php if($errors->has('description')): ?><p class="text-danger"><?php echo e($errors->first('description')); ?></p><?php endif; ?>
        </div>
        <div class="form-group">
        <label> <?php echo e(__('messages.Previleges')); ?></label><span class="text-danger">*</span></br>
            <label><input type="checkbox" id="checkedAll">Check All</label></br>
            <?php $__currentLoopData = $permission; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $permission): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="checkbox checkbox-styled" >
                    <label>
                        <input class="checkSingle" type="checkbox" name="permissions[]" value="<?php echo e($permission->name); ?>" 
                            <?php echo e($role->permissions->contains($permission->id) ? 'checked' : ''); ?> >
                        <span><?php echo e($permission->name); ?> <?php echo e(__('messages.Management')); ?></span>
                    </label>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <?php if($errors->has('permissions')): ?><p class="text-danger"><?php echo e($errors->first('permissions')); ?></p><?php endif; ?>
        </div>  
        <div class="m-t20">
		    <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(__('messages.Save')); ?></button> 
	    </div>
    </form>
<script>
    $(document).ready(function() {
        if ($(".checkSingle").is(":checked")){
        var isAllChecked = 0;
        $(".checkSingle").each(function(){
            if(!this.checked)
            isAllChecked = 1;
        })              
        if(isAllChecked == 0){ $("#checkedAll").prop("checked", true); }     
        }else {
        $("#checkedAll").prop("checked", false);
        }
        $("#checkedAll").change(function(){
            if(this.checked){
            $(".checkSingle").each(function(){
                this.checked=true;
            })              
            }else{
            $(".checkSingle").each(function(){
                this.checked=false;
            })              
            }
        });

        $(".checkSingle").click(function () {
            if ($(this).is(":checked")){
            var isAllChecked = 0;
            $(".checkSingle").each(function(){
                if(!this.checked)
                isAllChecked = 1;
            })              
            if(isAllChecked == 0){ $("#checkedAll").prop("checked", true); }     
            }else {
            $("#checkedAll").prop("checked", false);
            }
        });
    });
</script>
<?php $__env->stopSection(); ?>       
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/roles/edit.blade.php ENDPATH**/ ?>