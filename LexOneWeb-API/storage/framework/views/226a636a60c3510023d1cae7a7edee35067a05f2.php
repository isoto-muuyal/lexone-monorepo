<?php $__env->startSection('title', 'Sub Category Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(__('messages.Sub Category')); ?> <?php echo e(__('messages.Detail')); ?></h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <td class="fontSize15"><?php echo e($subcategorydetail->name); ?></td>
                    </tr>
                    <?php if($subcategorydetail->arabicName): ?>
                        <tr>
                            <th scope="col"><?php echo e(__('messages.اسم')); ?></th>
                            <td class="fontSize15"><?php echo e($subcategorydetail->arabicName); ?></td>
                        </tr>
                    <?php endif; ?>
                    <?php if($subcategorydetail->frenchName): ?>
                        <tr>
                            <th scope="col"><?php echo e(__('messages.Nom')); ?></th>
                            <td class="fontSize15"><?php echo e($subcategorydetail->frenchName); ?></td>
                        </tr>
                    <?php endif; ?>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Image')); ?></th>
                        <td class="fontSize15"><img src="<?php echo e(url('/media/categories/'.$subcategorydetail['image'])); ?>" style="height:80px;">
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Status')); ?></th>
                        <td class="fontSize15">
                            <?php if($subcategorydetail->status == 0 ): ?>
                                <?php echo e(__('messages.Disabled')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Enabled')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Parent Category')); ?></th>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('category.show', ['categoryId' => $categories['_id']])); ?>" style="cursor: pointer;">
                                <?php echo e($categories->name); ?> 
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Category Type')); ?></th>
                        <td class="fontSize15">
                            <?php echo e($categories->type); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Featured')); ?></th>
                        <td class="fontSize15">
                            <?php if($categories->featured == 0 ): ?>
                                <?php echo e(__('messages.No')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Yes')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.Services')); ?></th>
                        <td class="fontSize15">
                            <?php $__empty_1 = true; $__currentLoopData = $services; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $service): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                    <a href="<?php echo e(route('service.show', ['serviceId' => $service['_id']])); ?>" style="cursor: pointer;">
                                    <?php echo e($service->name); ?>

                                    </a><br>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?> 
                                <?php echo e(__('messages.No Services')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/subcategories/show.blade.php ENDPATH**/ ?>