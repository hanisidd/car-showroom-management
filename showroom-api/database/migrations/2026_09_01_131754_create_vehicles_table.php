<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->decimal('price', 12, 2);
            $table->enum('condition', ['New', 'Used', 'Certified Pre-Owned'])->default('Used');
            $table->string('body_type'); // SUV, Sedan, Coupe, Sports, Electric
            $table->string('fuel_type'); // Petrol, Diesel, Electric, Hybrid
            $table->string('transmission'); // Automatic, Manual
            $table->integer('mileage')->default(0);
            $table->text('description')->nullable();
            $table->enum('status', ['Available', 'Reserved', 'Sold'])->default('Available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};