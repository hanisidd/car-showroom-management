<x-mail::message>
# Test Drive Update

Hello {{ $testDrive->customer_name }},

Your test drive request for **{{ $testDrive->vehicle->make->name ?? '' }} {{ $testDrive->vehicle->model->name ?? '' }} ({{ $testDrive->vehicle->year ?? '' }})** has been **{{ strtoupper($testDrive->status) }}**.

<x-mail::panel>
**Appointment Details:**
- **Date & Time:** {{ \Carbon\Carbon::parse($testDrive->scheduled_at)->format('F j, Y - g:i A') }}
- **VIN:** {{ $testDrive->vehicle->vin ?? 'N/A' }}
- **Status:** {{ $testDrive->status }}
</x-mail::panel>

@if($testDrive->status === 'Confirmed')
Our team looks forward to welcoming you to our showroom. Please bring your valid driver's license.
@else
We regret to inform you that your selected slot is unavailable. Please visit our website to select an alternative date or vehicle.
@endif

<x-mail::button :url="config('app.url')">
Visit Showroom Fleet
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>