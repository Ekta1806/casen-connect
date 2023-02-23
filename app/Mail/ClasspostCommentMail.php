<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class ClasspostCommentMail extends Mailable implements ShouldQueue
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
        $routeUrl = route('classPost.show', ($this->details['post_id']));
        return $this->subject('Casen Connect ClassPost Comments Mail')
                    ->markdown('emails.classpost-comment-mail')->with([
                            'details' => $this->details,
                            'routeUrl' => $routeUrl,
                        ]);
    }
}