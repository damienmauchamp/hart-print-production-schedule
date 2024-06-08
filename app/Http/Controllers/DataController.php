<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductCollection;
use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Support\Arr;

class DataController extends Controller {

	public function seed() {

		$productTypes = [
			[
				'name' => 'Type 1',
				'units_per_hour' => 715,
				'products' => [
					['name' => 'Product A'],
					['name' => 'Product B'],
					['name' => 'Product F'],
				],
			],
			[
				'name' => 'Type 2',
				'units_per_hour' => 770,
				'products' => [
					['name' => 'Product C'],
				],
			],
			[
				'name' => 'Type 3',
				'units_per_hour' => 1000,
				'products' => [
					['name' => 'Product D'],
					['name' => 'Product E'],
				],
			],
		];

		foreach ($productTypes as $productTypeItem) {
			$productType = ProductType::firstOrCreate(Arr::except($productTypeItem, ['products']));
			foreach ($productTypeItem['products'] as $product) {
				$productType->products()->firstOrCreate($product);
			}
		}

		return response()->json([
			'message' => 'Your database is ready!',
			'return' => ProductType::with('products')->get()->all(),
			'CHANGEOVER_DELAY' => env('CHANGEOVER_DELAY'),
		]);
	}

	public function products() {
		return new ProductCollection(Product::all()->sortBy('name'));
	}

}
