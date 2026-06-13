<?php $__env->startSection('title', 'Unpaid Settlement'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Unpaid Settlement')); ?> </h4>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="nosorting"><?php echo e(__('messages.S.No')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Name')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Email')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Amount')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Reward')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Tax')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Commission')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Total')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Show')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    <?php if(!empty($taskers)): ?>
                        <?php $__currentLoopData = $taskers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tasker): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="text-center">
                                <td class="fontSize15"><?php echo e($index); ?></td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['name']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['email']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['price']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['reward']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['tax']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['commission']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($tasker['total']); ?>

                                </td>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('settlement.show', ['id' => $tasker['_id'] ])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                                    </a>
                                </td>
                            </tr>
                            <?php $index++; ?>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8"><?php echo e(__('messages.No records found')); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>
    
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/settlement/index.blade.php ENDPATH**/ ?>