<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\Admin\AdminVehicleController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\LookupController;

// Public Customer Routes
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::get('/makes', [LookupController::class, 'getMakes']);
Route::get('/models', [LookupController::class, 'getModels']);
Route::get('/fuel-types', [LookupController::class, 'getFuelTypes']);
Route::get('/body-types', [LookupController::class, 'getBodyTypes']);
// Admin Auth Routes
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Protected Admin Routes (Sanctum Token Required)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    // Admin Vehicle Management
    Route::get('/vehicles', [AdminVehicleController::class, 'index']);
    Route::post('/vehicles', [AdminVehicleController::class, 'store']);
    Route::put('/vehicles/{id}', [AdminVehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [AdminVehicleController::class, 'destroy']);

    // Additional Image Routes for Edit Modal
    Route::post('/vehicles/{id}/images', [AdminVehicleController::class, 'uploadImages']);
    Route::delete('/vehicle-images/{id}', [AdminVehicleController::class, 'deleteImage']);


    // Lookups Management
    Route::post('/makes', [LookupController::class, 'storeMake']);
    Route::put('/makes/{id}', [LookupController::class, 'updateMake']);
    Route::delete('/makes/{id}', [LookupController::class, 'destroyMake']);

    Route::post('/models', [LookupController::class, 'storeModel']);
    Route::put('/models/{id}', [LookupController::class, 'updateModel']);
    Route::delete('/models/{id}', [LookupController::class, 'destroyModel']);

    Route::post('/fuel-types', [LookupController::class, 'storeFuelType']);
    Route::put('/fuel-types/{id}', [LookupController::class, 'updateFuelType']);
    Route::delete('/fuel-types/{id}', [LookupController::class, 'destroyFuelType']);

    // Add under public customer routes


// Add under Protected Admin Routes group
Route::get('/lookups', [LookupController::class, 'getAllLookups']);

Route::post('/body-types', [LookupController::class, 'storeBodyType']);
Route::put('/body-types/{id}', [LookupController::class, 'updateBodyType']);
Route::delete('/body-types/{id}', [LookupController::class, 'destroyBodyType']);


});