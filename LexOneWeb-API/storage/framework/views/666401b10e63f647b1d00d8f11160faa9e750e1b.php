<?php $__env->startSection('title', 'Booking Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    <?php echo e(__('messages.Booking')); ?>

                </h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.User')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <?php if($user->_id == $booking['userId']): ?>
                                <a href="<?php echo e(route('user.show', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                                    <?php echo e($user->name); ?>

                                </a>
                                <?php endif; ?>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>         
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Tasker')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <?php if($user->_id == $booking['taskerId']): ?>
                                <a href="<?php echo e(route('tasker.show', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                                    <?php echo e($user->name); ?>  
                                </a>
                                <?php endif; ?>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>         
                        </td>
                    </tr>
                    <?php if($booking->locationType === 'home' || $booking->locationType === 'transport') { ?>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Location')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($booking->sourcelocation); ?> 
                        </td>
                    </tr>
                    <?php } ?>
                    <?php if($booking->locationType === 'transport') { ?>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Location')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($booking->destLocation); ?> 
                        </td>
                    </tr>
                    <?php } ?>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Category')); ?>

                        </th>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('category.show', ['categoryId' => $category['_id']])); ?>" style="cursor: pointer;">
                                <?php echo e($category->name); ?> 
                            </a>    
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Subcategory')); ?>

                        </th>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('subcategory.show', ['subcategoryId' => $subCategory->id])); ?>" style="cursor: pointer;">
                                <?php echo e($subCategory->name); ?> 
                            </a>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Booked Date')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($booking->bookedWhen->toDateTime()->format('d-m-Y')); ?> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Price')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($currencySymbol); ?> <?php echo e($booking->price); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Status')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($booking->status); ?> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.OTP')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($booking->otp); ?> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Tax')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($currencySymbol); ?> <?php echo e($booking->tax); ?> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Commission')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($currencySymbol); ?> <?php echo e($booking->commission); ?> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Total Price')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($currencySymbol); ?> <?php echo e($booking->total); ?> 
                        </td>
                    </tr>
                </tbody>
                <?php if($services != null): ?>
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                <?php echo e(__('messages.Booking')); ?> <?php echo e(__('messages.Detail')); ?>

                            </h4>
                        </div>
                        <?php //echo "<pre>"; print_r($bookingdetails[0]); ?>
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
                                            <?php echo e($currencySymbol); ?> <?php echo e($bookingdetail->price); ?>

                                        </td>
                                        <td class="fontSize15">
                                            <?php echo e($bookingdetail['quantity']); ?> <?php echo e($bookingdetail['pricing']); ?>

                                        </td>
                                        <td class="fontSize15"><?php echo e($currencySymbol); ?> <?php echo e($bookingdetail['total']); ?></td>
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
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/booking/show.blade.php ENDPATH**/ ?>