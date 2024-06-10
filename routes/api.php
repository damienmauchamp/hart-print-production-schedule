<?php

use App\Http\Controllers\DataController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\ProductionScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
	return $request->user();
})->middleware('auth:sanctum');

Route::group([], function () {

	// data & products
	Route::get('/seed', [DataController::class, 'seed'])->name('seed');
	Route::get('/products', [DataController::class, 'products'])->name('products');

	// orders
	Route::get('/orders', [OrderController::class, 'list'])->name('orders.list');

	Route::get('/order/{order:order_number}', [OrderController::class, 'index'])
		->missing(function () {
			return response()->json(['message' => 'Order not found', 'code' => 'NOT_FOUND'], 404);
		})
		->name('order.get');

	Route::put('/order/{order:order_number}', [OrderController::class, 'edit'])
		->missing(function () {
			return response()->json(['message' => 'Order not found', 'code' => 'NOT_FOUND'], 404);
		})
		->name('order.edit');

	Route::delete('/orders', [OrderController::class, 'clean'])->name('orders.clean');

	// order items
	// Route::get('/order/{order:order_number}/order-item/{orderItem:id}', [DataController::class, 'getOrderItem'])
	// 	->missing(function () {
	// 		return response()->json(['message' => 'Order item not found'], 404);
	// 	})
	// 	->name('order.item.get');

	Route::post('/order-item', [OrderItemController::class, 'store'])
		->name('order.item.store');

	Route::put('/order/{order:order_number}/order-item/{orderItem:id}', [OrderItemController::class, 'edit'])
		->missing(function () {
			return response()->json(['message' => 'Order item not found'], 404);
		})
		->name('order.item.edit');

	Route::delete('/order/{order:order_number}/order-item/{orderItem:id}', [OrderItemController::class, 'delete'])
		->missing(function () {
			return response()->json(['message' => 'Order item not found'], 404);
		})
		->name('order.item.delete');

	// schedule
	Route::get('/schedule', [ProductionScheduleController::class, 'schedule'])->name('schedule');

})->middleware('auth:sanctum');
