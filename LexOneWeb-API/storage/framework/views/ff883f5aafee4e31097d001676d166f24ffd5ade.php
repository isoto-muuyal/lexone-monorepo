<?php $__env->startSection('title', 'Bookings'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Bookings')); ?> </h4>
            </div>
        </div>
        <div class="">
            <form method="GET" action="<?php echo e(route('booking.select')); ?>">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="status-selector" name="search_for" class="form-control">
                            <option value="all" <?php if($search_for === "all") { echo "selected"; } ?>>All</option>
                            <option value="requested"<?php if($search_for === "requested") { echo "selected"; } ?>>Requested</option>
                            <option value="started"<?php if($search_for === "started") { echo "selected"; } ?>>Started</option>
                            <option value="cancelled"<?php if($search_for === "cancelled") { echo "selected"; } ?>>Cancelled</option>
                            <option value="paid"<?php if($search_for === "paid") { echo "selected"; } ?>>Paid</option>
                            <option value="completed"<?php if($search_for === "completed") { echo "selected"; } ?>>Completed</option>
                            <option value="accepted"<?php if($search_for === "accepted") { echo "selected"; } ?>>Accepted</option>
                            <option value="refunded"<?php if($search_for === "refunded") { echo "selected"; } ?>>Refunded</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="nosorting"><?php echo e(__('messages.S.No')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.User')); ?></th>
                        <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('total',trans('messages.Total Price')));?></th>
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
                                    <?php echo e($currencySymbol); ?> <?php echo e($booking['total']); ?> 
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
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            $("#status-selector").change(function(){
                this.form.submit();
            });
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/booking/index.blade.php ENDPATH**/ ?>