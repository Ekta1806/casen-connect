<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class LikeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
  
    private $details;
    private $user;
    private $type;
  
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details, $user, $type)
    {
        $this->details = $details;
        $this->user = $user;
        $this->type = $type;
    }
  
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->type == "student"){
            $routeUrl = route('posts.show', ($this->details->id));
        }
        if($this->type == "teacher"){
            $routeUrl = route('teacher.classPost.show', ($this->details->id));
        }
        
        return $this->subject('Casen Connect Post Likes Mail')
                    ->markdown('emails.like-mail')->with([
                            'post' => $this->details,
                            'user' => $this->user,
                            'routeUrl' => $routeUrl,
                            'type' => $this->type
                        ]);
    }
}