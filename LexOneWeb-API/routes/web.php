<?php
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/switchlang/{locale}', 'Admin\LanguageController@switchlang')->name('language.switchlang');
Route::get('/stripe/reauth', 'Admin\SettlementController@reauth')->name('settlement.reauth');
Route::get('/stripe/{stripe?}', 'Admin\SettlementController@complete')->name('settlement.complete');
Route::get('/payoutcron', 'Admin\SettlementController@payoutCron')->name('payout.cron');
Route::view('/', 'hsome');
Route::view('/privacy-policy', 'privacypolicy');

	// Admin Routes
$admin_prefix = config('app.name');
Route::group(['prefix' => $admin_prefix], function()
{
	Route::group(['middleware'=>'setlocale'],function ()
	{
		Route::get('/login', 'Admin\Auth\LoginController@showLoginForm')->name('login');
		Route::get('/', 'Admin\Auth\LoginController@showLoginForm');
		Route::post('/login-process', 'Admin\Auth\LoginController@login')->name('admin.authentication');
		Route::middleware(['auth'])->group(function () {
			Route::group(['middleware' => ['permission:insights']], function () {
				Route::get('/insights', 'Admin\DashboardController@insights')->name('dashboard.insights');
			});
			Route::prefix('/dashboard')->group(function () {
				Route::get('/', 'Admin\DashboardController@home')->name('dashboard.home');
				
			});
			// Categories
			Route::group(['middleware' => ['permission:categories']], function () {
				Route::prefix('/categories')->group(function () {
					Route::get('/add', 'Admin\CategoryController@addcategory')->name('category.add');
					Route::get('/', 'Admin\CategoryController@index')->name('category.home');
					Route::get('/search', 'Admin\CategoryController@search')->name('category.search');
					Route::get('/changecategorystatus/{categoryId}/{categoryStatus}', 'Admin\CategoryController@changecategorystatus')->name('category.activestatus');
					Route::post('/store', 'Admin\CategoryController@storecategory')->name('category.store');
					Route::get('/show/{categoryId}', 'Admin\CategoryController@showCategory')->name('category.show');
					Route::get('/show/details/{categoryId}', 'Admin\CategoryController@showDetail')->name('category.detail');
					Route::get('/edit/{categoryId}', 'Admin\CategoryController@editcategory')->name('category.edit');
					Route::post('/update/{categoryId}', 'Admin\CategoryController@updatecategory')->name('category.update');
				});
			});
			// Roles and Privileges
			Route::group(['middleware' => ['permission:roles']], function () {
				// Roles
				Route::prefix('/roles')->group(function () {
					Route::get('/', 'Admin\RoleController@index')->name('role.index');
					Route::get('/create', 'Admin\RoleController@create')->name('role.create');
					Route::post('/store', 'Admin\RoleController@store')->name('role.store');
					Route::get('/show/{id}', 'Admin\RoleController@show')->name('role.show');
					Route::get('/edit/{id}', 'Admin\RoleController@edit')->name('role.edit');
					Route::post('/update/{id}', 'Admin\RoleController@update')->name('role.update');
					Route::delete('/{id}', 'Admin\RoleController@delete')->name('role.destroy');
				});
				// Admin
				Route::prefix('/moderators')->group(function () {
					Route::get('/', 'Admin\ModeratorController@index')->name('admin.index');
					Route::get('/create', 'Admin\ModeratorController@create')->name('admin.create');
					Route::post('/store', 'Admin\ModeratorController@store')->name('admin.store');
					Route::get('/show/{id}', 'Admin\ModeratorController@show')->name('admin.show');
					Route::get('/edit/{id}', 'Admin\ModeratorController@edit')->name('admin.edit');
					Route::post('/update/{id}', 'Admin\ModeratorController@update')->name('admin.update');
					Route::delete('/{id}', 'Admin\ModeratorController@delete')->name('admin.destroy');
				});
			});
			// settlement
			Route::group(['middleware' => ['permission:settlement']], function () {
				Route::prefix('/settlement')->group(function () {
					Route::get('/unpaid', 'Admin\SettlementController@index')->name('settlement.index');
					Route::get('/paid', 'Admin\SettlementController@paid')->name('settlement.paid');
					Route::get('/unpaid/{id}', 'Admin\SettlementController@show')->name('settlement.show');
					Route::get('/{id}', 'Admin\SettlementController@paiddetails')->name('settlement.paiddetails');
					Route::post('/stripe', 'Admin\SettlementController@stripePost')->name('stripe.post');
				});
			});
			// Booking
			Route::group(['middleware' => ['permission:bookings']], function () {
				Route::prefix('/booking')->group(function () {
					Route::get('/', 'Admin\BookingController@index')->name('booking.index');
					Route::get('/search', 'Admin\BookingController@search')->name('booking.search');
					Route::get('/select', 'Admin\BookingController@select')->name('booking.select');
					Route::get('/{id}', 'Admin\BookingController@show')->name('booking.show');
				});
			});
			// needs
			Route::group(['middleware' => ['permission:needs']], function () {
				Route::prefix('/needs')->group(function () {
					Route::get('/', 'Admin\NeedsController@index')->name('needs.index');
					Route::get('/select', 'Admin\NeedsController@select')->name('needs.select');
					Route::get('/{id}', 'Admin\NeedsController@show')->name('needs.show');
					Route::get('status/{id}/{needStatus}', 'Admin\NeedsController@changeStatus')->name('needs.changeStatus');

				});
			});
			Route::group(['middleware' => ['permission:notification']], function () {
				Route::prefix('/push-notification')->group(function () {
					Route::get('/', 'Admin\DashboardController@notification')->name('admin.notification');
					Route::get('/sendalert/{dtype}', 'Admin\DashboardController@sendalert')->name('dashboard.sendalert');
					
				});
			});
			
			// Help
			Route::group(['middleware' => ['permission:help']], function () {
				Route::group(['middleware' => ['permission:help']], function () {
					Route::prefix('/help')->group(function () {
						Route::get('/', 'Admin\HelpController@index')->name('help.index');
						Route::get('/create', 'Admin\HelpController@create')->name('help.create');
						Route::post('/store', 'Admin\HelpController@store')->name('help.store');
						Route::get('/show/{id}', 'Admin\HelpController@show')->name('help.show');
						Route::get('/edit/{id}', 'Admin\HelpController@edit')->name('help.edit');
						Route::post('/update/{id}', 'Admin\HelpController@update')->name('help.update');
						Route::delete('/{id}', 'Admin\HelpController@delete')->name('help.destroy');
					});
				});
			});
			// Privacy Policy
			Route::group(['middleware' => ['permission:privacy']], function () {
				Route::group(['middleware' => ['permission:privacy']], function () {
					Route::prefix('/privacy-policy')->group(function () {
						// Route::get('/{id}', 'Admin\PrivacyController@create')->name('privacy.create');
						Route::get('/{id}/{lang}', 'Admin\PrivacyController@create')->name('privacy.create');
						Route::post('/store', 'Admin\PrivacyController@store')->name('privacy.store');
					});
				});
			});
			// Profile
			Route::prefix('/profile')->group(function () {
				Route::get('/', 'Admin\ProfileController@index')->name('admin.profile');
				Route::post('/update', 'Admin\ProfileController@updateprofile')->name('admin.updateprofile');
				Route::post('/changepassword', 'Admin\ProfileController@changepassword')->name('admin.changepassword');
				Route::post('logout', function () { Auth::logout(); return redirect()->route('login'); })->name('admin.logout');
			});
			// Services
			Route::group(['middleware' => ['permission:services']], function () {
				Route::prefix('/services')->group(function () {
					Route::get('/', 'Admin\ServiceController@index')->name('service.home');
					Route::get('/add', 'Admin\ServiceController@addservice')->name('service.add');
					Route::post('/store', 'Admin\ServiceController@storeservice')->name('service.store');
					Route::get('/show/{serviceId}', 'Admin\ServiceController@showService')->name('service.show');
					Route::get('/edit/{serviceId}', 'Admin\ServiceController@editService')->name('service.edit');
					Route::post('/services/update/{serviceId}', 'Admin\ServiceController@updateService')->name('service.update');
					Route::get('/search', 'Admin\ServiceController@searchservice')->name('service.search');
					Route::get('/changeservicestatus/{serviceId}/{serviceStatus}', 'Admin\ServiceController@changeservicestatus')->name('service.activestatus');
					Route::post('/ajaxsubcategories', 'Admin\ServiceController@ajaxsubcategories')->name('service.ajaxsubcategories');
				});
			});

			//Currency
			Route::group(['middleware' => ['permission:sitesettings']], function () {
				Route::prefix('/currency')->group(function () {
					Route::get('/', 'Admin\CurrencyController@index')->name('currency.index');
					Route::get('/show/{currencyId}', 'Admin\CurrencyController@showCurrency')->name('currency.show');
					Route::get('/edit/{currencyId}', 'Admin\CurrencyController@editCurrency')->name('currency.edit');
					Route::get('/add', 'Admin\CurrencyController@addCurrency')->name('currency.add');
					Route::get('/defaultcurrency', 'Admin\CurrencyController@defaultcurrency')->name('currency.default');
					Route::post('/update/{currencyId}', 'Admin\CurrencyController@updateCurrency')->name('currency.update');
					Route::post('/store', 'Admin\CurrencyController@storecurrency')->name('currency.store');
					Route::post('/ajaxcurrencyRate', 'Admin\CurrencyController@ajaxcurrencyRate')->name('currency.ajaxcurrencyRate');
					Route::post('/setdefaultcurrency', 'Admin\CurrencyController@setdefaultcurrency')->name('currency.setdefaultcurrency');
				});
			});

			// Subcategories
			Route::group(['middleware' => ['permission:subcategories']], function () {
				Route::prefix('/subcategories')->group(function () {
					Route::get('/add', 'Admin\SubCategoryController@addsubcategory')->name('subcategory.add');
					Route::get('/', 'Admin\SubCategoryController@subcategories')->name('subcategory.home');
					Route::get('/search', 'Admin\SubCategoryController@search')->name('subcategory.search');
					Route::get('/changesubcategorystatus/{categoryId}/{categoryStatus}', 'Admin\SubCategoryController@changesubcategorystatus')->name('subcategory.activestatus');
					Route::post('/store', 'Admin\SubCategoryController@storesubcategory')->name('subcategory.store');
					Route::get('/show/{subcategoryId}', 'Admin\SubCategoryController@showSubCategory')->name('subcategory.show');
					Route::get('/edit/{categoryId}', 'Admin\SubCategoryController@editsubcategory')->name('subcategory.edit');
					Route::post('/update/{categoryId}','Admin\SubCategoryController@updatesubcategory')->name('subcategory.update');
				});
			});
			// Taskers
			Route::group(['middleware' => ['permission:Taskers']], function () {
				Route::prefix('/Taskers')->group(function () {
					Route::get('/create', 'Admin\TaskerController@create')->name('tasker.create');
					Route::post('/store', 'Admin\TaskerController@store')->name('tasker.store');
					Route::get('/search/{tasker?}', 'Admin\TaskerController@search')->name('tasker.search');
					Route::get('/export/{filter?}', 'Admin\TaskerController@export')->name('tasker.export');
					Route::get('/{tasker?}', 'Admin\TaskerController@index')->name('tasker.index');
					Route::get('/taskerdocs/{id}', 'Admin\TaskerController@taskerDocument')->name('taskerdocument.index');
					Route::get('/taskerdocs/verify/{id}', 'Admin\TaskerController@documentShow')->name('taskerdocument.show');
					Route::get('/show/{id}', 'Admin\TaskerController@show')->name('tasker.show');
					Route::get('/edit/{id}', 'Admin\TaskerController@edit')->name('tasker.edit');
					Route::get('/restore/{id}', 'Admin\TaskerController@restore')->name('tasker.restore');
					Route::patch('/update/{id}', 'Admin\TaskerController@update')->name('tasker.update');
					Route::get('/changeuserstatus/{userId}/{userStatus}', 'Admin\TaskerController@changeuserstatus')->name('tasker.changeuserstatus');
					Route::get('/pendingStatus/{id}/{taskerStatus}', 'Admin\TaskerController@pendingStatus')->name('tasker.pendingStatus');
					Route::get('/softdelete/{id}', 'Admin\TaskerController@softDelete')->name('tasker.softdelete');
					Route::delete('/destroy/{id}', 'Admin\TaskerController@destroy')->name('tasker.destroy');
				});
			});
			/* Route::group(['middleware' => ['permission:privacy']], function () {
				// Terms
				Route::prefix('/terms')->group(function () {
					Route::get('/{id}', 'Admin\TermsController@create')->name('terms.create');
					Route::post('/store', 'Admin\TermsController@store')->name('terms.store');
				});
			}); */
			
			//Termsandconditions
			Route::group(['middleware' => ['permission:privacy']], function () {
				// Terms
				Route::prefix('/terms')->group(function () {
					Route::get('/{id}/{lang}', 'Admin\TermsController@create')->name('terms.create');
					Route::post('/store', 'Admin\TermsController@store')->name('terms.store');
				});
			});

			// Users
			Route::group(['middleware' => ['permission:users']], function () {
				Route::prefix('/users')->group(function () {
					Route::get('/search/{user?}', 'Admin\UserController@search')->name('user.search');
					Route::get('/export/{filter?}', 'Admin\UserController@export')->name('user.export');
					Route::get('/{user?}', 'Admin\UserController@index')->name('user.index');
					Route::get('/show/{id}', 'Admin\UserController@show')->name('user.show');
					Route::get('/edit/{id}', 'Admin\UserController@edit')->name('user.edit');
					Route::get('/restore/{id}', 'Admin\UserController@restore')->name('user.restore');
					Route::patch('/update/{id}', 'Admin\UserController@update')->name('user.update');
					Route::get('/changeuserstatus/{userId}/{userStatus}', 'Admin\UserController@changeuserstatus')->name('user.changeuserstatus');
					Route::get('/softdelete/{id}', 'Admin\UserController@softDelete')->name('user.softdelete');
					Route::delete('/destroy/{id}', 'Admin\UserController@destroy')->name('user.destroy');
				});
			});
			Route::group(['middleware' => ['permission:sitesettings']], function () {
				Route::group(['prefix' => "sitesettings"], function()
				{
					//site settings
					Route::get('/', 'Admin\SettingController@create')->name('sitesettings.index');
					Route::post('/store', 'Admin\SettingController@storesitesettings')->name('sitesettings.store');
					Route::post('/ajaxsubcategories', 'Admin\SettingController@ajaxsubcategories')->name('location.ajaxsubcategories');
					// Banners 
					Route::prefix('/banners')->group(function () {
						Route::get('/', 'Admin\BannerImageController@index')->name('bannerimage.index');
						Route::get('/create', 'Admin\BannerImageController@addImage')->name('bannerimage.create');
						Route::post('/store', 'Admin\BannerImageController@storeBannerImage')->name('bannerimage.store');
						Route::get('/{id}', 'Admin\BannerImageController@showBannerImage')->name('bannerimage.show');
						Route::get('/{id}/edit', 'Admin\BannerImageController@editBannerImage')->name('bannerimage.edit');
						Route::patch('/{id}', 'Admin\BannerImageController@updateBannerImage')->name('bannerimage.update');
						Route::delete('/{id}', 'Admin\BannerImageController@deleteBannerImage')->name('bannerimage.destroy');
						Route::get('changebannerstatus/{id}/{bannerstatus}', 'Admin\BannerImageController@changebannerstatus')->name('bannerimage.activestatus');
					});
					// payment settings (stripe)
					Route::prefix('/payments')->group(function () {
						Route::get('/', 'Admin\PaymentController@create')->name('payment.create');
						Route::post('/store', 'Admin\PaymentController@store')->name('payment.store');
					});
					//email settings
					Route::prefix('/smtpsettings')->group(function () {
						Route::get('/', 'Admin\EmailController@create')->name('email.create');
						Route::post('/store', 'Admin\EmailController@store')->name('email.store');
					});
					//notification settings
						
					//location settings
					Route::prefix('/location')->group(function () {
						Route::get('/', 'Admin\LocationController@index')->name('location.index');
						Route::get('/create', 'Admin\LocationController@create')->name('location.create');
						Route::post('/store', 'Admin\LocationController@store')->name('location.store');
						Route::get('/truncate', 'Admin\LocationController@truncate')->name('location.truncate');
						Route::delete('/{id}', 'Admin\LocationController@destroy')->name('location.destroy');
						Route::get('/search', 'Admin\LocationController@search')->name('location.search');
						Route::post('/ajaxlocation', 'Admin\LocationController@ajaxlocation')->name('location.ajaxlocation');
					});
					// notification settings
					Route::prefix('/notificationkey')->group(function () {
						Route::get('/', 'Admin\NotificationController@create')->name('notification.create');
						Route::post('/store', 'Admin\NotificationController@store')->name('notification.store');
					});
					//App settings
					Route::prefix('/app')->group(function () {
						Route::get('/', 'Admin\AppController@create')->name('app.create');
						Route::post('/store', 'Admin\AppController@store')->name('app.store');
						Route::get('/update', 'Admin\AppController@updatecreate')->name('appupdate.create');
						Route::post('/update/store', 'Admin\AppController@updatestore')->name('appupdate.store');
					});
					Route::prefix('/adsense')->group(function () {
						Route::get('/', 'Admin\AdsenseController@create')->name('adsense.create');
						Route::post('/store', 'Admin\AdsenseController@store')->name('adsense.store');
					});
					//social settings
					Route::prefix('/social-links')->group(function () {
						Route::get('/', 'Admin\SocialController@create')->name('social-link.create');
						Route::post('/store', 'Admin\SocialController@store')->name('social-link.store');
					});
				});
			});
			// Ends here
			// Reviews
			Route::prefix('/review')->group(function () {
				Route::get('/{taskerid}', 'Admin\ReviewController@index')->name('review.index');
				Route::get('/category/{id}', 'Admin\ReviewController@categoryReview')->name('categoryReview.index');
			});
			
			// Settings
			/*Route::get('/mailsettings', 'Admin\SettingsController@index')->name('settings.mailsettings');
			Route::get('/sociallinks', 'Admin\SettingsController@index')->name('settings.sociallinks');*/
			/*Route::get('/mailsettings', 'Admin\SettingsController@index')->name('settings.mailsettings');*/
		});
	});
});

	// image access route
