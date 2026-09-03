<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use Illuminate\Database\Seeder;

class InquirySeeder extends Seeder
{
    public function run(): void
    {
        Inquiry::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'subject' => 'Inquiry about Porsche Taycan',
            'message' => 'Hi, is the 2023 Porsche Taycan still available for viewing?',
        ]);

        Inquiry::create([
            'name' => 'Sarah Connor',
            'email' => 'sarah@example.com',
            'phone' => '+1987654321',
            'subject' => 'Financing Options',
            'message' => 'Do you offer leasing or bank financing for imported luxury EVs?',
        ]);
    }
}