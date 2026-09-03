<?php

namespace App\Mail;

use App\Models\TestDrive;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestDriveStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public TestDrive $testDrive) {}

    public function envelope(): Envelope
    {
        $status = ucfirst($this->testDrive->status);
        return new Envelope(
            subject: "Your Test Drive Booking is {$status} - Luxury Motors",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.test_drive_status',
        );
    }
}