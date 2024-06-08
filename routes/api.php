<?php

use App\Http\Controllers\DataController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
	return $request->user();
})->middleware('auth:sanctum');

// todo : authentification
// Route::group(['middleware' => ['auth', 'verified']], function () {

// data
Route::get('/seed', [DataController::class, 'seed'])->name('seed');
Route::get('/products', [DataController::class, 'products'])->name('products');

// orders
Route::get('/orders', [OrderController::class, 'list'])->name('orders.list');

Route::get('/order/{order:order_number}', [OrderController::class, 'index'])->name('order.get');
Route::put('/order/{order:order_number}', [OrderController::class, 'putOrder'])->name('order.put')
	->missing(function () {
		return response()->json(['message' => 'Order not found'], 404);
	});

// order items
// Route::get('/order/{order:order_number}/order-item/{order_item:id}', [DataController::class, 'getOrderItem'])->name('order.item.get');

Route::post('/order-item', [OrderItemController::class, 'storeOrderItem'])
	->name('order.item.store');

Route::put('/order/{order:order_number}/order-item/{orderItem:id}', [OrderItemController::class, 'putOrderItem'])
	->missing(function () {
		return response()->json(['message' => 'Order item not found'], 404);
	})
	->name('order.item.put');

Route::delete('/order/{order:order_number}/order-item/{orderItem:id}', [OrderItemController::class, 'deleteOrderItem'])
	->missing(function () {
		return response()->json(['message' => 'Order item not found'], 404);
	})
	->name('order.item.delete');

// });
