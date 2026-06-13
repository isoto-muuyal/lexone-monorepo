<?php $__env->startSection('title', 'User Detail'); ?>
<?php $__env->startSection('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/ckeditor.js')); ?>"></script>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    <?php echo e($tasker->name); ?>

                    <?php if($tasker->rating): ?>
                        <a href="<?php echo e(route('review.index', ['taskerid' => $tasker['_id']])); ?>" style="font-size:14px;">
                            (<?php echo e($tasker->rating); ?> <i class="fa fa-star" aria-hidden="true"></i>)
                        </a>
                    <?php else: ?>
                        (<?php echo e(__('messages.No Rating')); ?>)
                    <?php endif; ?>
                    <?php if($tasker->onlineStatus == 0): ?>
                        <p style="font-size:14px;"><i class="fa fa-circle" aria-hidden="true" style="color:#808080;font-size:14px;"></i> <?php echo e(__('messages.Last seen')); ?> : <?php echo e($lastActive); ?></p>
                    <?php else: ?>
                        <p style="font-size:14px;"><i class="fa fa-circle"  aria-hidden="true" style="color:#008000;font-size:14px;"></i><?php echo e(__('messages.Online')); ?></p>
                    <?php endif; ?>
                </h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    <?php if(!empty($tasker->about)): ?>
                        <tr>
                            <th scope="col">
                                <?php echo e(__('messages.About')); ?>

                            </th>
                            <td class="fontSize15">
                                <?php echo e($tasker->about); ?>

                            </td>
                        </tr>
                    <?php endif; ?>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Image')); ?>

                        </th>
                        <?php if(!empty($tasker->image)): ?>
                            <td class="fontSize15">
                                <img src="<?php echo e(url('/media/taskers/'.$tasker->image)); ?>" style="height:80px;">
                            </td>
                        <?php else: ?>
                            <td class="fontSize15">
                                <p>Image Unavailable</p>
                            </td>
                        <?php endif; ?>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Email')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($tasker->email); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Location')); ?>

                        </th>
                        <?php if($tasker->location): ?>
                            <td class="fontSize15">
                                <?php echo e($tasker->location); ?>

                            </td>
                        <?php else: ?>
                            <td class="fontSize15">
                                <?php echo e(__('messages.No Location')); ?>

                            </td>
                        <?php endif; ?>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Mobile')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($tasker->mobile); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Status')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php if($tasker->status == 0 ): ?>
                                <?php echo e(__('messages.Disabled')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Enabled')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Verification Status')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php if($tasker->verified == 0 ): ?>
                                <?php echo e(__('messages.Unverified')); ?>

                            <?php else: ?>
                                <?php echo e(__('messages.Verified')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Portfolio')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php $__empty_1 = true; $__currentLoopData = $documents; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $document): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                <a href=# data-toggle="modal" data-target="#exampleModal<?php echo e($document->id); ?>"> 
                                    <img src="<?php echo e(url('/media/portfolio/'.$document->media_name)); ?>" style="height:40px;width:40px;">
                                </a>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                <?php echo e(__('messages.No Portfolio')); ?>

                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Tasks Completed')); ?>

                        </th>
                        <td class="fontSize15">
                           <?php echo e($totalJobs); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col">
                            <?php echo e(__('messages.Earnings')); ?>

                        </th>
                        <td class="fontSize15">
                            <?php echo e($currencySymbol); ?> <?php echo e($revenue); ?>

                        </td>
                    </tr>
                    <?php if($reward): ?>
                        <tr>
                            <th scope="col">
                                <?php echo e(__('messages.Rewards')); ?>

                            </th>
                            <td class="fontSize15">
                                <?php echo e($currencySymbol); ?> <?php echo e($reward); ?>

                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
                <?php if($services != null): ?>
                    <table class="table table-striped table-bordered w-100 mytable">
                        <div>
                            <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                                <?php echo e(__('messages.Tasker')); ?> <?php echo e(__('messages.Service')); ?>

                            </h4>
                        </div>
                        <thead>
                            <tr>
                                <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                                <th class="nosorting"><?php echo e(__('messages.Service')); ?></th>
                                <th class="nosorting"><?php echo e(__('messages.Price')); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $index =1; ?>
                            <?php if(!empty($pricings)): ?>
                                <?php $__currentLoopData = $pricings; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $pricing): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr>
                                        <td class="fontSize15"><?php echo e($index); ?></td>
                                        <td class="fontSize15">
                                            <?php $__currentLoopData = $services; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $service): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                <?php if($service->_id == $pricing['serviceId']): ?>
                                                <a href="<?php echo e(route('service.show', ['serviceId' => $service['_id']])); ?>" style="cursor: pointer;">
                                                    <?php echo e($service->name); ?>

                                                </a>
                                                <?php endif; ?>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                        </td>
                                        <td class="fontSize15"><?php echo e($currencySymbol); ?> <?php echo e($pricing['price']); ?></td>
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
    <?php $__currentLoopData = $documents; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $document): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?> 
        <div class="modal fade" id="exampleModal<?php echo e($document->id); ?>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">              
                    <div class="modal-body">
                        <p><?php echo e($document->media_name); ?></p>
                        <img src="<?php echo e(url('/media/portfolio/'.$document->media_name)); ?>" class="imagepreview img-responsive center-block" style="width:100%; position:center;" >
                    </div>
                </div>
            </div>
        </div>  
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
   
    <script>
        var lastActive = <?php echo json_encode($lastActive); ?>;
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var localtime = d.setUTCSeconds(lastActive);
        document.getElementById("myText").innerHTML = localtime;
    </script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/taskers/show.blade.php ENDPATH**/ ?>