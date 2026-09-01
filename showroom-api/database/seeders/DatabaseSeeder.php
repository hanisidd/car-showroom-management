<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MakeSeeder::class,
            ModelSeeder::class,
            FuelTypeSeeder::class,
            BodyTypeSeeder::class, // Added BodyTypeSeeder
            VehicleSeeder::class,
        ]);
    }
}