<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource {
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array {
		return [
			'id' => $this->id,
			'name' => $this->name,
			'type' => $this->productType->name,
			'type_id' => $this->productType->id,
			'number' => $this->productType->id,
			'units_per_hour' => $this->productType->units_per_hour,
		];
	}
}
