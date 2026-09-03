<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TestDrive;
use App\Mail\TestDriveStatusMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminTestDriveController extends Controller
{
    public function index(Request $request)
    {
        $query = TestDrive::with(['vehicle.make', 'vehicle.model', 'vehicle.images']);

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Confirmed,Completed,Cancelled',
        ]);

        $testDrive = TestDrive::with(['vehicle.make', 'vehicle.model'])->findOrFail($id);
        $testDrive->update(['status' => $validated['status']]);

        // Send Email Notification via Gmail SMTP
        try {
            Mail::to($testDrive->customer_email)->send(new TestDriveStatusMail($testDrive));
        } catch (\Exception $e) {
            // Log mail exception if necessary
        }

        return response()->json([
            'message' => 'Status updated and email dispatched.',
            'data'    => $testDrive,
        ]);
    }

    public function destroy($id)
    {
        $testDrive = TestDrive::findOrFail($id);
        $testDrive->delete();

        return response()->json(['message' => 'Booking deleted successfully.']);
    }
}