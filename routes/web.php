<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

	if (Auth::check()) {
		return redirect('/home');
	}

	return redirect('/login');
});

Route::group(['middleware' => ['auth', 'verified']], function () {
	Route::get('/home', function () {
		return Inertia::render('Home');
	})->name('home');

});

Route::middleware('auth')->group(function () {
	Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
