<?php

namespace App\Http\Controllers;

use App\Helpers\DBHelper;
use App\Http\Resources\ProductCollection;
use App\Models\Product;

class DataController extends Controller {

	public function seed() {

		DBHelper::seedDatabase();

		return response()->json([
			'message' => 'Your database is ready!',
		]);
	}

	public function products() {
		return new ProductCollection(Product::all()->sortBy('name'));
	}

}
