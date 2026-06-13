<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SettlementMail extends Mailable
{
    use Queueable, SerializesModels;
    public $email;
    public $bookings;
    public $amount;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email, $bookings, $amount)
    {
        $this->email = $email;
        $this->bookings = $bookings;
        $this->amount = $amount;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject='Payment settlement';
        return $this->view('emails.settlementmail')->subject($subject);
        
    }
}
