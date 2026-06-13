<?php $__env->startSection('title', 'Help'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Help')); ?></h4>
            </div>
            <div>
                <a href="<?php echo e(route('help.create')); ?>">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Help')); ?>

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
                        <th class="nosorting"><?php echo e(__('messages.Type')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Language')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Edit')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Delete')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    <?php if(!empty($help)): ?>
                        <?php $__currentLoopData = $help; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $help): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="text-center">
                                <td class="fontSize15"><?php echo e($index); ?></td>
                                <td class="fontSize15">
                                    <?php echo e($help['name']); ?>

                                </td>
                                <?php if($help['type'] == "tasker"): ?>
                                    <td class="fontSize15">
                                        Tasker
                                    </td>
                                <?php else: ?>
                                    <td class="fontSize15">
                                        User
                                    </td>
                                <?php endif; ?>
                                <?php if($help['lang'] == "ar"): ?>
                                    <td class="fontSize15">
                                        Arabic
                                    </td>
                                <?php elseif($help['lang'] == "fr"): ?>
                                    <td class="fontSize15">
                                        French
                                    </td>
                                <?php elseif($help['lang'] == "en"): ?>
                                    <td class="fontSize15">
                                        English
                                    </td>
                                <?php endif; ?>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('help.edit', ['id' => $help['_id'] ])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <form action="<?php echo e(route('help.destroy', ['id' => $help['_id'] ])); ?>" method="POST">
                                        <?php echo csrf_field(); ?>
                                        <?php echo method_field('DELETE'); ?>
                                        <button class="btn btn-danger align-text-top border-0"><i class="fa fa-trash" title="<?php echo e(trans('messages.delete')); ?>"></i></button>
                                    </form>
                                </td>
                            </tr>
                            <?php $index++; ?>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8"><?php echo e(trans('messages.No records found')); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/help/index.blade.php ENDPATH**/ ?>