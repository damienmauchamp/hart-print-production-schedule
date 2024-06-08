<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource {
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array {
		return [
			'id' => $this->id,
			// 'order' => $this->order,
			'product' => new ProductResource($this->product),
			'quantity' => $this->quantity,
			// 'created_at' => $this->created_at,
			// 'updated_at' => $this->updated_at,
		];
	}
}
