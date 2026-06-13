<?php $__env->startSection('title', 'Banner Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(trans('messages.Banner')); ?> <?php echo e(trans('messages.Detail')); ?></h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.image_url')); ?></th>
                        <td class="fontSize15">
                            <a href="//<?php echo e($banner->url); ?>"style="color:#000;">
                                <?php echo e($banner->url); ?>

                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Image')); ?></th>
                        <td class="fontSize15"><img src="<?php echo e(url('/media/bannerimages/'.$banner->image)); ?>" style="height:80px;"></td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Status')); ?></th>
                        <td class="fontSize15">
                            <?php if($banner->status == 0 ): ?>
                                <?php echo e(trans('messages.Disable')); ?>

                            <?php else: ?>
                                <?php echo e(trans('messages.Enable')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/bannerimage/show.blade.php ENDPATH**/ ?>