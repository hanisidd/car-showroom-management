<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'make_id' => 'required|string|max:100',
            'model_id' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'required|numeric|min:0',
            'condition' => 'required|in:New,Used,Certified Pre-Owned',
            'body_type' => 'required|string',
            'vin' => 'required|string',
            'lot_number' => 'required|string',
            'fuel_type_id' => 'required|string|max:100',
            'transmission' => 'required|string',
            'mileage' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
            // In Store Validation:
            'exterior_color' => 'nullable|string|max:7',
            'interior_color' => 'nullable|string|max:7',
        ];
    }
}