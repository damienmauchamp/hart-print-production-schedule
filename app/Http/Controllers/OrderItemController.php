<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrderItemController extends Controller {

	public function store(Request $request) {

		DB::beginTransaction();

		try {

			// throw new Exception('error');

			$request->validate([
				'productId' => 'required|integer',
				'quantity' => 'required|integer|min:1',
				'orderNumber' => 'string|nullable',
			]);

			$product = Product::find($request->productId);
			if (!$product) {
				throw new HttpException(404, 'Product not found');
			}

			// looking for the order if it exists
			if ($request->orderNumber) {
				$order = Order::where('order_number', $request->orderNumber)->first();

				if ($order && $order->status !== 'pending') {
					throw new HttpException(404, "Your can't add an order item to an order that is not pending");
				}

			} else {
				$order = Order::create([
					'customer_name' => '',
					'status' => 'pending',
					'need_by_date' => null,
				]);
			}

			// all products in the order must have the same type
			if ($order->orderItems) {
				$orderItemTypes = $order->orderItems->map(function ($orderItem) {
					return $orderItem->product->productType;
				});

				$allSameType = $orderItemTypes->every(function ($productType) use ($product) {
					return $productType->id === $product->productType->id;
				});

				if (!$allSameType) {
					throw new HttpException(400, 'All products in the order must have the same type');
				}
			}

			// create or update the order item
			$orderItem = $order->orderItems()->updateOrCreate([
				'product_id' => $product->id,
			], ['quantity' => $request->quantity]);
			$orderItem->save();

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

		return response()->json([
			'message' => 'Your product item has been added successfully',
			'order' => new OrderResource($order),
			'item' => new OrderItemResource($orderItem),
		], 200);
	}

	public function edit(Order $order, OrderItem $orderItem, Request $request) {

		$request->validate([
			'quantity' => 'required|integer|min:1',
		]);

		if ($request->quantity === 0) {
			$orderItem->delete();

			return response()->json([
				'message' => 'Your order item has been deleted successfully',
			], 200);
		}

		if (!$orderItem->update(['quantity' => $request->quantity])) {
			return response()->json([
				'message' => 'Something went wrong',
			], 500);
		}

		return response()->json([
			'message' => 'Your order item has been updated successfully',
		], 200);
	}

	public function delete(Order $order, OrderItem $orderItem, Request $request) {

		if (!$orderItem->delete()) {
			return response()->json([
				'message' => 'Something went wrong',
			], 500);
		}

		return response()->json([
			'message' => 'Your order item has been deleted successfully',
		], 200);
	}
}
