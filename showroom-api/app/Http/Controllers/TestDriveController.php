<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookTestDriveRequest;
use App\Models\TestDrive;

class TestDriveController extends Controller
{
    // POST /api/test-drives
    public function store(BookTestDriveRequest $request)
    {
        $testDrive = TestDrive::create($request->validated());

        return response()->json([
            'message' => 'Test drive booked successfully!',
            'data' => $testDrive
        ], 201);
    }
}