Route::get('/media/categories/{file}', [ function ($file) {
	$path = storage_path('app/public/categories/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);
Route::get('/media/defaults/{file}', [ function ($file) {
	$path = storage_path('app/public/defaults/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/users/audio/{file}', [ function ($file) {
	$path = storage_path('app/public/users/audio/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/users/{file}', [ function ($file) {
	$path = storage_path('app/public/users/avatars/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/taskers/{file}', [ function ($file) {
	$path = storage_path('app/public/taskers/avatars/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);
Route::get('/media/bannerimages/{file}', [ function ($file) {
	$path = storage_path('app/public/bannerimages/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);
Route::get('/media/services/{file}', [ function ($file) {
	$path = storage_path('app/public/services/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/documents/{file}', [ function ($file) {
	$path = storage_path('app/public/taskers/documents/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/portfolio/{file}', [ function ($file) {
	$path = storage_path('app/public/taskers/portfolio/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/admin_assets/{file}', [ function ($file) {
	$path = storage_path('app/public/admin_assets/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);


Route::get('/media/users/chats/{file}', [ function ($file) {
	$path = storage_path('app/public/users/chats/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);


Route::get('/media/taskers/chats/{file}', [ function ($file) {
	$path = storage_path('app/public/taskers/chats/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);


// image access route
Route::get('/media/categories/thumbnail/{file}', [ function ($file) {
	$path = storage_path('app/public/categories/thumbnail/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

Route::get('/media/bannerimages/thumbnail/{file}', [ function ($file) {
	$path = storage_path('app/public/bannerimages/thumbnail/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);
Route::get('/media/services/thumbnail/{file}', [ function ($file) {
	$path = storage_path('app/public/services/thumbnail/'.$file);
	if (file_exists($path)) {
		return response()->file($path);
	}
	abort(404);
}]);

