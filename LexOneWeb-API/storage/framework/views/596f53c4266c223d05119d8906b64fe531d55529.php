<?php $__env->startSection('title', 'Categories'); ?>
<?php $__env->startSection('content'); ?>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
<div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
    <div>
    <h4 class="blueTxtClr p-t10 p-b10">
        <?php echo e(trans('messages.Categories')); ?>

    </h4>
    </div>
    <div>
        <a href="<?php echo e(route('category.add')); ?>" >
            <button class="btn btn-primary align-text-top border-0 m-b10">
                <i class="fa fa-plus" title="<?php echo e(trans('messages.Add')); ?>"></i> 
                <?php echo e(trans('messages.Add')); ?> <?php echo e(trans('messages.Category')); ?>

            </button>
        </a>
    </div>
</div>
<div class="">
    <form method="GET" action="<?php echo e(route('category.search')); ?>">
        <div class="form-group row">
            <div class="col-lg-2">
                <select id="language-selector" name="search_for" class="form-control">
                    <option value="name" <?php if($search_for === "name") { echo "selected"; } ?>><?php echo e(trans('messages.Name')); ?></option>
                    <option value="type" <?php if($search_for === "type") { echo "selected"; } ?>><?php echo e(trans('messages.Type')); ?></option>
                </select>
            </div>
            <div class="col-lg-6">&nbsp;</div>
            <div class="col-lg-4">
                <div class="input-group mb-3">
                    <input type="text" class="form-control search_filter" value="<?php echo e($search); ?>"  placeholder="<?php echo e(trans('messages.Search categories')); ?>" name="search" autocomplete="off" maxlength="30">
                    <input type="hidden" name="sort" value="created_at">
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
            <tr class="text-center">
                <th scope="col"><?php echo e(trans('messages.S.No')); ?></th>
                <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('name',trans('messages.Name')));?></th>
                <th scope="col"><?php echo \Kyslik\ColumnSortable\SortableLink::render(array ('type',trans('messages.Type')));?></th>
                <th class="nosorting"><?php echo e(trans('messages.View')); ?></th>
                <th class="nosorting"><?php echo e(trans('messages.Edit')); ?></th>
                <th class="nosorting"><?php echo e(trans('messages.Action')); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php $index =1; ?>
            <?php if(!empty($categoryrecords)): ?>
                <?php $__currentLoopData = $categoryrecords; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="text-center">
                        <td class="fontSize15"><?php echo e($index); ?></td>
                        <td class="fontSize15"><?php echo e($category['name']); ?></td>
                        <td class="fontSize15"><?php echo e($category['type']); ?></td>
                        <td class="fontSize15 text-center">
                            <a href="<?php echo e(route('category.show', ['categoryId' => $category['_id']])); ?>" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center">
                            <a href="<?php echo e(route('category.edit', ['categoryId' => $category['_id'], ])); ?>" style="cursor: pointer;">
                                <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                            </a>
                        </td>
                        <td class="fontSize15 text-center">
                            <?php if($category['status'] == 0): ?>
                            <a href="<?php echo e(route('category.activestatus', ['categoryId' => $category['_id'], 'categoryStatus' =>1 ])); ?>" style="cursor: pointer;">
                                <button class="btn btn-success align-text-top border-0"><i class="fa fa-unlock" title="<?php echo e(trans('messages.Enable')); ?>"></i></button>
                            </a>
                            <?php else: ?>
                            <a href="<?php echo e(route('category.activestatus', ['categoryId' => $category['_id'], 'categoryStatus' =>0 ])); ?>" style="cursor: pointer;">
                                <button class="btn btn-danger align-text-top border-0"><i class="fa fa-lock" title="<?php echo e(trans('messages.Disable')); ?>"></i></button>
                            </a>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php $index++; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <?php else: ?>
            <tr>
                <td colspan="8"><?php echo e(trans('messages.No records found')); ?></td>
            </tr>
            <?php endif; ?>
        </tbody>
    </table>
    <div class="pagination-wrapper"> <?php echo $pagination->render(); ?> </div>
</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/categories/index.blade.php ENDPATH**/ ?>