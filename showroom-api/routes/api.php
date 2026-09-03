<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\TestDriveController;
use App\Http\Controllers\Admin\AdminVehicleController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminTestDriveController;
use App\Http\Controllers\Admin\LookupController;
use App\Http\Controllers\InquiryController;

// Public Customer Routes
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::post('/test-drives', [TestDriveController::class, 'store']); // Customer Booking

Route::get('/makes', [LookupController::class, 'getMakes']);
Route::get('/models', [LookupController::class, 'getModels']);
Route::get('/fuel-types', [LookupController::class, 'getFuelTypes']);
Route::get('/body-types', [LookupController::class, 'getBodyTypes']);

// Admin Auth Routes
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/contact', [InquiryController::class, 'store']);

// Protected Admin Routes (Sanctum Token Required)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    // Admin Vehicle Management
    Route::get('/vehicles', [AdminVehicleController::class, 'index']);
    Route::post('/vehicles', [AdminVehicleController::class, 'store']);
    Route::put('/vehicles/{id}', [AdminVehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [AdminVehicleController::class, 'destroy']);
    Route::post('/vehicles/{id}/images', [AdminVehicleController::class, 'uploadImages']);
    Route::delete('/vehicle-images/{id}', [AdminVehicleController::class, 'deleteImage']);

    // Admin Test Drive Management
    Route::get('/test-drives', [AdminTestDriveController::class, 'index']);
    Route::put('/test-drives/{id}/status', [AdminTestDriveController::class, 'updateStatus']);
    Route::delete('/test-drives/{id}', [AdminTestDriveController::class, 'destroy']);

    // Lookups Management
    Route::get('/lookups', [LookupController::class, 'getAllLookups']);
    Route::post('/makes', [LookupController::class, 'storeMake']);
    Route::put('/makes/{id}', [LookupController::class, 'updateMake']);
    Route::delete('/makes/{id}', [LookupController::class, 'destroyMake']);
    Route::post('/models', [LookupController::class, 'storeModel']);
    Route::put('/models/{id}', [LookupController::class, 'updateModel']);
    Route::delete('/models/{id}', [LookupController::class, 'destroyModel']);
    Route::post('/fuel-types', [LookupController::class, 'storeFuelType']);
    Route::put('/fuel-types/{id}', [LookupController::class, 'updateFuelType']);
    Route::delete('/fuel-types/{id}', [LookupController::class, 'destroyFuelType']);
    Route::post('/body-types', [LookupController::class, 'storeBodyType']);
    Route::put('/body-types/{id}', [LookupController::class, 'updateBodyType']);
    Route::delete('/body-types/{id}', [LookupController::class, 'destroyBodyType']);

    Route::get('/inquiries', [InquiryController::class, 'index']);
    Route::delete('/inquiries/{id}', [InquiryController::class, 'destroy']);
});