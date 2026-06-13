<?php $__env->startSection('title', 'Role Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(__('messages.Role')); ?> <?php echo e(__('messages.Detail')); ?></h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($role->name); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.description')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($role->description); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Permissions')); ?></th>
                        <td class="fontSize15">
                        <?php $__empty_1 = true; $__currentLoopData = $permission; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $permission): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                <?php echo e(ucwords($permission['name'])); ?><br>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <?php echo e(__('messages.No')); ?> <?php echo e(__('messages.Permissions')); ?>

                        <?php endif; ?>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/roles/show.blade.php ENDPATH**/ ?>