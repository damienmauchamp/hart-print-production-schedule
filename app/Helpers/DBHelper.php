<?php

namespace App\Helpers;

class DBHelper {

	public static function orderBy(?string $sort = null): array {
		return [
			static::parseSort($sort),
			static::parseSortOrder($sort),
		];
	}

	public static function parseSort(?string $sort = null): string {
		return preg_replace('/^-/', '', $sort);
	}
	public static function parseSortOrder(?string $sort = null): string {
		if (!$sort) {
			return 'asc';
		}

		return str_starts_with($sort, '-') ? 'desc' : 'asc';
	}
}
