<?php $__env->startSection('title', 'Paid Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    <?php echo e(__('messages.Settlement Details')); ?>

                </h4>
            </div>
        </div>
        <table id="example" class="table table-striped table-bordered mytable text-center">
            <tbody>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                    <td class="fontSize15">
                        <a href="<?php echo e(route('tasker.show', ['id' => $tasker['_id']])); ?>" style="cursor: pointer;">
                            <?php echo e($tasker->name); ?> (<?php echo e($tasker->rating); ?>)
                        </a>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Amount')); ?></th>
                    <td class="fontSize15">
                        <b><?php echo e($currencySymbol); ?> <?php echo e($price); ?></b>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Reward')); ?></th>
                    <td class="fontSize15">
                        <b><?php echo e($currencySymbol); ?> <?php echo e($reward); ?></b>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Tax')); ?></th>
                    <td class="fontSize15">
                        <b><?php echo e($currencySymbol); ?> <?php echo e($tax); ?></b>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Commission')); ?></th>
                    <td class="fontSize15">
                        <b><?php echo e($currencySymbol); ?> <?php echo e($commission); ?></b>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Total')); ?></th>
                    <td class="fontSize15">
                        <b><?php echo e($currencySymbol); ?> <?php echo e($total); ?></b>
                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Email')); ?></th>
                    <td class="fontSize15">
                            <?php echo e($tasker->email); ?>

                    </td>
                </tr>
                <tr>
                    <th scope="col"><?php echo e(__('messages.Mobile')); ?></th>
                    <td class="fontSize15">
                        <?php echo e($tasker->mobile); ?>

                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                <?php echo e(__('messages.Booking Details')); ?>

            </h4>
        </div>
        <table id="example" class="table table-striped table-bordered w-100 mytable">
            <thead>
                <tr class="text-center">
                    <th scope="nosorting"><?php echo e(__('messages.S.No')); ?></th>
                    <th scope="nosorting"><?php echo e(__('messages.User')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Total Price')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Status')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Date')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Show')); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php $index =1; ?>
                <?php if(!empty($bookings)): ?>
                    <?php $__currentLoopData = $bookings; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $booking): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <tr class="text-center">
                            <td class="fontSize15"><?php echo e($index); ?></td>
                            <td class="fontSize15">
                                <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <?php if($user->_id == $booking['userId']): ?>
                                        <?php echo e($user->name); ?>

                                    <?php endif; ?>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </td>
                            <td class="fontSize15">
                                <?php echo e($currencySymbol); ?>  <?php echo e($booking['price']); ?> 
                            </td>
                            <td class="fontSize15"> 
                                <?php if($booking['status'] == 'requested'): ?>
                                    <h5><span class="badge badge-primary">Requested</span></h5>
                                <?php elseif($booking['status'] == 'completed'): ?>
                                    <h5><span class="badge badge-secondary">Completed</span></h5>
                                <?php elseif($booking['status'] == 'cancelled'): ?>
                                    <h5><span class="badge badge-danger">Cancelled</span></h5>
                                <?php elseif($booking['status'] == 'paid'): ?>
                                    <h5><span class="badge badge-success">Paid</span></h5>
                                <?php elseif($booking['status'] == 'started'): ?>
                                    <h5><span class="badge badge-warning">Started</span></h5>
                                <?php elseif($booking['status'] == 'accepted'): ?>
                                    <h5><span class="badge badge-primary">Accepted</span></h5>
                                <?php elseif($booking['status'] == 'refunded'): ?>
                                    <h5><span class="badge badge-primary">Refunded</span></h5>
                                <?php endif; ?>
                            </td>
                            <td class="fontSize15">
                                <?php echo e($booking['bookedWhen']->toDateTime()->format('d-m-Y')); ?> 
                            </td>
                            <td class="fontSize15 text-center">
                                <a href="<?php echo e(route('booking.show', ['id' => $booking['_id']])); ?>" style="cursor: pointer;">
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
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/settlement/paiddetails.blade.php ENDPATH**/ ?>