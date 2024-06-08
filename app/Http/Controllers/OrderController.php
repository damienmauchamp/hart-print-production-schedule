<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrderController extends Controller {

	public function list() {
		return new OrderCollection(Order::all());
	}

	public function index(Order $order) {
		return new OrderResource($order);
	}

	public function putOrder(Order $order, Request $request) {

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
				throw new HttpException(400, 'Customer name is required');
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
}
