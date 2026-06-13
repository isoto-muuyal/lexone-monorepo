<?php $__env->startSection('title', 'User Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">
                    <?php echo e($user->name); ?>

                    <?php if($user->onlineStatus == 0): ?>
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
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Image')); ?></th>
                        <td class="fontSize15">
                            <?php if($user->image): ?>
                                <img src="<?php echo e(url('/media/users/'.$user->image)); ?>" style="height:80px;">
                            <?php else: ?>
                                <img src="<?php echo e(url('/media/users/user.png')); ?>" style="height:80px;">
                            <?php endif; ?>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Email')); ?></th>
                        <td class="fontSize15">
                            <?php echo e($user['email']); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Joined Date')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($userJoined); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Device Platform')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($user->devicePlatform); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Bookings')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($bookingCount); ?>

                        </td>
                    </tr>
                    <tr>
                        <th scope="col"><?php echo e(__('messages.Posted Jobs')); ?></th>
                        <td class="fontSize15">
                                <?php echo e($userJobs); ?>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script>
        var lastActive = <?php echo json_encode($lastActive); ?>;
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var localtime = d.setUTCSeconds(lastActive);
        document.getElementById("myText").innerHTML = localtime;
    </script>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/users/show.blade.php ENDPATH**/ ?>