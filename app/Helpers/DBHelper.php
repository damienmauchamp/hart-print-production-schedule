<?php

namespace App\Helpers;

use App\Models\ProductType;
use Illuminate\Support\Arr;

class DBHelper {

	public static function orderBy(?string $sort = null): array {
		return [
			static::parseSort($sort),
			static::parseSortOrder($sort),
		];
	}

	public static function parseSort(?string $sort = null): string {
		return preg_replace('/^-/', '', $sort);
	}

	public static function parseSortOrder(?string $sort = null): string {
		if (!$sort) {
			return 'asc';
		}

		return str_starts_with($sort, '-') ? 'desc' : 'asc';
	}

	public static function seedDatabase() {

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
	}
}
