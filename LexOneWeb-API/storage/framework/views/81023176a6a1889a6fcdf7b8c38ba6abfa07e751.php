<?php $__env->startSection('title', 'Tasker Documents'); ?>
<?php $__env->startSection('content'); ?>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
        <div>
            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Documents')); ?>

            </h4>
        </div>
    </div>
    <table id="example" class="table table-striped table-bordered mytable">
        <tbody>
            <tr>
                <th scope="col">
                    <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Name')); ?>

                </th>
                <td class="fontSize15">
                    <?php echo e($tasker->name); ?>

                </td>
            </tr>
            <tr>
                <th scope="col">
                    <?php echo e(__('messages.Status')); ?>

                </th>
                <td class="fontSize15">
                    <?php if($tasker->verified == 0): ?>
                    <?php echo e(__('messages.Pending')); ?>

                    <?php elseif($tasker->verified == 1): ?>
                    <?php echo e(__('messages.Approved')); ?>

                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th scope="col">
                    <?php echo e(__('messages.Documents')); ?>

                </th>
                <td class="fontSize15">
                    <?php $__empty_1 = true; $__currentLoopData = $documents; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $document): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <?php echo e($document->media_name); ?>

                    <a href="<?php echo e(url('/media/documents/'.$document->media_name)); ?>" target="_blank"> 
                        <i class="fa fa-eye ml-1" aria-hidden="true"></i>
                    </a>
                    <br>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <p><?php echo e(__('messages.No')); ?> <?php echo e(__('messages.Documents')); ?></p>
                    <?php endif; ?>
                </td>
            </tr>
        </tbody>
    </table>
    <?php if($tasker->verified == 0): ?>
    <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
        <i class="fa fa-check" title="<?php echo e(__('messages.Add')); ?>"></i> 
        <?php echo e(__('messages.Approve')); ?> <?php echo e(__('messages.Tasker')); ?>

    </button>
    <?php elseif($tasker->verified == 1): ?>
    <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
        <i class="fa fa-ban" title="<?php echo e(__('messages.Add')); ?>"></i> 
        <?php echo e(__('messages.Unapprove')); ?> <?php echo e(__('messages.Tasker')); ?>

    </button>
    <?php endif; ?>
</div>
</div>

<!-- Modal -->
<div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <?php if($tasker->verified == 0): ?>
                    <?php echo e(__('messages.Do you want to approve this tasker booking activity?')); ?><br><br>
                    <h6>Note: Please verify the tasker certificate and details to approve the tasker booking activity.</h6>
                <?php elseif($tasker->verified == 1): ?>
                    <?php echo e(__('messages.Do you want to disable this tasker booking  activity?')); ?><br><br> 
                    <h6>Note: Once disabled tasker can’t able to do bookings.</h6>
                <?php endif; ?>
            </div>
            <div class="modal-footer">
                <?php if($tasker->verified == 0): ?>
                <a href="<?php echo e(route('tasker.pendingStatus', ['id' => $tasker['userId'], 'taskerStatus' =>1 ])); ?>" >
                    <button class="btn btn-success align-text-top border-0">
                        <i class="fa fa-check" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Approve')); ?> <?php echo e(__('messages.Tasker')); ?>

                    </button>
                </a>
                <?php elseif($tasker->verified == 1): ?>
                <a href="<?php echo e(route('tasker.pendingStatus', ['id' => $tasker['userId'], 'taskerStatus' =>0 ])); ?>" >
                    <button class="btn btn-danger align-text-top border-0">
                        <i class="fa fa-ban" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Unapprove')); ?> <?php echo e(__('messages.Tasker')); ?>

                    </button>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/taskers/documentsindex.blade.php ENDPATH**/ ?>