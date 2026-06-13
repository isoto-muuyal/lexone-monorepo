<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title> <?php echo e(env('APP_NAME')); ?>  | <?php echo $__env->yieldContent('title'); ?></title>
    <link rel="stylesheet" href="<?php echo e(URL::asset('public/admin_assets/scss/bootstrap.min.css')); ?>">
    <link rel="icon" href="<?php echo e(URL::asset('media/admin_assets/fav-icon')); ?>">
    <link rel="stylesheet" href="<?php echo e(URL::asset('public/admin_assets/scss/style.css')); ?>">
    <style>
        .bgBlue{
          background: #F14E16 !important;
      }
  </style>
</head>
<body>
    <?php echo $__env->yieldContent('content'); ?>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/jquery.min.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/bootstrap.min.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/popper.min.js')); ?>"></script>
</body>
</html><?php /**PATH /var/www/html/resources/views/admin/layouts/main.blade.php ENDPATH**/ ?>