<?php $__env->startSection('title', 'Jobs Detail'); ?>
<?php $__env->startSection('content'); ?>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
     <div>
        <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(__('messages.Jobs')); ?> <?php echo e(__('messages.Detail')); ?></h4>
    </div>
</div>
<div class="table-responsive text-center">
    <table id="example" class="table table-striped table-bordered mytable">
        <tbody>
            <tr>
                <th scope="col"><?php echo e(__('messages.Title Of The Job')); ?></th>
                <td class="fontSize15">
                    <?php echo e(ucwords($needs->bookedName)); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Status')); ?></th>
                <td class="fontSize15">
                    <?php echo e($jobstatus); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Date')); ?></th>
                <td class="fontSize15">
                    <?php echo e($bookedWhen); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.User')); ?></th>
                <td class="fontSize15">
                    <a href="<?php echo e(route('user.show', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                        <?php echo e(ucwords($user->name)); ?>

                    </a>
                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Description')); ?></th>
                <td class="fontSize15">
                    <?php echo e($needs->bookedFor); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Location')); ?></th>
                <td class="fontSize15">
                    <?php if($needs->sourcelocation): ?>
                    <b>From</b> : <?php echo e($needs->sourcelocation); ?><br>
                    <?php endif; ?>
                    <?php if($needs->destLocation): ?>
                    <b>To</b> : <?php echo e($needs->destLocation); ?>

                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Tasker')); ?></th>
                <td class="fontSize15">
                    <?php if($tasker): ?>
                    <a href="<?php echo e(route('tasker.show', ['id' => $tasker['_id']])); ?>" style="cursor: pointer;">
                        <?php echo e($tasker->name); ?>

                    </a>
                    <?php else: ?>
                    <?php echo e(__('messages.Not Assigned')); ?>

                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Main Category')); ?></th>
                <td class="fontSize15">
                    <a href="<?php echo e(route('category.show', ['categoryId' => $category['_id']])); ?>" style="cursor: pointer;">
                        <?php echo e($category->name); ?>

                    </a>
                </td>
            </tr> 
            <tr>
                <th scope="col"><?php echo e(__('messages.Sub Category')); ?></th>
                <td class="fontSize15">
                    <a href="<?php echo e(route('subcategory.show', ['subcategoryId' => $subCategory['_id']])); ?>" style="cursor: pointer;">
                        <?php echo e($subCategory->name); ?>

                    </a>
                </td>
            </tr>

            <tr>
                <th scope="col"><?php echo e(__('messages.Job Price')); ?></th>
                <td class="fontSize15">
                    <?php echo e($currencySymbol); ?> <?php echo e($needs->price); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Tax')); ?></th>
                <td class="fontSize15">
                    <?php echo e($currencySymbol); ?> <?php echo e($needs->tax); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Commission')); ?></th>
                <td class="fontSize15">
                    <?php echo e($currencySymbol); ?> <?php echo e($needs->commission); ?>

                </td>
            </tr>
            <tr>
                <th scope="col"><?php echo e(__('messages.Total Price')); ?></th>
                <td class="fontSize15">
                    <?php echo e($currencySymbol); ?> <?php echo e($needs->total); ?>

                </td>
            </tr>
            <?php if($needs->reward): ?>
            <tr>
                <th scope="col">
                    <?php echo e(__('messages.Rewards')); ?>

                </th>
                <td class="fontSize15">
                    <?php echo e($currencySymbol); ?> <?php echo e($needs->reward); ?>

                </td>
            </tr>
            <?php endif; ?>
        </tbody>
        <?php if($services != null): ?>
        <table class="table table-striped table-bordered w-100 mytable">
            <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    <?php echo e(__('messages.Booking')); ?> <?php echo e(__('messages.Detail')); ?>

                </h4>
            </div>
            <thead>
                <tr>
                    <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Service')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Price')); ?></th>
                    <th class="nosorting"><?php echo e(__('messages.Quantity')); ?> </th>
                    <th class="nosorting"><?php echo e(__('messages.Total')); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php $index =1; ?>
                <?php if(!empty($bookingdetails)): ?>
                <?php $__currentLoopData = $bookingdetails; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $bookingdetail): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td class="fontSize15"><?php echo e($index); ?></td>
                    <td class="fontSize15">
                        <?php $__currentLoopData = $services; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $service): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php if($service->_id == $bookingdetail['serviceId']): ?>
                        <a href="<?php echo e(route('service.show', ['serviceId' => $service['_id']])); ?>" style="cursor: pointer;">
                            <?php echo e($service->name); ?> 
                        </a>
                        <?php endif; ?>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </td>
                    <td class="fontSize15">
                        <?php echo e($currencySymbol); ?> <?php echo e(round($bookingdetail->price,2)); ?>

                    </td>
                    <td class="fontSize15">
                        <?php echo e($bookingdetail['quantity']); ?> <?php echo e($bookingdetail['pricing']); ?>

                    </td>
                    <td class="fontSize15"><?php echo e($currencySymbol); ?> <?php echo e(round($bookingdetail['total'],2)); ?></td>
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
        <?php endif; ?>
    </table>
</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/needs/show.blade.php ENDPATH**/ ?>