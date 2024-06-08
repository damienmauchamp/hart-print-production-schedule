<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property Order order
 * @property Product product
 * @property int quantity
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class OrderItem extends Model {
	use HasFactory;

	public $fillable = [
		'product_id',
		'quantity',
	];

	public function order() {
		return $this->belongsTo(Order::class);
	}

	public function product() {
		return $this->belongsTo(Product::class);
	}

}
