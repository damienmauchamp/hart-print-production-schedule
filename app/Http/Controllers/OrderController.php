<?php

namespace App\Http\Controllers;

use App\Helpers\DBHelper;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrderController extends Controller {

	public function list(Request $request) {

		$request->validate([
			'customer' => 'string',
			'status' => 'in:pending,confirmed',
			'order_by' => 'in:customer,-customer,need_by_date,-need_by_date,created_at,-created_at,updated_at,-updated_at',
		]);

		$orders = Order::where(function ($query) use ($request) {

			$status = $request->status ?? '';
			if ($status) {
				$query->where('status', $status);
			}

			if ($request->customer) {
				$query->where('customer_name', 'like', "%$request->customer%");
			}
		})
			->orderBy(...DBHelper::orderBy($request->order_by ?? '-updated_at'))
			->get();

		return new OrderCollection($orders);
	}

	public function index(Order $order) {
		return new OrderResource($order);
	}

	public function edit(Order $order, Request $request) {

		DB::beginTransaction();

		try {

			$request->validate([
				'customer' => 'string|required',
				'need_by_date' => 'date|required',
				'done' => 'boolean',
			]);

			if (!$request->customer) {
				throw new HttpException(400, 'Customer name is required');
			}

			if (!$request->need_by_date) {
				throw new HttpException(400, 'Need by date is required');
			}

			// todo : check if date is in the future
			// todo : check if date is possible via production's schedule

			$order->update([
				'customer_name' => $request->customer,
				'need_by_date' => $request->need_by_date,
			]);

			if ($request->done) {

				if (!$order->orderItems()->count()) {
					throw new HttpException(404, 'Please add at least one item to the order');
				}

				$order->update([
					'status' => 'confirmed',
				]);
			}

		} catch (HttpException $e) {

			DB::rollBack();

			return response()->json([
				'message' => $e->getMessage(),
			], $e->getStatusCode());

		} catch (Exception $e) {

			DB::rollBack();

			return response()->json([
				'message' => 'Something went wrong',
				'error' => $e->getMessage(),
			], 500);
		}

		DB::commit();

		return new OrderResource($order);
	}

	public function clean() {

		// deleting pending and incomplete orders
		$orders = Order::where('status', 'pending')
			->where('updated_at', '<', now()->subMinutes(30))
			->get();
		foreach ($orders as $order) {
			$order->delete();
		}

		// deleting empty orders
		Order::whereDoesntHave('orderItems')
			->where('updated_at', '<', now()->subMinutes(30))
			->delete();

		return response()->json(['message' => 'Orders cleaned up'], 200);
	}
}
