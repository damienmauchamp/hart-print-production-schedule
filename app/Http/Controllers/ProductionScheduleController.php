<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductType;
use Carbon\Carbon;
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
		$timer = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now();
		$currentType = null;

		// Grouping orders by product type to optimize schedule
		$ordersByType = $orders->groupBy(function ($order) {
			return $order->orderItems->first()?->product->type;
		});

		foreach ($ordersByType as $productType => $orders) {
			// Sort each group of orders by need_by_date
			$orders = $orders->sortBy('need_by_date');

			foreach ($orders as $order) {
				foreach ($order->orderItems as $orderItem) {
					$productType = $orderItem->product->productType;

					// Check for type change and add changeover delay
					if ($currentType !== null && $currentType != $productType) {

						$startChangeover = clone $timer;
						$timer->addSeconds($changeoverDelay);

						$schedule[] = [
							'type' => 'changeover',
							'timestamp' => $startChangeover->timestamp,
							'start_time' => $startChangeover,
							'end_time' => clone $timer,
						];
					}

					// getting production time in minutes
					$unitsPerHour = $productionSpeeds[$productType->id];
					$productionTime = ceil($orderItem->quantity / $unitsPerHour * 60);

					$start = clone $timer;
					$timer->addMinutes($productionTime);
					$end = clone $timer;

					$schedule[] = [
						'type' => 'schedule',
						'order_id' => $order->id,
						'order_number' => $order->order_number,
						'order_need_by' => $order->need_by_date->toDateString(),
						'completed_at' => $order->updated_at,
						'product' => $orderItem->product->name,
						'product_type' => $orderItem->product->productType->name,
						'quantity' => $orderItem->quantity,
						'production_time' => $productionTime,
						'units_per_hour' => $unitsPerHour,
						'start_time' => $start,
						'end_time' => $end,
					];

					$currentType = $productType;
				}
			}
		}

		return $schedule;
	}

}
