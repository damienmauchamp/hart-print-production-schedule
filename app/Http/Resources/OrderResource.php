<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource {
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array {
		return [
			'id' => $this->id,
			'order_number' => $this->order_number,
			'items' => new OrderItemCollection($this->orderItems),
			'customer_name' => $this->customer_name,
			'need_by_date' => $this->need_by_date,
			'status' => $this->status,
			// 'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];

		return parent::toArray($request);
	}
}
