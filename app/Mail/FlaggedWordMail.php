<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class FlaggedWordMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
  
    private $details;
  
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details)
    {
        $this->details = $details;
    }
  
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $routeUrl = route('teacher.flaggedWords');
        return $this->subject('Casen Connect Flagged Words Mail')
                    ->markdown('emails.flagged-word')->with([
                            'details' => $this->details,
                            'routeUrl' => $routeUrl,
                        ]);
    }
}