<?php $__env->startSection('title', 'Currency'); ?>
<?php $__env->startSection('content'); ?>
<?php use App\Models\Category; ?>
<div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
        <div>
            <!-- <h4 class="blueTxtClr p-t10 p-b10"><?php echo e(trans('messages.Services')); ?></h4> -->
            <h4 class="blueTxtClr p-t10 p-b10">Currency</h4>
        </div>
        <div>
            <a href="<?php echo e(route('currency.add')); ?>">
                <button class="btn btn-primary align-text-top border-0 m-b10">
                    <i class="fa fa-plus" title="<?php echo e(trans('messages.Add')); ?>"></i>
                    <?php echo e(trans('messages.Add')); ?> Currency
                </button>
            </a>
        </div>
    </div>
    <!-- <div class="">
        <div class="form-group row">
            <div class="input-group-append">
                <a href="<?php echo e(route('currency.default')); ?>" class="btn btn-primary">Set default currency</a>
            </div>
        </div>
    </div> -->
    <!-- <div class="">
            <form method="GET" action="<?php echo e(route('service.search')); ?>">
                <div class="form-group row">
                    <div class="col-lg-2">
                        <select id="language-selector" name="search_for" class="form-control">
                            <option value="name" <?php if ($search_for === "name") {
                                                        echo "selected";
                                                    } ?>><?php echo e(trans('messages.Name')); ?></option>
                        </select>
                    </div>
                    <div class="col-lg-6">&nbsp;</div>
                    <div class="col-lg-4">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control search_filter" value="<?php echo e($search); ?>" placeholder="Search currency" name="search" autocomplete="off" maxlength="30">
                            <input type="hidden" name="sort" value="createdAt">
                            <input type="hidden" name="direction" value="desc">
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit"><?php echo e(trans('messages.Search')); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div> -->
    <div class="table-responsive">
        <table id="example" class="table table-striped table-bordered w-100 mytable">
            <thead>
                <tr class="text-center">
                    <th scope="col"><?php echo e(trans('messages.S.No')); ?></th>
                    <th scope="col">Currency code</th>
                    <th scope="col">Currency Symbol</th>
                    <th scope="col">Price</th>
                    <th class="nosorting"><?php echo e(trans('messages.View')); ?></th>
                    <th class="nosorting"><?php echo e(trans('messages.Edit')); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php $index =1; ?>
                <?php if(!empty($currencyrecords)): ?>
                <?php $__currentLoopData = $currencyrecords; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $currency): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr class="text-center">
                    <td class="fontSize15"><?php echo e($index); ?></td>
                    <td class="fontSize15"><?php echo e($currency['currencycode']); ?></td>
                    <td class="fontSize15"><?php echo e($currency['currencysymbol']); ?></td>
                    <td class="fontSize15"><?php echo e($currency['price']); ?></td>
                    <td class="fontSize15 text-center">
                        <a href="<?php echo e(route('currency.show', ['currencyId' => $currency['_id']])); ?>" style="cursor: pointer;">
                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-eye" title="<?php echo e(trans('messages.Show')); ?>"></i></button>
                        </a>
                    </td>
                    <td class="fontSize15">
                        <a href="<?php echo e(route('currency.edit', ['currencyId' => $currency['_id'] ])); ?>" style="cursor: pointer;">
                            <button class="btn btn-info align-text-top border-0"><i class="fa fa-edit" title="<?php echo e(trans('messages.Edit')); ?>"></i></button>
                        </a>
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
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/currency/index.blade.php ENDPATH**/ ?>