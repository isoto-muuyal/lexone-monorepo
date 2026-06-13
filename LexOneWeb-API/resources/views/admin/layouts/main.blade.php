<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title> {{env('APP_NAME')}}  | @yield('title')</title>
    <link rel="stylesheet" href="{{ URL::asset('public/admin_assets/scss/bootstrap.min.css') }}">
    <link rel="icon" href="{{ URL::asset('media/admin_assets/fav-icon') }}">
    <link rel="stylesheet" href="{{ URL::asset('public/admin_assets/scss/style.css') }}">
    <style>
        .bgBlue{
          background: #F14E16 !important;
      }
  </style>
</head>
<body>
    @yield('content')
    <script src="{{ URL::asset('public/admin_assets/js/jquery.min.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/js/bootstrap.min.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/js/popper.min.js') }}"></script>
</body>
</html>