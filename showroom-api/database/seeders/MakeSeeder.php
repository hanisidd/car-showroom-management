<?php

namespace Database\Seeders;

use App\Models\Make;
use Illuminate\Database\Seeder;

class MakeSeeder extends Seeder
{
    public function run(): void
    {
        $makes = [
            'Toyota',
            'Honda',
            'Suzuki',
            'Hyundai',
            'KIA',
            'Haval',
            'MG',
            'Changan',
            'Proton',
            'DFSK',
            'Audi',
            'BMW',
            'Mercedes-Benz',
            'Porsche',
            'Tesla',
        ];

        foreach ($makes as $make) {
            Make::firstOrCreate(['name' => $make]);
        }
    }
}