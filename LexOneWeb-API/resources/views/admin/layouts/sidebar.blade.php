<?php
use App\Models\Setting;
$settings = Setting::orderBy('_id', 'desc')->first();
?>
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
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" >
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="{{ URL::asset('public/admin_assets/toastr/toastr.min.css') }}" />
  <script src="{{ URL::asset('public/admin_assets/js/jquery-3.5.1.min.js') }}" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="{{ URL::asset('public/admin_assets/js/jquery.min.js') }}"></script>
  <script src="{{ URL::asset('public/admin_assets/toastr/toastr.min.js') }}"></script>
  <style>
    .pace {
      -webkit-pointer-events: none;
      pointer-events: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
    }
    .pace-inactive {
      display: none;
    }
    .pace .pace-progress {
      background: #0A214D;
      position: fixed;
      z-index: 2000;
      top: 0;
      right: 100%;
      width: 100%;
      height: 3px;
    }
    #toast-container > div { opacity:1; }
  </style>
</head>
<body class="rtl">
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar">
      <div class="sidebar-header text-center">
        <a href="{{ route('dashboard.home') }}">
          <img src="{{url('/media/admin_assets/logo.png')}}" class="height40">
        </a>
      </div>
      <ul class="list-unstyled components">
        <li class="{{ Request()->routeIs('dashboard.home') ? 'active' : '' }}">
          <a href="{{ route('dashboard.home') }}">
            <span class="new-icons">
              <i class="fa fa-folder-o" aria-hidden="true"></i>
            </span>
            {{ __('messages.Dashboard')}}
          </a>
        </li>
        @can('insights')
          <li class="{{ Request()->routeIs('dashboard.insights') ? 'active' : '' }}">
            <a href="{{ route('dashboard.insights') }}">
              <span class="new-icons">
                <i class="fa fa-bar-chart" aria-hidden="true"></i>
              </span>
              {{ __('messages.Insights')}}
            </a>
          </li>
        @endcan
        @can('notification')
          <li class="{{ Request()->routeIs('admin.notification*') ? 'active' : '' }}">
            <a href="{{route('admin.notification')}}">
              <span class="new-icons">
                <i class="fa fa-bell-o" aria-hidden="true"></i>
              </span>
              {{ __('messages.Push Notification')}}
            </a>
          </li>
        @endcan
        @can('roles')
          <li class="{{ Request()->routeIs('role*')|| Request()->routeIs('admin*') ? 'active' : '' }}">
            <a href="#Items" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-list" aria-hidden="true"></i>
              </span>
                {{ __('messages.Roles & Moderators')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ ((Request::segment(2)=== 'roles') || (Request::segment(2)=== 'moderators') )  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="Items">
                <li>
                    <a href="{{ route('role.index') }}">{{ __('messages.Roles')}}</a>
                </li>
                <li>
                    <a href="{{ route('admin.index') }}">{{ __('messages.Moderators')}}</a>
                </li>
            </ul>
          </li>
        @endcan
        @can('users')
          <li class="{{ Request()->routeIs('user*') ? 'active' : '' }}">
            <a href="#user" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-users" aria-hidden="true"></i>
              </span>
              {{ __('messages.Users')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ (Request::segment(2)=== 'users')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="user">
              <li>
                <a href="{{ route('user.index',['user' => $user ='approved']) }}">{{ __('messages.Approved')}} {{ __('messages.Users')}}</a>
              </li>
              <li>
                <a href="{{ route('user.index',['user' => $user ='pending']) }}">{{ __('messages.Pending')}} {{ __('messages.Users')}}</a>
              </li>
              <li>
                <a href="{{ route('user.index') }}">{{ __('messages.Deleted')}} {{ __('messages.Users')}}</a>
              </li>
            </ul>
          </li>
        @endcan
        @can('Taskers')
          <li class="{{ Request()->routeIs('tasker*') ? 'active' : '' }}">
            <a href="#Taskers" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-server" aria-hidden="true"></i>
              </span>
              {{ __('messages.Taskers')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ (Request::segment(2)=== 'Taskers')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="Taskers">
              <li>
                <a href="{{ route('tasker.index',['tasker' => $tasker ='approved']) }}">{{ __('messages.Verified')}} {{ __('messages.Taskers')}}</a>
              </li>
              <li>
                <a href="{{ route('tasker.index',['tasker' => $tasker ='pending']) }}">{{ __('messages.Unverified')}} {{ __('messages.Taskers')}}</a>
              </li>
              <li>
                <a href="{{ route('tasker.index') }}">{{ __('messages.Deleted')}} {{ __('messages.Taskers')}}</a>
              </li>
            </ul>
          </li>
        @endcan
        @can('categories')
          <li class="{{ Request()->routeIs('category*') ? 'active' : '' }}">
            <a href="{{ route('category.home') }}">
              <span class="new-icons">
                <i class="fa fa-th-large" aria-hidden="true"></i>
              </span>
              {{ __('Categories') }}
            </a>
          </li>
        @endcan
        @can('subcategories')
          <li class="{{ Request()->routeIs('subcategory*') ? 'active' : '' }}">
            <a href="{{ route('subcategory.home') }}">
              <span class="new-icons">
                <i class="fa fa-sitemap" aria-hidden="true"></i>
              </span>
              {{ __('messages.Subcategories')}}
            </a>
          </li>
        @endcan
        @can('services')
          <li class="{{ Request()->routeIs('service*') ? 'active' : '' }}">
            <a href="{{ route('service.home') }}">
              <span class="new-icons">
                <i class="fa fa-cogs" aria-hidden="true"></i>
              </span>
              {{ __('messages.Services')}}
            </a>
          </li>
        @endcan
        @can('needs')
          <li class="{{ Request()->routeIs('needs*') ? 'active' : '' }}">
            <a href="{{ route('needs.index') }}">
              <span class="new-icons">
                <i class="fa fa-wrench" aria-hidden="true"></i>
              </span>
              {{ __('messages.Jobs')}}
            </a>
          </li>
        @endcan
        @can('bookings')
          <li class="{{ Request()->routeIs('booking*') ? 'active' : '' }}">
            <a href="{{ route('booking.index') }}">
              <span class="new-icons">
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </span>
              {{ __('messages.Bookings')}}
            </a>
          </li>
        @endcan
        @can('settlement')
          <li class="{{ Request()->routeIs('settlement*') ? 'active' : '' }}">
            <a href="#settlement" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-server" aria-hidden="true"></i>
              </span>
              {{ __('messages.Settlement')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ (Request::segment(2)=== 'settlement')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="settlement">
              <li>
                <a href="{{ route('settlement.paid') }}">{{ __('messages.Paid')}} {{ __('messages.Settlement')}}</a>
              </li>
              <li>
                <a href="{{ route('settlement.index') }}">{{ __('messages.Unpaid')}} {{ __('messages.Settlement')}}</a>
              </li>
            </ul>
          </li>
        @endcan
        @can('sitesettings')
          <li class="{{ Request()->routeIs('app*') || Request()->routeIs('location*') || Request()->routeIs('email*') || Request()->routeIs('notification*') || Request()->routeIs('payment*') || Request()->routeIs('sitesettings*') || Request()->routeIs('social-link*') ? 'active' : '' }}">
            <a href="#setting" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-cog" aria-hidden="true"></i>
              </span>
              {{ __('messages.Settings')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ ((Request::segment(2)=== 'sitesettings') || (Request::segment(2)=== 'banners'))  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="setting">
              <li>
                <a href="{{ route('sitesettings.index') }}">{{ __('messages.Site Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('currency.index') }}">{{ __('messages.Currency settings')}}</a>
              </li>
              <li>
                <a href="{{ route('app.create') }}">{{ __('messages.App')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('appupdate.create') }}">{{ __('messages.App')}} {{ __('messages.Update')}}</a>
              </li>
              <li>
                <a href="{{ route('payment.create') }}">{{ __('messages.Payment')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('bannerimage.index') }}">{{ __('messages.Banner')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('notification.create') }}">{{ __('messages.Notification')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('email.create') }}">{{ __('messages.Email')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('location.index') }}">{{ __('messages.City')}} {{ __('messages.Settings')}}</a>
              </li>
              <li>
                <a href="{{ route('social-link.create') }}">{{ __('messages.Social Link')}} {{ __('messages.Settings')}}</a>
              </li>
              <?php
              if($settings->googleadsense == 'true') { ?>
              <li>
              <a href="{{ route('adsense.create') }}">{{ __('messages.Adsense')}} {{ __('messages.Settings')}}</a>
              </li>
              <?php } ?>
            </ul>
          </li>
        @endcan
        @can('help')
          <li class="{{ Request()->routeIs('help*') ? 'active' : '' }}">
            <a href="{{ route('help.index') }}">
              <span class="new-icons">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
              </span>
              {{ __('messages.Help')}}
            </a>
          </li>
        @endcan
        @can('privacy')
          <li class="{{ Request()->routeIs('privacy*') || Request()->routeIs('terms*')  ? 'active' : '' }}">
            <a href="#terms" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
              </span>
              {{ __('messages.Terms and Policies')}} <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="{{ ((Request::segment(2)=== 'privacy-policy') || (Request::segment(2)=== 'terms'))  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu' }}" id="terms">
              <li>
                <a href="{{ route('privacy.create', ['id' => 'Tasker','lang'=>'en' ]) }}">{{ __('messages.Tasker Privacy Policy')}}</a>
              </li>
              <li>
                <a href="{{ route('privacy.create', ['id' => 'User','lang'=>'en' ]) }}">{{ __('messages.User Privacy Policy')}}</a>
              </li>
              <li>
                <a href="{{ route('terms.create', ['id' => 'Tasker','lang'=>'en' ]) }}">{{ __('messages.Tasker Terms')}}</a>
              </li>
              <li>
                <a href="{{ route('terms.create', ['id' => 'User','lang'=>'en' ]) }}">{{ __('messages.User Terms')}}</a>
              </li>
            </ul>
          </li>
        @endcan
      </ul>
    </nav>
    <!-- Page Content  -->
    <div id="content">
      <nav class="navbar navbar-expand-lg navbar-light pl-0 pr-0 m-b15 mynavbar">
        <div class="d-flex justify-content-between container-fluid pl-0 p-r15">
          <div class="d-flex">
            <button type="button" id="sidebarCollapse" class="d-flex d-inline-block  d-lg-none d-xl-none btn blueTxtClr fontSize30 boxShadowNone d-none justify-content-center align-items-center border-0">
              <i class="mdi mdi-menu"></i>
            </button>
            <div class="align-self-center select_language" >
              <select id="language-selector" class="form-control" onChange="switchlang()">
                <option value="en"<?php if (Session::get('locale') === "en") {echo "selected";}?>>{{ __('English') }}</option>
                <option value="fr"<?php if (Session::get('locale') === "fr") {echo "selected";}?>>{{ __('French') }}</option>
              </select>
            </div>
          </div>
          <div class="align-self-center">
            <div class="half">
              <label for="profile2" class="profile-dropdown m-b0 ">
                <input type="checkbox" id="profile2">
                <div class="d-flex">
                  <i class="mdi mdi-account fontSize30"></i>
                  <label for="profile2" class="align-self-center">
                    <i class="mdi mdi-chevron-down fontSize20"></i></label>
                  </div>

                  <ul class=" position-absolute dnone m-t10 p-b5">
                    <li>
                      <a href="{{ route('admin.profile') }}" class="p-t10 p-l15"><i class="mdi mdi-settings"></i>Profile</a>
                    </li>
                    <li data-toggle="modal" data-target="#logout">
                      <a href="javascript:void;" class="p-t10 p-l15">
                        <i class="mdi mdi-logout"></i>{{ __('messages.Logout')}}{{ __('') }}
                      </a>
                    </li>
                    <form id="logout-form" action="{{ route('admin.logout') }}" method="POST" style="display: none;">
                      @csrf
                    </form>

                  </ul>
                </label>
              </div>
            </div>
          </div>
        </nav>
        @yield('content')
        <script>
          @if(Session::has('notification'))
          var type = "{{ Session::get('notification.alert-type', 'info') }}";
          switch (type) {
            case 'info':
            toastr.info("{{ Session::get('notification.message') }}");
            break;
            case 'warning':
            toastr.warning("{{ Session::get('notification.message') }}");
            break;
            case 'success':
            toastr.success("{{ Session::get('notification.message') }}");
            break;
            case 'error':
            toastr.error("{{ Session::get('notification.message') }}");
            break;
          }
          {{ Session::forget('notification') }}
          @endif
        </script>
      </div>
    </div>
    <div class="modal fade" id="logout" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content w-75 mx-auto text-center">
          <div class="modal-body">
            {{ __('Are you sure you want to logout?') }}
          </div>
          <div class="m-t20 m-b20 text-center justify-content-center">
            <a href="javascript:void;" onclick="$('#logout-form').submit();"><button type="button" class="btn btn-primary m-r20">{{ __('Okay') }}</button></a>
            <button type="button" class="btn btn-danger" data-dismiss="modal">{{ __('Cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
    <script type="text/javascript"> var baseURL= '<?php echo URL::to('/'); ?>'; </script>
    <script src="{{ URL::asset('public/admin_assets/js/bootstrap.min.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/js/popper.min.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/js/countrySelect.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/pace/pace.min.js') }}"></script>
    <script src="{{ URL::asset('public/admin_assets/js/custom.js') }}"></script>
  </body>
  </html>
