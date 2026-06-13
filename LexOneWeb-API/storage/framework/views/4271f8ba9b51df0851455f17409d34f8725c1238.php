<?php $__env->startSection('title', 'Service Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 "><?php echo e(__('messages.Service')); ?> <?php echo e(__('messages.Detail')); ?></h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <td class="fontSize15"><?php echo e($servicedetail->name); ?></td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Image')); ?></th>
                        <?php if(!empty($servicedetail['image'])): ?>
                            <td class="fontSize15">
                                <img src="<?php echo e(url('/media/services/'.$servicedetail['image'])); ?>"  style="height:80px;">
                            </td>
                        <?php else: ?>
                            <td class="fontSize15">
                                <p>Image Unavailable</p>
                            </td>
                        <?php endif; ?>
                    </tr>
                    <?php if($price_required): ?>
                        <tr>
                            <th scope="col"><?php echo e(__('messages.Service Cost')); ?></th>
                            <td class="fontSize15">
                                <?php echo e($currencySymbol); ?> <?php echo e($servicedetail->serviceCost); ?>

                            </td>
                        </tr>
                        <tr>
                            <th scope="col"><?php echo e(__('messages.Cost Type')); ?></th>
                            <td class="fontSize15">
                            <?php if($servicedetail->costType == "hour" ): ?>
                                <?php echo e(__('messages.Per Hour')); ?>

                            <?php elseif($servicedetail->costType == "unit"): ?>
                                <?php echo e(__('messages.Per Unit')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Fixed')); ?>

                            <?php endif; ?>
                            </td>
                        </tr>
                    <?php endif; ?>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Status')); ?></th>
                        <td class="fontSize15">
                            <?php if($servicedetail->status == 0 ): ?>
                                <?php echo e(__('messages.Disabled')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Enabled')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.category')); ?></th>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('category.show', ['categoryId' => $maincategory['_id']])); ?>" style="cursor: pointer;">
                                <?php echo e($maincategory->name); ?>

                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.category type')); ?></th>
                        <td class="fontSize15">
                            <?php echo e($maincategory->type); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Featured')); ?> <?php echo e(__('messages.category')); ?></th>
                        <td class="fontSize15">
                            <?php if($maincategory->featured == 0 ): ?>
                                <?php echo e(__('messages.No')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Yes')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Subcategory')); ?></th>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('subcategory.show', ['subcategoryId' => $subcategory->id])); ?>" style="cursor: pointer;">
                                <?php echo e($subcategory->name); ?> 
                            </a>
                        </td>
                    </tr>
                </tbody>
                <?php if($taskers != ""): ?>
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                <?php echo e(__('messages.Service')); ?> <?php echo e(__('messages.Taskers')); ?> 
                            </h4>
                        </div>
                        <thead>
                            <tr>
                                <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                                <th class="nosorting"><?php echo e(__('messages.Name')); ?></th>
                                <th class="nosorting"><?php echo e(__('messages.Email')); ?></th>
                                <th class="nosorting"><?php echo e(__('messages.Mobile')); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $index =1; ?>
                            <?php if(!empty($taskers)): ?>
                                <?php $__currentLoopData = $taskers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tasker): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr>
                                        <td class="fontSize15"><?php echo e($index); ?></td>
                                        <td class="fontSize15">
                                            <a href="<?php echo e(route('tasker.show', ['id' => $tasker['_id']])); ?>" style="cursor: pointer;">
                                                <?php echo e($tasker->name); ?>

                                            </a>
                                        </td>
                                        <td class="fontSize15">
                                                <?php echo e($tasker->email); ?>

                                        </td>
                                        <td class="fontSize15">
                                                <?php echo e($tasker->mobile); ?>

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
                <?php endif; ?>
            </table>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/services/show.blade.php ENDPATH**/ ?>