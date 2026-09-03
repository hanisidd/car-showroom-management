<?php

namespace Database\Seeders;

use App\Models\TestDrive;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class TestDriveSeeder extends Seeder
{
    public function run(): void
    {
        $vehicle = Vehicle::first();

        if ($vehicle) {
            TestDrive::create([
                'vehicle_id' => $vehicle->id,
                'customer_name' => 'Michael Scott',
                'customer_email' => 'michael@example.com',
                'customer_phone' => '+15550192834',
                'scheduled_at' => now()->addDays(2),
                'status' => 'Pending',
            ]);
        }
    }
}