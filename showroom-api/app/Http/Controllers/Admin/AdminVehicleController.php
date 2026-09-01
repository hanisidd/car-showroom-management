<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminVehicleController extends Controller
{
    // GET /api/admin/vehicles
    public function index()
    {
        $vehicles = Vehicle::with(['images', 'make', 'model', 'fuelType'])->latest()->get();
        return response()->json(['data' => $vehicles]);
    }

    // POST /api/admin/vehicles
    public function store(Request $request)
    {
        $validated = $request->validate([
            'make_id' => 'required|exists:makes,id',
            'model_id' => 'required|exists:models,id',
            'fuel_type_id' => 'required|exists:fuel_types,id',
            'year' => 'required|integer',
            'price' => 'required|numeric',
            'condition' => 'required|in:New,Used,Certified Pre-Owned',
            'body_type_id' => 'nullable|exists:body_types,id',
            'body_type' => 'required|string',
            'transmission' => 'required|string',
            'mileage' => 'required|integer',
            'vin' => 'required|string|unique:vehicles,vin',
            'lot_number' => 'nullable|string',
            'description' => 'nullable|string',
            'exterior_color' => 'nullable|string|max:7',
            'interior_color' => 'nullable|string|max:7',
            'cover_index' => 'required|integer',
            'images' => 'required|array|max:15',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $vehicle = Vehicle::create([
            'make_id' => $validated['make_id'],
            'model_id' => $validated['model_id'],
            'fuel_type_id' => $validated['fuel_type_id'],
            'year' => $validated['year'],
            'price' => $validated['price'],
            'condition' => $validated['condition'],
            'body_type_id' => $validated['body_type_id'],
            'body_type' => $validated['body_type'],
            'transmission' => $validated['transmission'],
            'exterior_color' => $validated['exterior_color'] ?? '#000000',
            'interior_color' => $validated['interior_color'] ?? '#ffffff',
            'mileage' => $validated['mileage'],
            'vin' => $validated['vin'] ?? null,
            'lot_number' => $validated['lot_number'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('vehicles', 'public');
                $vehicle->images()->create([
                    'image_url' => '/storage/' . $path,
                    'is_primary' => $index == $validated['cover_index'],
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json($vehicle->load(['images', 'make', 'model', 'fuelType']), 201);
    }

    // PUT /api/admin/vehicles/{id}
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'make_id' => 'sometimes|exists:makes,id',
            'model_id' => 'sometimes|exists:models,id',
            'fuel_type_id' => 'sometimes|exists:fuel_types,id',
            'year' => 'sometimes|integer',
            'price' => 'sometimes|numeric',
            'condition' => 'sometimes|in:New,Used,Certified Pre-Owned',
            'body_type' => 'sometimes|string',
            'transmission' => 'sometimes|string',
            'exterior_color' => 'sometimes|nullable|string|max:7',
            'interior_color' => 'sometimes|nullable|string|max:7',
            'mileage' => 'sometimes|integer',
            'vin' => 'required|string|unique:vehicles,vin,' . $vehicle->id,
            'lot_number' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $vehicle->update($validated);

        return response()->json($vehicle->load(['images', 'make', 'model', 'fuelType']));
    }

    // POST /api/admin/vehicles/{id}/images
    public function uploadImages(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $lastSortOrder = $vehicle->images()->max('sort_order') ?? 0;

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('vehicles', 'public');
            $vehicle->images()->create([
                'image_url' => '/storage/' . $path,
                'is_primary' => false,
                'sort_order' => $lastSortOrder + $index + 1,
            ]);
        }

        return response()->json($vehicle->load('images'));
    }

    // DELETE /api/admin/vehicle-images/{id}
    public function deleteImage($id)
    {
        $image = VehicleImage::findOrFail($id);
        
        // Remove file from storage disk if exists
        $filePath = str_replace('/storage/', '', $image->image_url);
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        $image->delete();

        return response()->json(['message' => 'Image removed successfully']);
    }

    // DELETE /api/admin/vehicles/{id}
    public function destroy($id)
    {
        Vehicle::destroy($id);
        return response()->json(['message' => 'Vehicle deleted successfully']);
    }
}