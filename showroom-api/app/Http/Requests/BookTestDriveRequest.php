<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookTestDriveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id'     => 'required|exists:vehicles,id',
            'customer_name'  => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'scheduled_at'   => 'required|date|after:now',
        ];
    }
}