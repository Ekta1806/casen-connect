<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class ClasspostTaggedMail extends Mailable implements ShouldQueue
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
        if($this->details['post_type'] == "student_post"){
            $routeUrl = route('teacher.posts.show', ($this->details['post_id']));
        }
        if($this->details['post_type'] == "teacher_post"){
            $routeUrl = route('teacher.classPost.show', ($this->details['post_id']));
        }
        return $this->subject('Casen Connect ClassPost Tag Mail')
                    ->markdown('emails.classpost-tagged-mail')->with([
                            'details' => $this->details,
                            'routeUrl' => $routeUrl,
                        ]);
    }
}