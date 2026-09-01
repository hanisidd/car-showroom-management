<?php

namespace Database\Seeders;

use App\Models\FuelType;
use Illuminate\Database\Seeder;

class FuelTypeSeeder extends Seeder
{
    public function run(): void
    {
        $fuelTypes = [
            'Petrol',
            'Diesel',
            'Hybrid (HEV)',
            'Plug-in Hybrid (PHEV)',
            'Electric (EV)',
            'CNG',
        ];

        foreach ($fuelTypes as $fuel) {
            FuelType::firstOrCreate(['name' => $fuel]);
        }
    }
}