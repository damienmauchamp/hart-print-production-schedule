<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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

	protected function casts(): array {
		return [
			'need_by_date' => 'date',
		];
	}

	public static function boot() {

		parent::boot();

		static::creating(function ($model) {
			// generate order number
			$model->order_number = 'ORD' . date('ymdHi') . Str::random(4);
		});

		static::deleting(function ($model) {
			// deleting order items before deleting order
			$model->orderItems()->each(function ($item) {
				$item->delete();
			});
		});
	}

	public function orderItems() {
		return $this->hasMany(OrderItem::class);
	}
}
