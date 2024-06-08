<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property ProductType $productType
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Product extends Model {
	use HasFactory;

	protected $fillable = [
		'name',
		'product_type_id',
	];

	public function productType() {
		return $this->belongsTo(ProductType::class);
	}

}
