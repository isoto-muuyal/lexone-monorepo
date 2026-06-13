<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Admin; 
use Illuminate\Http\Request;
use App\Models\Setting;


class TaskerConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;
    public $email;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email)
    {
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject='Your Account Verified';
        $siteSettings = Setting::first();
        $from_name = $siteSettings->siteName;
        $from_email = $siteSettings->smtpEmail;
        return $this->from($from_email, $from_name)
            ->view('emails.taskerconfirmation')
            ->subject($subject)
        ;
        // return $this->view('emails.taskerconfirmation')->subject($subject);
        
    }
}
