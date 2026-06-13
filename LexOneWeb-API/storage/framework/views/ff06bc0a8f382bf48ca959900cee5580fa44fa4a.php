<?php $__env->startSection('title', 'Moderator Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(__('messages.Moderator')); ?> <?php echo e(__('messages.Detail')); ?></h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <td class="fontSize15">
                            <?php echo e($admin->name); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Email')); ?></th>
                        <td class="fontSize15">
                            <?php echo e($admin->email); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Roles')); ?></th>
                        <td class="fontSize15">
                            <?php $__empty_1 = true; $__currentLoopData = $role; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                <?php echo e($role['name']); ?><br>
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
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/moderators/show.blade.php ENDPATH**/ ?>