<?php $__env->startSection('title', 'Jobs'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Jobs')); ?></h4>
            </div>
        </div>
        <div class="">
            <form method="GET" action="<?php echo e(route('needs.select')); ?>">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="status-selector" name="search_for" class="form-control">
                            <option value="all" <?php if($search_for === "all") { echo "selected"; } ?>>All</option>
                            <option value="requested"<?php if($search_for === "requested") { echo "selected"; } ?>>Requested</option>
                            <option value="started"<?php if($search_for === "started") { echo "selected"; } ?>>Started</option>
                            <option value="cancelled"<?php if($search_for === "cancelled") { echo "selected"; } ?>>Cancelled</option>
                            <option value="paid"<?php if($search_for === "paid") { echo "selected"; } ?>>Paid</option>
                            <option value="completed"<?php if($search_for === "completed") { echo "selected"; } ?>>Completed</option>
                            <option value="expired"<?php if($search_for === "expired") { echo "selected"; } ?>>Expired</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Name')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Status')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Posted By')); ?></th>
                        <th scope="col"><?php echo e(__('messages.View')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Status')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    <?php if(!empty($userNeeds)): ?>
                        <?php $__currentLoopData = $userNeeds; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $book): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="text-center">
                                <td class="fontSize15"><?php echo e($index); ?></td>
                                <td class="fontSize15">
                                    <?php echo e($book['bookedName']); ?> 
                                </td>
                                <td class="fontSize15"> 
                                    <?php if($expired == 1): ?>
                                        <h5><span class="badge badge-danger">Expired</span></h5>
                                    <?php elseif($book['status'] == 'completed'): ?>
                                        <h5><span class="badge badge-secondary">Completed</span></h5>
                                    <?php elseif($book['status'] == 'cancelled'): ?>
                                        <h5><span class="badge badge-danger">Cancelled</span></h5>
                                    <?php elseif($book['status'] == 'paid'): ?>
                                        <h5><span class="badge badge-success">Paid</span></h5>
                                    <?php elseif($book['status'] == 'started'): ?>
                                        <h5><span class="badge badge-warning">Started</span></h5>
                                    <?php elseif($book['status'] == 'accepted'): ?>
                                        <h5><span class="badge badge-success">Accepted</span></h5>
                                    <?php elseif($book['status'] == 'refunded'): ?>
                                        <h5><span class="badge badge-danger">Refunded</span></h5>
                                    <?php elseif($book['status'] == 'requested'): ?>
                                        <h5><span class="badge badge-primary">Requested</span></h5>
                                    <?php endif; ?>
                                </td>
                                <td class="fontSize15">
                                    <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <?php if($user->_id == $book['userId']): ?>
                                            <?php echo e($user->name); ?>

                                        <?php endif; ?>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </td>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('needs.show', ['id' => $book['_id'] ])); ?>" style="cursor: pointer;"  >
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <?php if($book['needStatus'] == 1): ?>
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($book['_id']); ?>">
                                            <i class="fa fa-lock" title="<?php echo e(trans('messages.Disable')); ?>"></i>
                                        </button>
                                    <?php else: ?> 
                                            <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($book['_id']); ?>">
                                                <i class="fa fa-unlock" title="<?php echo e(trans('messages.Enable')); ?>"></i>
                                            </button>
                                        </a>
                                    <?php endif; ?>
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
        <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
    </div>
     <!-- Modal -->
    <?php $__currentLoopData = $userNeeds; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter-<?php echo e($user['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($user['needStatus'] == 0): ?>
                             <?php echo e(__('messages.Do you want to enable this Job?')); ?>

                        <?php else: ?>
                            <?php echo e(__('messages.Do you want to disable this Job?')); ?> 
                        <?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <?php if($user['needStatus'] == 0): ?>
                            <a href="<?php echo e(route('needs.changeStatus', ['id' => $user['_id'], 'needStatus' => 1 ])); ?>" style="cursor: pointer;" >
                                <button type="button" class="btn btn-success"><?php echo e(__('messages.Enable')); ?></button>
                            </a>
                        <?php else: ?>
                            <a href="<?php echo e(route('needs.changeStatus', ['id' =>  $user['_id'], 'needStatus' => 0 ])); ?>" style="cursor: pointer;" >
                                <button type="button" class="btn btn-danger"><?php echo e(__('messages.Disable')); ?></button>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <script>
        $(document).ready(function () {
            $("#status-selector").change(function(){
                this.form.submit();
            });
        });
    </script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/needs/index.blade.php ENDPATH**/ ?>