<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            MakeSeeder::class,
            ModelSeeder::class,
            FuelTypeSeeder::class,
            BodyTypeSeeder::class,
            VehicleSeeder::class,
            InquirySeeder::class,
            TestDriveSeeder::class,
        ]);
    }
}