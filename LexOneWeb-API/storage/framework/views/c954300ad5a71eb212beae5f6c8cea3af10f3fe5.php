<?php
use App\Models\Setting;
$settings = Setting::orderBy('_id', 'desc')->first();
?>
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
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" >
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/3.6.95/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="<?php echo e(URL::asset('public/admin_assets/toastr/toastr.min.css')); ?>" />
  <script src="<?php echo e(URL::asset('public/admin_assets/js/jquery-3.5.1.min.js')); ?>" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="<?php echo e(URL::asset('public/admin_assets/js/jquery.min.js')); ?>"></script>
  <script src="<?php echo e(URL::asset('public/admin_assets/toastr/toastr.min.js')); ?>"></script>
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
      background: #F14E16;
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
        <a href="<?php echo e(route('dashboard.home')); ?>">
          <img src="<?php echo e(url('/media/admin_assets/logo.png')); ?>" class="height40">
        </a>
      </div>
      <ul class="list-unstyled components">
        <li class="<?php echo e(Request()->routeIs('dashboard.home') ? 'active' : ''); ?>">
          <a href="<?php echo e(route('dashboard.home')); ?>">
            <span class="new-icons">
              <i class="fa fa-folder-o" aria-hidden="true"></i>
            </span>
            <?php echo e(__('messages.Dashboard')); ?>

          </a>
        </li>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('insights')): ?>
          <li class="<?php echo e(Request()->routeIs('dashboard.insights') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('dashboard.insights')); ?>">
              <span class="new-icons">
                <i class="fa fa-bar-chart" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Insights')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('notification')): ?>
          <li class="<?php echo e(Request()->routeIs('admin.notification*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('admin.notification')); ?>">
              <span class="new-icons">
                <i class="fa fa-bell-o" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Push Notification')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('roles')): ?>
          <li class="<?php echo e(Request()->routeIs('role*')|| Request()->routeIs('admin*') ? 'active' : ''); ?>">
            <a href="#Items" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-list" aria-hidden="true"></i>
              </span>
                <?php echo e(__('messages.Roles & Moderators')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e(((Request::segment(2)=== 'roles') || (Request::segment(2)=== 'moderators') )  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="Items">
                <li>
                    <a href="<?php echo e(route('role.index')); ?>"><?php echo e(__('messages.Roles')); ?></a>
                </li>
                <li>
                    <a href="<?php echo e(route('admin.index')); ?>"><?php echo e(__('messages.Moderators')); ?></a>
                </li>
            </ul>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('users')): ?>
          <li class="<?php echo e(Request()->routeIs('user*') ? 'active' : ''); ?>">
            <a href="#user" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-users" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Users')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e((Request::segment(2)=== 'users')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="user">
              <li>
                <a href="<?php echo e(route('user.index',['user' => $user ='approved'])); ?>"><?php echo e(__('messages.Approved')); ?> <?php echo e(__('messages.Users')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('user.index',['user' => $user ='pending'])); ?>"><?php echo e(__('messages.Pending')); ?> <?php echo e(__('messages.Users')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('user.index')); ?>"><?php echo e(__('messages.Deleted')); ?> <?php echo e(__('messages.Users')); ?></a>
              </li>
            </ul>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('Taskers')): ?>
          <li class="<?php echo e(Request()->routeIs('tasker*') ? 'active' : ''); ?>">
            <a href="#Taskers" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-server" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Taskers')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e((Request::segment(2)=== 'Taskers')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="Taskers">
              <li>
                <a href="<?php echo e(route('tasker.index',['tasker' => $tasker ='approved'])); ?>"><?php echo e(__('messages.Verified')); ?> <?php echo e(__('messages.Taskers')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('tasker.index',['tasker' => $tasker ='pending'])); ?>"><?php echo e(__('messages.Unverified')); ?> <?php echo e(__('messages.Taskers')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('tasker.index')); ?>"><?php echo e(__('messages.Deleted')); ?> <?php echo e(__('messages.Taskers')); ?></a>
              </li>
            </ul>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('categories')): ?>
          <li class="<?php echo e(Request()->routeIs('category*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('category.home')); ?>">
              <span class="new-icons">
                <i class="fa fa-th-large" aria-hidden="true"></i>
              </span>
              <?php echo e(__('Categories')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('subcategories')): ?>
          <li class="<?php echo e(Request()->routeIs('subcategory*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('subcategory.home')); ?>">
              <span class="new-icons">
                <i class="fa fa-sitemap" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Subcategories')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('services')): ?>
          <li class="<?php echo e(Request()->routeIs('service*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('service.home')); ?>">
              <span class="new-icons">
                <i class="fa fa-cogs" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Services')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('needs')): ?>
          <li class="<?php echo e(Request()->routeIs('needs*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('needs.index')); ?>">
              <span class="new-icons">
                <i class="fa fa-wrench" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Jobs')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('bookings')): ?>
          <li class="<?php echo e(Request()->routeIs('booking*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('booking.index')); ?>">
              <span class="new-icons">
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Bookings')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('settlement')): ?>
          <li class="<?php echo e(Request()->routeIs('settlement*') ? 'active' : ''); ?>">
            <a href="#settlement" data-toggle="collapse" aria-expanded="true" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-server" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Settlement')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e((Request::segment(2)=== 'settlement')  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="settlement">
              <li>
                <a href="<?php echo e(route('settlement.paid')); ?>"><?php echo e(__('messages.Paid')); ?> <?php echo e(__('messages.Settlement')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('settlement.index')); ?>"><?php echo e(__('messages.Unpaid')); ?> <?php echo e(__('messages.Settlement')); ?></a>
              </li>
            </ul>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('sitesettings')): ?>
          <li class="<?php echo e(Request()->routeIs('app*') || Request()->routeIs('location*') || Request()->routeIs('email*') || Request()->routeIs('notification*') || Request()->routeIs('payment*') || Request()->routeIs('sitesettings*') || Request()->routeIs('social-link*') ? 'active' : ''); ?>">
            <a href="#setting" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-cog" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Settings')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e(((Request::segment(2)=== 'sitesettings') || (Request::segment(2)=== 'banners'))  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="setting">
              <li>
                <a href="<?php echo e(route('sitesettings.index')); ?>"><?php echo e(__('messages.Site Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('currency.index')); ?>"><?php echo e(__('messages.Currency settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('app.create')); ?>"><?php echo e(__('messages.App')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('appupdate.create')); ?>"><?php echo e(__('messages.App')); ?> <?php echo e(__('messages.Update')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('payment.create')); ?>"><?php echo e(__('messages.Payment')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('bannerimage.index')); ?>"><?php echo e(__('messages.Banner')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('notification.create')); ?>"><?php echo e(__('messages.Notification')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('email.create')); ?>"><?php echo e(__('messages.Email')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('location.index')); ?>"><?php echo e(__('messages.City')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('social-link.create')); ?>"><?php echo e(__('messages.Social Link')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <?php
              if($settings->googleadsense == 'true') { ?>
              <li>
              <a href="<?php echo e(route('adsense.create')); ?>"><?php echo e(__('messages.Adsense')); ?> <?php echo e(__('messages.Settings')); ?></a>
              </li>
              <?php } ?>
            </ul>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('help')): ?>
          <li class="<?php echo e(Request()->routeIs('help*') ? 'active' : ''); ?>">
            <a href="<?php echo e(route('help.index')); ?>">
              <span class="new-icons">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Help')); ?>

            </a>
          </li>
        <?php endif; ?>
        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('privacy')): ?>
          <li class="<?php echo e(Request()->routeIs('privacy*') || Request()->routeIs('terms*')  ? 'active' : ''); ?>">
            <a href="#terms" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
              <span class="new-icons">
                <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
              </span>
              <?php echo e(__('messages.Terms and Policies')); ?> <i class="mdi mdi-chevron-down float-right"></i>
            </a>
            <ul class="<?php echo e(((Request::segment(2)=== 'privacy-policy') || (Request::segment(2)=== 'terms'))  ? 'collapse list-unstyled Submenu show' : 'collapse list-unstyled Submenu'); ?>" id="terms">
              <li>
                <a href="<?php echo e(route('privacy.create', ['id' => 'Tasker','lang'=>'en' ])); ?>"><?php echo e(__('messages.Tasker Privacy Policy')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('privacy.create', ['id' => 'User','lang'=>'en' ])); ?>"><?php echo e(__('messages.User Privacy Policy')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('terms.create', ['id' => 'Tasker','lang'=>'en' ])); ?>"><?php echo e(__('messages.Tasker Terms')); ?></a>
              </li>
              <li>
                <a href="<?php echo e(route('terms.create', ['id' => 'User','lang'=>'en' ])); ?>"><?php echo e(__('messages.User Terms')); ?></a>
              </li>
            </ul>
          </li>
        <?php endif; ?>
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
                <option value="en"<?php if (Session::get('locale') === "en") {echo "selected";}?>><?php echo e(__('English')); ?></option>
                <option value="fr"<?php if (Session::get('locale') === "fr") {echo "selected";}?>><?php echo e(__('French')); ?></option>
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
                      <a href="<?php echo e(route('admin.profile')); ?>" class="p-t10 p-l15"><i class="mdi mdi-settings"></i>Profile</a>
                    </li>
                    <li data-toggle="modal" data-target="#logout">
                      <a href="javascript:void;" class="p-t10 p-l15">
                        <i class="mdi mdi-logout"></i><?php echo e(__('messages.Logout')); ?><?php echo e(__('')); ?>

                      </a>
                    </li>
                    <form id="logout-form" action="<?php echo e(route('admin.logout')); ?>" method="POST" style="display: none;">
                      <?php echo csrf_field(); ?>
                    </form>

                  </ul>
                </label>
              </div>
            </div>
          </div>
        </nav>
        <?php echo $__env->yieldContent('content'); ?>
        <script>
          <?php if(Session::has('notification')): ?>
          var type = "<?php echo e(Session::get('notification.alert-type', 'info')); ?>";
          switch (type) {
            case 'info':
            toastr.info("<?php echo e(Session::get('notification.message')); ?>");
            break;
            case 'warning':
            toastr.warning("<?php echo e(Session::get('notification.message')); ?>");
            break;
            case 'success':
            toastr.success("<?php echo e(Session::get('notification.message')); ?>");
            break;
            case 'error':
            toastr.error("<?php echo e(Session::get('notification.message')); ?>");
            break;
          }
          <?php echo e(Session::forget('notification')); ?>

          <?php endif; ?>
        </script>
      </div>
    </div>
    <div class="modal fade" id="logout" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content w-75 mx-auto text-center">
          <div class="modal-body">
            <?php echo e(__('Are you sure you want to logout?')); ?>

          </div>
          <div class="m-t20 m-b20 text-center justify-content-center">
            <a href="javascript:void;" onclick="$('#logout-form').submit();"><button type="button" class="btn btn-primary m-r20"><?php echo e(__('Okay')); ?></button></a>
            <button type="button" class="btn btn-danger" data-dismiss="modal"><?php echo e(__('Cancel')); ?></button>
          </div>
        </div>
      </div>
    </div>
  </div>
    <script type="text/javascript"> var baseURL= '<?php echo URL::to('/'); ?>'; </script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/bootstrap.min.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/popper.min.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/countrySelect.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/pace/pace.min.js')); ?>"></script>
    <script src="<?php echo e(URL::asset('public/admin_assets/js/custom.js')); ?>"></script>
  </body>
  </html>
<?php /**PATH /var/www/html/resources/views/admin/layouts/sidebar.blade.php ENDPATH**/ ?>