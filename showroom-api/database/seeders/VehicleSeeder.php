<?php

namespace Database\Seeders;

use App\Models\FuelType;
use App\Models\Make;
use App\Models\Model as CarModel;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        // Sample dataset with matching Makes, Models, Fuel Types, and Unsplash Car Images
        $vehiclesData = [
            [
                'make' => 'Audi',
                'model' => 'e-tron',
                'fuel_type' => 'Electric (EV)',
                'year' => 2024,
                'price' => 38500000.00, // PKR
                'condition' => 'New',
                'body_type' => 'SUV',
                'transmission' => 'Automatic',
                'exterior_color' => '#18181b',
                'interior_color' => '#f4f4f5',
                'mileage' => 1500,
                'vin' => 'WAUZZZF88R1029384',
                'lot_number' => 'LOT-8821',
                'description' => 'Mint condition luxury electric SUV with matrix LED lights, panorama sunroof, and dual-motor all-wheel drive.',
                'images' => [
                    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Porsche',
                'model' => 'Taycan',
                'fuel_type' => 'Electric (EV)',
                'year' => 2023,
                'price' => 62000000.00,
                'condition' => 'Used',
                'body_type' => 'Sports',
                'transmission' => 'Automatic',
                'exterior_color' => '#1e3a8a',
                'interior_color' => '#18181b',
                'mileage' => 4500,
                'vin' => 'WP0AA2Y10PSA12984',
                'lot_number' => 'LOT-9920',
                'description' => 'Porsche Taycan 4S in Gentian Blue Metallic. Features Performance Battery Plus, Sport Chrono Package, and 21-inch Mission E wheels.',
                'images' => [
                    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Toyota',
                'model' => 'Fortuner',
                'fuel_type' => 'Diesel',
                'year' => 2023,
                'price' => 18900000.00,
                'condition' => 'Certified Pre-Owned',
                'body_type' => 'SUV',
                'transmission' => 'Automatic',
                'exterior_color' => '#ffffff',
                'interior_color' => '#713f12',
                'mileage' => 12800,
                'vin' => 'MROB1339801283921',
                'lot_number' => 'LOT-4412',
                'description' => 'Toyota Fortuner Sigma 4 Legender. Single hand driven, fully maintained through Toyota authorized dealership.',
                'images' => [
                    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Honda',
                'model' => 'Civic',
                'fuel_type' => 'Petrol',
                'year' => 2022,
                'price' => 8850000.00,
                'condition' => 'Used',
                'body_type' => 'Sedan',
                'transmission' => 'CVT',
                'exterior_color' => '#3f3f46',
                'interior_color' => '#18181b',
                'mileage' => 22000,
                'vin' => 'NLAFC1670NW102938',
                'lot_number' => 'LOT-3391',
                'description' => 'Honda Civic RS Turbo 11th Generation. Features Honda Sensing suite, digital cluster, and leather upholstery.',
                'images' => [
                    'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Tucson',
                'fuel_type' => 'Petrol',
                'year' => 2023,
                'price' => 8200000.00,
                'condition' => 'Used',
                'body_type' => 'SUV',
                'transmission' => 'Automatic',
                'exterior_color' => '#1e293b',
                'interior_color' => '#e2e8f0',
                'mileage' => 11000,
                'vin' => 'KM8J2389012938472',
                'lot_number' => 'LOT-7712',
                'description' => 'Hyundai Tucson AWD Ultimate variant. Panoramic sunroof, wireless charger, and powered tailgate.',
                'images' => [
                    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'KIA',
                'model' => 'Sportage',
                'fuel_type' => 'Petrol',
                'year' => 2021,
                'price' => 7400000.00,
                'condition' => 'Used',
                'body_type' => 'SUV',
                'transmission' => 'Automatic',
                'exterior_color' => '#000000',
                'interior_color' => '#f4f4f5',
                'mileage' => 31000,
                'vin' => 'KNA38910238129834',
                'lot_number' => 'LOT-2109',
                'description' => 'KIA Sportage AWD in Panthera Metal. Clean exterior, pristine interior condition, bumper-to-bumper original.',
                'images' => [
                    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'BMW',
                'model' => 'i4',
                'fuel_type' => 'Electric (EV)',
                'year' => 2024,
                'price' => 45000000.00,
                'condition' => 'New',
                'body_type' => 'Sedan',
                'transmission' => 'Automatic',
                'exterior_color' => '#0284c7',
                'interior_color' => '#18181b',
                'mileage' => 250,
                'vin' => 'WBA31AW080FK10293',
                'lot_number' => 'LOT-1002',
                'description' => 'BMW i4 eDrive40 M Sport package. Curved display with iDrive 8, Harman Kardon surround sound, ambient lighting.',
                'images' => [
                    'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'S-Class',
                'fuel_type' => 'Hybrid (HEV)',
                'year' => 2022,
                'price' => 95000000.00,
                'condition' => 'Certified Pre-Owned',
                'body_type' => 'Sedan',
                'transmission' => 'Automatic',
                'exterior_color' => '#09090b',
                'interior_color' => '#fef3c7',
                'mileage' => 8900,
                'vin' => 'W1K2231201A983210',
                'lot_number' => 'LOT-0012',
                'description' => 'Mercedes-Benz S500 4MATIC Long Wheelbase. Exclusive Nappa leather, rear seat entertainment, AIRMATIC suspension.',
                'images' => [
                    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'MG',
                'model' => 'HS',
                'fuel_type' => 'Petrol',
                'year' => 2022,
                'price' => 6900000.00,
                'condition' => 'Used',
                'body_type' => 'SUV',
                'transmission' => 'DCT',
                'exterior_color' => '#dc2626',
                'interior_color' => '#7f1d1d',
                'mileage' => 19500,
                'vin' => 'LSJG1028391029834',
                'lot_number' => 'LOT-6651',
                'description' => 'MG HS Exclusive 1.5 Turbo in Dynamic Red with Trophy red leather interior, paddle shifters, and 360 camera.',
                'images' => [
                    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model 3',
                'fuel_type' => 'Electric (EV)',
                'year' => 2023,
                'price' => 21500000.00,
                'condition' => 'Used',
                'body_type' => 'Sedan',
                'transmission' => 'Automatic',
                'exterior_color' => '#ffffff',
                'interior_color' => '#ffffff',
                'mileage' => 9200,
                'vin' => '5YJ3E1EA8PF102938',
                'lot_number' => 'LOT-5520',
                'description' => 'Tesla Model 3 Long Range Dual Motor. Autopilot enabled, white interior upgrade, glass roof.',
                'images' => [
                    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
        ];

        foreach ($vehiclesData as $data) {
            $make = Make::where('name', $data['make'])->first();
            $model = CarModel::where('name', $data['model'])->first();
            $fuelType = FuelType::where('name', $data['fuel_type'])->first();

            // Create Vehicle Record linked to foreign IDs
            $vehicle = Vehicle::create([
                'make_id' => $make?->id,
                'model_id' => $model?->id,
                'fuel_type_id' => $fuelType?->id,
                'year' => $data['year'],
                'price' => $data['price'],
                'condition' => $data['condition'],
                'body_type' => $data['body_type'],
                'transmission' => $data['transmission'],
                'exterior_color' => $data['exterior_color'],
                'interior_color' => $data['interior_color'],
                'mileage' => $data['mileage'],
                'vin' => $data['vin'],
                'lot_number' => $data['lot_number'],
                'description' => $data['description'],
                'status' => 'Available',
            ]);

            // Attach Images to vehicle_images table
            foreach ($data['images'] as $index => $imageUrl) {
                $vehicle->images()->create([
                    'image_url' => $imageUrl,
                    'is_primary' => $index === 0, // First image becomes cover photo
                    'sort_order' => $index,
                ]);
            }
        }
    }
}