<?php $__env->startSection('title', 'Banners'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
        <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
           <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(__('messages.banners')); ?></h4>
            </div>
            <div>
                <a href="<?php echo e(route('bannerimage.create')); ?>">
                    <button class="btn btn-primary align-text-top border-0 m-b10">
                        <i class="fa fa-plus" title="<?php echo e(__('messages.Add')); ?>"></i> 
                        <?php echo e(__('messages.Add')); ?> <?php echo e(__('messages.Banner')); ?>

                    </button>
                </a>
            </div>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr class="text-center">
                        <th scope="col"><?php echo e(__('messages.S.No')); ?></th>
                        <th scope="col"><?php echo e(__('messages.image_url')); ?></th>
                        <th scope="col"><?php echo e(__('messages.Image')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.View')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Edit')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Delete')); ?></th>
                        <th class="nosorting"><?php echo e(__('messages.Action')); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    <?php if(!empty($banners)): ?>
                        <?php $__currentLoopData = $banners; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $banner): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="text-center">
                                <td class="fontSize15"><?php echo e($index); ?></td>
                                <td class="fontSize15">
                                    <a href="<?php echo e($banner['url']); ?>" target="blank" style="color:#000;">
                                        <?php echo e($banner['url']); ?>

                                    </a>
                                </td>
                                <td class="fontSize15"><img src="<?php echo e(url('/media/bannerimages/'.$banner['image'])); ?>" style="height:80px;"></td>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('bannerimage.show', ['id' => $banner['_id'] ])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <a href="<?php echo e(route('bannerimage.edit', ['id' =>$banner['_id']  ])); ?>" style="cursor: pointer;">
                                        <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                                    </a>
                                </td>
                                <td class="fontSize15">
                                    <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2-<?php echo e($banner['_id']); ?>">
                                        <i class="fa fa-trash" title="<?php echo e(trans('messages.delete')); ?>">
                                        </i>
                                    </button>
                                </td>
                                <td class="fontSize15">
                                    <?php if($banner['status'] == 0): ?>
                                        <button class="btn btn-success align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($banner['_id']); ?>">
                                            <i class="fa fa-unlock" title="<?php echo e(trans('messages.Enable')); ?>"></i>
                                        </button>
                                    <?php else: ?>
                                        <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter-<?php echo e($banner['_id']); ?>">
                                            <i class="fa fa-lock" title="<?php echo e(trans('messages.Disable')); ?>"></i>
                                        </button>
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
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>

     <!-- Disable Modal -->
    <?php $__currentLoopData = $banners; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $banner): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter-<?php echo e($banner['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($banner['status'] == 0): ?>
                            <?php echo e(__('messages.Do you want to enable this banner?')); ?>  
                        <?php else: ?>
                            <?php echo e(__('messages.Do you want to disable this banner?')); ?>

                        <?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <?php if($banner['status'] == 0): ?>
                            <a href="<?php echo e(route('bannerimage.activestatus', ['id' => $banner['_id'], 'bannerstatus' => 1 ])); ?>" style="cursor: pointer;">
                                <button type="button" class="btn btn-success"><?php echo e(__('messages.Enable')); ?> </button>
                            </a>
                        <?php else: ?>
                            <a href="<?php echo e(route('bannerimage.activestatus', ['id' =>  $banner['_id'], 'bannerstatus' => 0 ])); ?>" style="cursor: pointer;">
                                <button type="button" class="btn btn-danger"><?php echo e(__('messages.Disable')); ?></button>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    
    <!-- Delete Modal -->
    <?php $__currentLoopData = $banners; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $banner): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter2-<?php echo e($banner['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php echo e(__('messages.Do you want to delete this banner?')); ?>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal"><?php echo e(__('messages.No')); ?></button>
                        <form action="<?php echo e(route('bannerimage.destroy', ['id' => $banner['_id']])); ?>" method="POST">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                            <button class="btn btn-danger align-text-top border-0" data-toggle="modal" data-target="#exampleModalCenter2">
                                <?php echo e(__('messages.Yes')); ?>

                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/bannerimage/index.blade.php ENDPATH**/ ?>