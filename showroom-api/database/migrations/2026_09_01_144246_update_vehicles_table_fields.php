<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            // Drop old plain text columns if they exist
            if (Schema::hasColumn('vehicles', 'make')) {
                $table->dropColumn('make');
            }
            if (Schema::hasColumn('vehicles', 'model')) {
                $table->dropColumn('model');
            }
            if (Schema::hasColumn('vehicles', 'fuel_type')) {
                $table->dropColumn('fuel_type');
            }

            // Add VIN, LOT number, and Description
            $table->string('vin')->nullable()->after('transmission');
            $table->string('lot_number')->nullable()->after('vin');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('fuel_type')->nullable();
            $table->dropColumn(['vin', 'lot_number']);
        });
    }
};