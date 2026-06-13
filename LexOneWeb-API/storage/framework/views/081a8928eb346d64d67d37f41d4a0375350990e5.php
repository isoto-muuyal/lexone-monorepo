<?php $__env->startSection('title', 'Users'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
            <div>
                <h4 class="blueTxtClr p-t10 p-b10"><?php echo e($approved == 1 ? "Approved" : ($approved == 0 ? "Verification" : "Deleted")); ?> <?php echo e(__('messages.Users')); ?> </h4>
            </div>
            <div>
                <?php
                    $exportUrl = $approved == 1
                        ? route('user.export', ['filter' => 'approved'])
                        : ($approved == 0
                            ? route('user.export', ['filter' => 'pending'])
                            : route('user.export'));
                ?>
                <a href="<?php echo e($exportUrl); ?>">
                    <button class="btn btn-success align-text-top border-0 m-b10">
                        <i class="fa fa-download"></i> Export CSV
                    </button>
                </a>
            </div>
        </div>
        <div class="">
            <?php if($approved == 0): ?>
                <form method="GET" action="<?php echo e(route('user.search',['user' => $user = 'pending'])); ?>">
            <?php elseif($approved == 1): ?>
                <form method="GET" action="<?php echo e(route('user.search',['user' => $user = 'approved'])); ?>">
            <?php else: ?>
                <form method="GET" action="<?php echo e(route('user.search')); ?>">
            <?php endif; ?>
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="language-selector" name="search_for" class="form-control">
                            <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>><?php echo e(trans('messages.Name')); ?></option>
                            <option value="email" <?php if($search_for === "email") { echo "selected"; } ?>><?php echo e(trans('messages.Email')); ?></option>
                            <option value="mobile" <?php if($search_for === "mobile") { echo "selected"; } ?>><?php echo e(trans('messages.Mobile')); ?></option>
                        </select>
                    </div>
                    <div class="col-lg-6">&nbsp;</div>
                    <div class="col-lg-4">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control search_filter"  name="search" autocomplete="off" placeholder="<?php echo e(trans('messages.Search users')); ?>"  value="<?php echo e($search); ?>" maxlength="30">
                            <input type="hidden" name="sort" value="createdAt">
                            <input type="hidden" name="direction" value="desc">
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit"><?php echo e(trans('messages.Search')); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="table-responsive">
            <table id="example" class="table table-striped table-bordered w-100 mytable">
                <thead>
                    <tr>
                        <th scope="col"><?php echo e(trans('messages.S.No')); ?></th>
                        <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('name',trans('messages.Name')));?></th>
                        <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('email',trans('messages.Email')));?></th>
                        <th class="nosorting"><?php echo e(trans('messages.View')); ?></th>
                        <th class="nosorting"><?php echo e(trans('messages.Edit')); ?></th>
                        <th class="nosorting">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $index =1; ?>
                    <?php if(!empty($userrecords)): ?>
                    <?php $__currentLoopData = $userrecords; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if($user['email'] !== 'user@idemand.com'): ?>
                    <tr>
                        <td class="fontSize15"><?php echo e($index); ?></td>
                        <td class="fontSize15"><?php echo e($user['name']); ?></td>
                        <td class="fontSize15"><?php echo e($user['email']); ?></td>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('user.show', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15">
                            <a href="<?php echo e(route('user.edit', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0">
                                    <i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i>
                                </button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center" style="white-space:nowrap;">
                            <?php if($user['status'] === 0): ?>
                                <button class='btn btn-success btn-sm align-text-top border-0' title="Enable account" data-toggle="modal" data-target="#exampleModalCenter<?php echo e($index); ?>">
                                    <i class="fa fa-unlock"></i>
                                </button>
                            <?php elseif($user['status'] === 1): ?>
                                <button class='btn btn-warning btn-sm align-text-top border-0' title="Disable account" data-toggle="modal" data-target="#exampleModalCenter<?php echo e($index); ?>">
                                    <i class="fa fa-lock"></i>
                                </button>
                            <?php else: ?>
                                <button class='btn btn-secondary btn-sm align-text-top border-0' title="Restore account" data-toggle="modal" data-target="#exampleModalCenter<?php echo e($index); ?>">
                                    <i class="fa fa-undo"></i>
                                </button>
                            <?php endif; ?>
                            <?php if($approved != 2): ?>
                                <button class='btn btn-danger btn-sm align-text-top border-0' title="Delete user" data-toggle="modal" data-target="#deleteModal-<?php echo e($user['_id']); ?>">
                                    <i class="fa fa-trash"></i>
                                </button>
                            <?php else: ?>
                                <button class='btn btn-danger btn-sm align-text-top border-0' title="Permanently delete user and all related data" data-toggle="modal" data-target="#destroyModal-<?php echo e($user['_id']); ?>">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php $index++; ?>
                    <?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    <?php else: ?>
                    <tr>
                        <td colspan="6"><?php echo e(trans('messages.No records found')); ?></td>
                    </tr>
                    <?php endif; ?>
                    
                </tbody>
            </table>
            <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
        </div>
    </div>
    <!-- Modal -->
    <?php $modalindex =1; ?>
    <?php $__currentLoopData = $userrecords; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="modal fade" id="exampleModalCenter<?php echo e($modalindex); ?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle"><?php echo e(__('messages.Are You Sure')); ?></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <?php if($user['status'] == 0): ?>
                            <?php echo e(__('messages.Do you want to enable this account?')); ?>  
                        <?php elseif($user['status'] == 1): ?>
                            <?php echo e(__('messages.Do you want to disable this account?')); ?>  
                        <?php else: ?>
                            <?php echo e(__('messages.Do you want to restore this account?')); ?>

                        <?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <?php if($user['status'] == 0): ?>
                            <a href="<?php echo e(route('user.changeuserstatus', ['userId' => $user['userId'], 'userStatus' =>1 ])); ?>" style="cursor: pointer;">
                                <button type="button"  class="btn btn-success"><?php echo e(__('messages.Enable')); ?> </button>
                            </a>
                        <?php elseif($user['status'] == 1): ?>
                             <a href="<?php echo e(route('user.changeuserstatus', ['userId' => $user['userId'], 'userStatus' => 0 ])); ?>" style="cursor: pointer;">
                                <button type="button" class="btn btn-danger"><?php echo e(__('messages.Disable')); ?></button>
                            </a>
                        <?php else: ?>
                             <a href="<?php echo e(route('user.restore', ['id' => $user['_id']])); ?>" style="cursor: pointer;">
                                <button type="button"  class="btn btn-warning"><?php echo e(__('messages.Restore')); ?> </button>
                            </a>
                            
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <?php $modalindex++; ?>

        <?php if($approved != 2): ?>
        
        <div class="modal fade" id="deleteModal-<?php echo e($user['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="deleteModalTitle-<?php echo e($user['_id']); ?>" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalTitle-<?php echo e($user['_id']); ?>">Delete User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete <strong><?php echo e($user['name']); ?></strong>?
                        Their account will be moved to the deleted list and they will no longer be able to log in.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <a href="<?php echo e(route('user.softdelete', ['id' => $user['_id']])); ?>">
                            <button type="button" class="btn btn-danger">Delete</button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <?php else: ?>
        
        <?php $dep = ($dependencyInfo ?? [])[$user['_id']] ?? ['reviews' => 0, 'devices' => 0]; ?>
        <div class="modal fade" id="destroyModal-<?php echo e($user['_id']); ?>" tabindex="-1" role="dialog" aria-labelledby="destroyModalTitle-<?php echo e($user['_id']); ?>" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="destroyModalTitle-<?php echo e($user['_id']); ?>">Permanently Delete User</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>This action is <strong>irreversible</strong>. Permanently deleting <strong><?php echo e($user['name']); ?></strong> will also remove:</p>
                        <ul>
                            <li><strong><?php echo e($dep['reviews']); ?></strong> review(s) written by this user</li>
                            <li><strong><?php echo e($dep['devices']); ?></strong> device token(s)</li>
                        </ul>
                        <p class="text-muted"><small>Booking history is preserved for accounting purposes.</small></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <form action="<?php echo e(route('user.destroy', ['id' => $user['_id']])); ?>" method="POST" style="display:inline;">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                            <button type="submit" class="btn btn-danger">Permanently Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/users/index.blade.php ENDPATH**/ ?>