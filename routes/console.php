<?php

use App\Helpers\DBHelper;
use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
	$this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('app:seed-database', function () {

	DBHelper::seedDatabase();

	$this->info("Your database is ready!");
	$this->info("It contains " . ProductType::all()->count() . " product types and " . Product::all()->count() . " products.");

})->purpose('Seed the database');
