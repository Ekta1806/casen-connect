<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\ApiCommonController;
use App\Http\Controllers\Auth\Student\LoginController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\IntakeController;



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

Route::get('/student/login', [LoginController::class, 'showLoginForm'])->name('welcomeHomePage');
Route::get('/', [LandingPageController::class, 'showLandingForm'])->name('landinPage');


Route::get('/auth/{type}/google/', [GoogleController::class, 'index'])->name('google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::get('/intakeForm', [IntakeController::class, 'intakeForm'])->name('intakeForm');
Route::post('/intakeFormSubmit', [IntakeController::class, 'intakeFormSubmit'])->name('intakeFormSubmit');
Route::get('/intakeQuestionFetch', [IntakeController::class, 'intakeQuestionFetch'])->name('intakeQuestionFetch');
Route::get('/', [LandingPageController::class, 'showLandingForm'])->middleware(['guest'])->name('landingPage');

Route::prefix('student')->middleware(['guest:student'])->group(function () {
Route::get('/login/{id}', [LoginController::class, 'login'])->name('teacher.student.store');
});


require __DIR__.'/auth.php';

