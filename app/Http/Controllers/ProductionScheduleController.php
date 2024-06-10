<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductType;
use Illuminate\Http\Request;

class ProductionScheduleController extends Controller {

	public function schedule(Request $request) {
		$request->validate([
			'start_date' => 'date',
		]);

		$changeoverDelay = (int) env('CHANGEOVER_DELAY', 1800);

		// retrieving production speeds for each product type
		$productTypes = ProductType::all();
		$productionSpeeds = array_combine(
			$productTypes->pluck('id')->toArray(),
			$productTypes->pluck('units_per_hour')->toArray()
		);

		$orders = Order::with('orderItems.product')
			->where('status', 'confirmed')
			->orderBy('need_by_date')
			->get();

		$schedule = [];

		return $schedule;
	}

}
