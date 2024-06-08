<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $order_number
 * @property string $customer_name
 * @property Carbon $need_by_date
 * @property string $status
 * @property OrderItem[] $orderItems
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Order extends Model {
	use HasFactory;

	protected $fillable = [
		'order_number',
		'customer_name',
		'need_by_date',
		'status',
	];

	public function orderItems() {
		return $this->hasMany(OrderItem::class);
	}
}
