<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property int $units_per_hour
 * @property Product[] $products
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class ProductType extends Model {
	use HasFactory;

	protected $fillable = ['name', 'units_per_hour'];

	public function products() {
		return $this->hasMany(Product::class);
	}

	public function __toString() {
		return $this->name;
	}
}
