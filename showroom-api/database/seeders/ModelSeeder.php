<?php

namespace Database\Seeders;

use App\Models\Make;
use App\Models\Model as CarModel;
use Illuminate\Database\Seeder;

class ModelSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Toyota' => [
                'Corolla',
                'Yaris',
                'Fortuner',
                'Hilux Revo',
                'Land Cruiser',
                'Prado',
                'Prius',
                'Camry',
                'Corolla Cross',
            ],
            'Honda' => [
                'Civic',
                'City',
                'BR-V',
                'HR-V',
                'Vezel',
                'CR-V',
                'Accord',
            ],
            'Suzuki' => [
                'Alto',
                'Cultus',
                'Wagon R',
                'Swift',
                'Bolan',
                'Every',
                'Jimny',
            ],
            'Hyundai' => [
                'Elantra',
                'Tucson',
                'Sonata',
                'Santa Fe',
                'Porter H-100',
            ],
            'KIA' => [
                'Sportage',
                'Picanto',
                'Stonic',
                'Sorento',
                'Carnival',
            ],
            'Haval' => [
                'H6',
                'H6 HEV',
                'Jolion',
                'Jolion HEV',
            ],
            'MG' => [
                'HS',
                'HS PHEV',
                'ZS',
                'ZS EV',
                'GT',
            ],
            'Changan' => [
                'Alsvin',
                'Oshan X7',
                'Karvaan',
            ],
            'Audi' => [
                'e-tron',
                'A4',
                'A6',
                'Q7',
            ],
            'BMW' => [
                '3 Series',
                '5 Series',
                '7 Series',
                'X5',
                'i4',
            ],
            'Mercedes-Benz' => [
                'C-Class',
                'E-Class',
                'S-Class',
                'G-Class',
                'EQE',
            ],
            'Porsche' => [
                'Taycan',
                '911 GT3',
                'Cayenne',
                'Panamera',
            ],
            'Tesla' => [
                'Model 3',
                'Model Y',
                'Model S',
                'Model X',
            ],
        ];

        foreach ($data as $makeName => $models) {
            $make = Make::where('name', $makeName)->first();

            if ($make) {
                foreach ($models as $modelName) {
                    CarModel::firstOrCreate([
                        'make_id' => $make->id,
                        'name' => $modelName,
                    ]);
                }
            }
        }
    }
}