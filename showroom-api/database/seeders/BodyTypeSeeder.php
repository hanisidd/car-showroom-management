<?php

namespace Database\Seeders;

use App\Models\BodyType;
use Illuminate\Database\Seeder;

class BodyTypeSeeder extends Seeder
{
    public function run(): void
    {
        $bodyTypes = [
            'SUV',
            'Sedan',
            'Coupe',
            'Hatchback',
            'CrossOver',
            'Sports',
            'Truck',
            'Convertible',
            'Station Wagon',
            'Van / Minivan',
        ];

        foreach ($bodyTypes as $type) {
            BodyType::firstOrCreate(['name' => $type]);
        }
    }
}