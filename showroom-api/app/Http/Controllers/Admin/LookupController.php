<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Make;
use App\Models\Model as CarModel;
use App\Models\FuelType;
use App\Models\BodyType;
use Illuminate\Http\Request;

class LookupController extends Controller
{
    public function getAllLookups()
    {
        return response()->json([
            'makes' => Make::all(),
            'models' => CarModel::with('make')->get(),
            'fuelTypes' => FuelType::all(),
            'bodyTypes' => BodyType::all(),
        ]);
    }

    // --- MAKES ---
    public function getMakes() { return response()->json(Make::all()); }
    public function storeMake(Request $request) {
        $data = $request->validate(['name' => 'required|unique:makes,name']);
        return response()->json(Make::create($data), 201);
    }
    public function updateMake(Request $request, $id) {
        $make = Make::findOrFail($id);
        $data = $request->validate(['name' => 'required|unique:makes,name,' . $id]);
        $make->update($data);
        return response()->json($make);
    }
    public function destroyMake($id) {
        $make = Make::findOrFail($id);
        if ($make->models()->exists() || $make->vehicles()->exists()) {
            return response()->json(['message' => 'Cannot delete make assigned to models or vehicles.'], 422);
        }
        $make->delete();
        return response()->json(['message' => 'Make deleted successfully']);
    }

    // --- MODELS ---
    public function getModels() { return response()->json(CarModel::with('make')->get()); }
    public function storeModel(Request $request) {
        $data = $request->validate(['make_id' => 'required|exists:makes,id', 'name' => 'required|string']);
        return response()->json(CarModel::create($data), 201);
    }
    public function updateModel(Request $request, $id) {
        $carModel = CarModel::findOrFail($id);
        $data = $request->validate(['make_id' => 'required|exists:makes,id', 'name' => 'required|string']);
        $carModel->update($data);
        return response()->json($carModel);
    }
    public function destroyModel($id) {
        $carModel = CarModel::findOrFail($id);
        if ($carModel->vehicles()->exists()) {
            return response()->json(['message' => 'Cannot delete model assigned to vehicles.'], 422);
        }
        $carModel->delete();
        return response()->json(['message' => 'Model deleted successfully']);
    }

    // --- FUEL TYPES ---
    public function getFuelTypes() { return response()->json(FuelType::all()); }
    public function storeFuelType(Request $request) {
        $data = $request->validate(['name' => 'required|unique:fuel_types,name']);
        return response()->json(FuelType::create($data), 201);
    }
    public function updateFuelType(Request $request, $id) {
        $fuelType = FuelType::findOrFail($id);
        $data = $request->validate(['name' => 'required|unique:fuel_types,name,' . $id]);
        $fuelType->update($data);
        return response()->json($fuelType);
    }
    public function destroyFuelType($id) {
        $fuelType = FuelType::findOrFail($id);
        if ($fuelType->vehicles()->exists()) {
            return response()->json(['message' => 'Cannot delete fuel type assigned to vehicles.'], 422);
        }
        $fuelType->delete();
        return response()->json(['message' => 'Fuel type deleted successfully']);
    }

    // --- BODY TYPES ---
    public function getBodyTypes() { return response()->json(BodyType::all()); }
    public function storeBodyType(Request $request) {
        $data = $request->validate(['name' => 'required|unique:body_types,name']);
        return response()->json(BodyType::create($data), 201);
    }
    public function updateBodyType(Request $request, $id) {
        $bodyType = BodyType::findOrFail($id);
        $data = $request->validate(['name' => 'required|unique:body_types,name,' . $id]);
        $bodyType->update($data);
        return response()->json($bodyType);
    }
    public function destroyBodyType($id) {
        $bodyType = BodyType::findOrFail($id);
        if ($bodyType->vehicles()->exists()) {
            return response()->json(['message' => 'Cannot delete body type assigned to vehicles.'], 422);
        }
        $bodyType->delete();
        return response()->json(['message' => 'Body type deleted successfully']);
    }
}