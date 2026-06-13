<?php $__env->startSection('title', 'Service Detail'); ?>
<?php $__env->startSection('content'); ?>
    <div class="boxShadow p-t20 p-b20 p-l15 p-r10 bgWhite m-b20">
    <div class="d-flex justify-content-between  flex-sm-row m-b25 services-new">
           <div>
                <h4 class="m-b25 blueTxtClr p-t10 p-b10 ">Currency details</h4>
            </div>
        </div>
        <div class="table-responsive text-center">
            <table id="example" class="table table-striped table-bordered mytable">
                <tbody>
                    
                    
                    <tr>
                        <th scope="col">currency code</th>
                        <td class="fontSize15"><?php echo e($currencydetail->currencycode); ?></td>
                    </tr>
                    <tr>
                        <th scope="col">Currency symbol</th>
                        <td class="fontSize15"><?php echo e($currencydetail->currencysymbol); ?></td>
                    </tr>
                    
                    <tr>
                        <th scope="col">Price</th>
                        <td class="fontSize15"><?php echo e($currencydetail->price); ?></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('admin.layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/html/resources/views/admin/currency/show.blade.php ENDPATH**/ ?>