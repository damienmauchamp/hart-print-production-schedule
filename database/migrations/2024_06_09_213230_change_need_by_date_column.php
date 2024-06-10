<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void {
		// Setting the need_by_date column to be a nullable date
		Schema::table('orders', function (Blueprint $table) {
			$table->date('need_by_date')->nullable()->change();
		});
	}

	public function down(): void {
		Schema::table('orders', function (Blueprint $table) {
			$table->dateTime('need_by_date')->change();
		});
	}
};
