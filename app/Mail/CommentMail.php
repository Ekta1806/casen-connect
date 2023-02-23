<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class CommentMail extends Mailable implements ShouldQueue
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
        $routeUrl = route('posts.show', ($this->details['post_id']));
        return $this->subject('Casen Connect Post Comments Mail')
                    ->markdown('emails.comment-mail')->with([
                            'routeUrl' => $routeUrl,
                            'details' => $this->details,
                        ]);
    }
}