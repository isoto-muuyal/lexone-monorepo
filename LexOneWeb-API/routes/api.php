<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['prefix' => 'v1'], function(){
	Route::post('/user/profileupload', 'Api\MediaController@userprofileupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::post('/tasker/profileupload', 'Api\MediaController@taskerprofileupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::post('/tasker/mediaupload', 'Api\MediaController@taskermediaupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::post('/user/chatupload', 'Api\MediaController@userchatupload');
});


Route::group(['prefix' => 'v1'], function(){
	Route::post('/tasker/chatupload', 'Api\MediaController@taskerchatupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::post('/tasker/audioupload', 'Api\MediaController@taskeraudioupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::post('/user/audioupload', 'Api\MediaController@useraudioupload');
});

Route::group(['prefix' => 'v1'], function(){
	Route::get('/platform/detect', 'Api\PlatformController@detectAndRedirect');
});

