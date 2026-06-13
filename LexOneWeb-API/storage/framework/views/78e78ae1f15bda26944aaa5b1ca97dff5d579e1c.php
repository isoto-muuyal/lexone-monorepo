<?php $__env->startSection('title', 'App Settings'); ?>
<?php $__env->startSection('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
    <form class="boxShadow p-3 bgWhite m-b20" action="<?php echo e(route('app.store')); ?>" method="post" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.App Settings')); ?></h4>
        <div class="form-group">
            <label><?php echo e(__('messages.Docs Limit')); ?></label><span class="text-danger">*</span>  
            
            <div class="form-group field-public_key">
                <input type="number" class="form-control" min="1" max="100" name="docsLimit"  value="<?php echo e($sitesettings->docsLimit); ?>" placeholder="<?php echo e(__('messages.Docs Limit')); ?>" required>
            </div>		
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Portfolio Limit')); ?></label><span class="text-danger">*</span>  
            <div class="form-group field-public_key">
                <input type="number" class="form-control" min="1" max="100" name="portfolioLimit"  value="<?php echo e($sitesettings->portfolioLimit); ?>" placeholder="<?php echo e(__('messages.Portfolio Limit')); ?>" required>
            </div>		
        </div>
        <div class="form-group">
            <label><?php echo e(__('messages.Guideline')); ?></label><span class="text-danger">*</span>  
            <textarea id="editor1" name="guideLine" maxlength="1200">
                <?php echo e($sitesettings->guideLine); ?>

            </textarea>
            <?php if($errors->has('guideLine')): ?><p class="text-danger"><?php echo e($errors->first('guideLine')); ?></p><?php endif; ?>
        </div>
        <a href=# id="guideLineFr"><u><?php echo e(__('messages.Add In French Language')); ?></u></a>
        <div class="form-group" id="french">
            <label><?php echo e(__('messages.Guideline')); ?></label><span class="text-danger">*</span>  
            <textarea id="editor2" name="guideLineFr" maxlength="1200">
                <?php echo e($sitesettings->guideLineFr); ?>

            </textarea>
            <?php if($errors->has('guideLineFr')): ?><p class="text-danger"><?php echo e($errors->first('guideLineFr')); ?></p><?php endif; ?>
        </div>
        <br>
        <a href=# id="guideLineAr"><u><?php echo e(__('messages.Add In Arabic Language')); ?></u></a>
        <div class="form-group" id="arabic">
            <label><?php echo e(__('messages.Guideline')); ?></label><span class="text-danger">*</span>  
            <textarea id="editor3" name="guideLineAr" maxlength="1200">
                <?php echo e($sitesettings->guideLineAr); ?>

            </textarea>
            <?php if($errors->has('guideLineAr')): ?><p class="text-danger"><?php echo e($errors->first('guideLineAr')); ?></p><?php endif; ?>
        </div>
        <div class="m-t20">
            <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
        </div>
    </form>
    <script>
        $(document).ready(function () {
            $("#french").hide();
            $("#arabic").hide();
            $("#guideLineFr").click(function(){
                $("#french").slideToggle(250);
            });
            $("#guideLineAr").click(function(){
                $("#arabic").slideToggle(250);
            });
        });
    </script>
<?php $__env->stopSection(); ?>       

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/app/create.blade.php ENDPATH**/ ?>