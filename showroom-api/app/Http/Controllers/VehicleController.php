<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    // GET /api/vehicles (With Filtering and Pagination)
    public function index(Request $request)
    {
        $query = Vehicle::with(['images', 'make', 'model', 'fuelType', 'bodyType'])
            ->where('status', 'Available');

        // Filter by Fuel Type name or ID
        if ($request->has('fuel_type') && $request->fuel_type !== 'All') {
            $query->whereHas('fuelType', function ($q) use ($request) {
                $q->where('name', $request->fuel_type);
            });
        }

        // Filter by Make ID or name
        if ($request->has('make_id')) {
            $query->where('make_id', $request->make_id);
        } elseif ($request->has('make')) {
            $query->whereHas('make', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->make . '%');
            });
        }

        // Filter by Model ID
        if ($request->has('model_id')) {
            $query->where('model_id', $request->model_id);
        }

        if ($request->has('body_type_id')) {
            $query->where('body_type_id', $request->body_type_id);
        }

        return response()->json($query->latest()->get());
    }

    // GET /api/vehicles/{id}
    public function show($id)
    {
        $vehicle = Vehicle::with(['images', 'make', 'model', 'fuelType', 'bodyType'])->findOrFail($id);
        return response()->json($vehicle);
    }
}