<?php if($edit == 'Tasker'): ?>
    <?php $__env->startSection('title', 'privacy-policy | Tasker'); ?>
<?php else: ?>
    <?php $__env->startSection('title', 'privacy-policy | User'); ?>
<?php endif; ?>
<?php $__env->startSection('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
    <div class="boxShadow p-3 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="m-b25  blueTxtClr p-t5 p-b5"><?php echo e($edit == 'Tasker' ? "Tasker" : "User"); ?> <?php echo e(__('messages.Privacy Policy')); ?></h4>
            </div>  
            <div class="col-6 col-sm-4 col-md-4 col-lg-2">
                <form action="<?php echo e(route('privacy.create', ['id' => $edit,'lang'=>'en' ])); ?>" method="POST"  enctype="multipart/form-data">
                    <select id="status-selector" name="languageType" class="form-control">
                        <?php if($help): ?>
                            <option value="en" <?php if($help->lang == 'en') { echo "selected"; } ?>>English</option>
                            <option value="fr" <?php if($help->lang === "fr") { echo "selected"; } ?>>French</option>
                            <!-- <option value="ar" <?php if($help->lang === "ar") { echo "selected"; } ?>>Arabic</option> -->
                        <?php else: ?>
                            <option value="en" <?php if($lang === "en") { echo "selected"; } ?>>English</option>
                            <option value="fr" <?php if($lang === "fr") { echo "selected"; } ?>>French</option>
                            <!-- <option value="ar" <?php if($lang === "ar") { echo "selected"; } ?>>Arabic</option> -->
                        <?php endif; ?>
                    </select>
                </form>
            </div>
        </div>
        <form  action="<?php echo e(route('privacy.store')); ?>" method="POST"  enctype="multipart/form-data">
            <?php echo csrf_field(); ?> 
            <div class="form-group">
                <label><?php echo e(__('messages.Page Title')); ?></label><span class="text-danger">*</span> 	
                <input type="text" name="name" class="form-control" value="Privacy Policy" readonly>
                <input type="hidden" name="languageType" class="form-control" value=<?php echo e($lang); ?> >
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
        
            <?php if($edit == 'Tasker'): ?>
                <input type="hidden" id="tasker" name="type" value="tasker">
            <?php else: ?>
                <input type="hidden" id="user" name="type" value="user">
            <?php endif; ?>
            <div class="m-t20">
                <button class="btn btn-primary align-text-top border-0 m-b10"><?php echo e(trans('messages.Save')); ?></button> 
            </div>
        </form>
    </div>
    <script>
        $(document).ready(function () {
            var edit =<?php echo json_encode($edit) ?>;
            $("#status-selector").change(function(){
                var lang =$("#status-selector").val();
                if (edit == 'Tasker') {
                    window.location.href = "<?php echo e(route('privacy.create', ['id' => 'Tasker',''])); ?>"+"/"+lang;
                }
                else{
                    window.location.href = "<?php echo e(route('privacy.create', ['id' => 'User',''])); ?>"+"/"+lang;
                }
            });
        });
    </script>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/privacy/create.blade.php ENDPATH**/ ?>