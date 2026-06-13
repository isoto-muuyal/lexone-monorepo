<?php $__env->startSection('title', 'Roles'); ?>
<?php $__env->startSection('content'); ?>

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle"><?php echo app('translator')->get('messages.Are You Sure'); ?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p><?php echo app('translator')->get('messages.notdeleteRole'); ?></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Roles')); ?></h4>
            </div>
            <div>
                <a href="<?php echo e(route('role.create')); ?>">
                    <button class="btn btn-info align-text-top border-0">
                        <i class="fa fa-plus" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Roles')); ?>

                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col"><?php echo e(trans('messages.S.No')); ?></th>
                        <th scope="col"><?php echo e(trans('messages.Name')); ?></th>
                        <th scope="col"><?php echo e(trans('messages.description')); ?></th>
                        <th class="nosorting"><?php echo e(trans('messages.View')); ?></th>
                        <th class="nosorting"><?php echo e(trans('messages.Edit')); ?></th>
                        <th class="nosorting"><?php echo e(trans('messages.Delete')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    
                    <?php if(!empty($roles)): ?>
                        <?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php if($name != $role['name']): ?>
                                <tr class="text-center">
                                    <td class="fontSize15"><?php echo e($index); ?></td>
                                    <td class="fontSize15">
                                        <?php echo e(($role['name'])); ?>

                                    </td>
                                    <td class="fontSize15">
                                        <?php echo e($role['description']); ?>

                                    </td>
                                    <td class="fontSize15 text-center">
                                        <a href="<?php echo e(route('role.show', ['id' => $role['_id']])); ?>" style="cursor: pointer;">
                                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                                        </a>
                                    </td>
                                    <td class="fontSize15">
                                        <a href="<?php echo e(route('role.edit', ['id' => $role['_id'] ])); ?>" style="cursor: pointer;">
                                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                                        </a>
                                    </td>
                                    <td class="fontSize15">
                                        <?php if($role->admin_ids != []): ?>
                                        
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#deleteModal">
                                            <i class="fa fa-trash" title="<?php echo e(trans('messages.delete')); ?>"></i>
                                        </button>     
                                        <?php else: ?>
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($role['_id']); ?>">
                                            <i class="fa fa-trash" title="<?php echo e(trans('messages.delete')); ?>"></i>
                                        </button> 
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php $index++; ?>
                            <?php endif; ?>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8"><?php echo e(trans('messages.No records found')); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
            <div class="pagination-wrapper"> <?php echo $roles->links(); ?> </div>
        </div>
    </div>
    <?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter-<?php echo e($role['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php echo e(__('messages.Are you sure you want to delete this item?')); ?><br>
                        <?php echo e(__('messages.If the roles are deleted then the corresponding moderator will also be deleted')); ?>

                    </div>
                    <div class="modal-footer">
                    <form action="<?php echo e(route('role.destroy', ['id' => $role['_id']])); ?>" method="POST">
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

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/roles/index.blade.php ENDPATH**/ ?>