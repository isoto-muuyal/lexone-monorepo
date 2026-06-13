<?php $__env->startSection('title', 'Moderators'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Moderators')); ?></h4>
            </div>
            <div>
                <a href="<?php echo e(route('admin.create')); ?>">
                    <button class="btn btn-info align-text-top border-0">
                        <i class="fa fa-plus" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Moderators')); ?>

                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Email')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.View')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Edit')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Delete')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index = 1; ?>
                    <?php $__empty_1 = true; $__currentLoopData = $admin; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $admin): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <?php if($name != $admin['name']): ?>
                            <tr class="text-center">
                                <td class="fontSize15">
                                    <?php echo e($index); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($admin['name']); ?>

                                </td>
                                <td class="fontSize15">
                                    <?php echo e($admin['email']); ?>

                                </td>
                                <td class="fontSize15 text-center">
                                    <a href="<?php echo e(route('admin.show', ['id' => $admin['_id']])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('admin.edit', ['id' => $admin['_id'] ])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <form action="<?php echo e(route('admin.destroy', ['id' => $admin['_id']])); ?>" method="POST">
                                        <?php echo csrf_field(); ?>
                                        <?php echo method_field('DELETE'); ?>
                                        <button class="btn btn-danger align-text-top border-0" >
                                            <i class="fa fa-trash" title="<?php echo e(trans('messages.delete')); ?>"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            <?php $index++; ?>
                        <?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr>
                            <td colspan="8"><?php echo e(trans('messages.No records found')); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>
    <?php $__empty_1 = true; $__currentLoopData = $admin; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $admins): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <div class="modal fade" id="exampleModalCenter-<?php echo e($admin['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php echo e(__('messages.Are you sure you want to delete this item?')); ?>

                    </div>
                    <div class="modal-footer">
                    <form action="<?php echo e(route('admin.destroy', ['id' => $admin['_id']])); ?>" method="POST">
                        <?php echo csrf_field(); ?>
                        <?php echo method_field('DELETE'); ?>
                        <button class="btn btn-danger align-text-top border-0">
                            <?php echo e(__('messages.delete')); ?>

                        </button>
                    </form>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/moderators/index.blade.php ENDPATH**/ ?>