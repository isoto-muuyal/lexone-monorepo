<?php $__env->startSection('title', 'Cities'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <?php if($settings->instantLocation == 'false'): ?>
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
            <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.City')); ?> <?php echo e(__('messages.Settings')); ?></h4>
                </div>
                <div>
                    <a href="<?php echo e(route('location.create')); ?>">
                        <button class="btn btn-primary align-text-top border-0 m-b10">
                            <i class="fa fa-plus" title="<?php echo e(__('messages.Add')); ?>"></i> 
                            <?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Location')); ?>

                        </button>
                    </a>
                </div>
            </div>
            <div class="">
                <form method="GET" action="<?php echo e(route('location.search')); ?>">
                    <div class="form-group row">
                        <div class="col-lg-2">
                            <select id="language-selector" name="search_for" class="form-control">
                                <option value="city" <?php if($search_for === "city") { echo "selected"; } ?>><?php echo e(__('messages.City')); ?></option>
                                <option value="state" <?php if($search_for === "state") { echo "selected"; } ?>><?php echo e(__('messages.State')); ?></option>
                            </select>
                        </div>
                        <div class="col-lg-6">&nbsp;</div>
                        <div class="col-lg-4">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control search_filter" value="<?php echo e($search); ?>"  placeholder="<?php echo e(__('messages.Search Location')); ?>" name="search" autocomplete="off" maxlength="30">
                                <input type="hidden" name="sort" value="createdAt">
                                <input type="hidden" name="direction" value="desc">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit"><?php echo e(__('messages.Search')); ?></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="table-responsive">
                <table id="example" class="table table-striped table-bordered w-100 mytable">
                    <thead>
                        <tr class="text-center">
                            <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                            <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('city',trans('messages.City')));?></th>
                            <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('state',trans('messages.State')));?></th>
                            <th class="nosorting"><?php echo e(__('messages.Country')); ?></th>
                            <th class="nosorting"><?php echo e(__('messages.Delete')); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $index =1; ?>
                        <?php if(!empty($cities)): ?>
                            <?php $__currentLoopData = $cities; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $city): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr class="text-center">
                                    <td class="fontSize15"><?php echo e($index); ?></td>
                                    <td class="fontSize15">
                                        <?php echo e($city['city']); ?>

                                    </td>
                                    <td class="fontSize15">
                                        <?php echo e($city['state']); ?>

                                    </td>
                                    <td class="fontSize15">
                                        <?php echo e($city['country']); ?>

                                    </td>
                                    <td class="fontSize15">
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($city['_id']); ?>">
                                            <i class="fa fa-trash" title="<?php echo e(__('messages.delete')); ?>">
                                            </i>
                                        </button>
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
    <?php else: ?>
        <form action="<?php echo e(route('location.store')); ?>" method="post" enctype="multipart/form-data">
            <?php echo csrf_field(); ?>
            <h4 class="m-b25  blueTxtClr p-t10 p-b10"><?php echo e(__('messages.Location Settings')); ?></h4>
            <div class="form-group">
                <label><?php echo e(__('messages.Max distance coverage to find Tasker')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <div class="input-group mb-2">
                        <input type="number" class="form-control" min="1" step=".01"  name="maxDistance"  value="<?php echo e($settings->maxDistance); ?>" placeholder="<?php echo e(__('messages.Maximum radius coverage')); ?>" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text">km</div>
                        </div>
                    </div>
                    <?php if($errors->has('maxDistance')): ?><p class="text-danger"><?php echo e($errors->first('maxDistance')); ?></p><?php endif; ?>
                </div>	
                <label><?php echo e(__('messages.Max distance for ride')); ?></label><span class="text-danger">*</span>  
                <div class="form-group field-public_key">
                    <div class="input-group mb-2">
                        <input type="number" class="form-control" min="1" step=".01"  name="rideDistance"  value="<?php echo e($settings->rideDistance); ?>" placeholder="<?php echo e(__('messages.Ride Radius Coverage')); ?>" required>
                        <div class="input-group-prepend">
                            <div class="input-group-text">km</div>
                        </div>
                    </div>
                    <?php if($errors->has('rideDistance')): ?><p class="text-danger"><?php echo e($errors->first('rideDistance')); ?></p><?php endif; ?>
                </div>		
            </div>
            <div class="m-t20">
                <button type="submit" class="btn btn-primary align-text-top border-0 m-b10">Save</button>      
            </div>
        </form>
    <?php endif; ?>
    <!-- Modal -->
    <?php $__currentLoopData = $cities; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $city): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter-<?php echo e($city['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php echo e(__('messages.Are you sure you want to delete this item?')); ?>

                    </div>
                    <div class="modal-footer">
                    <form action="<?php echo e(route('location.destroy', ['id' => $city['_id']])); ?>" method="POST">
                        <?php echo csrf_field(); ?>
                        <?php echo method_field('DELETE'); ?>
                        <button class="btn btn-danger align-text-top border-0">
                            <?php echo e(__('messages.delete')); ?>

                        </button>
                    </form>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/location/index.blade.php ENDPATH**/ ?>