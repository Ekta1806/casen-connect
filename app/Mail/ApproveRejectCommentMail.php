<?php
  
namespace App\Mail;
  
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
  
class ApproveRejectCommentMail extends Mailable implements ShouldQueue
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
        if($this->details['type'] == "student"){
            $routeUrl = route('teacher.posts.show', ($this->details['post_id']));
        }
        if($this->details['type'] == "teacher"){
            $routeUrl = route('teacher.classPost.show', ($this->details['post_id']));
        }
        if($this->details['type'] == "admin"){
            $routeUrl = route('student.adminposts.show', ($this->details['post_id']));
        }
        return $this->subject('Casen Connect Comment Approve/Reject Mail')
                    ->markdown('emails.approve-reject-comment-mail')->with([
                            'details' => $this->details,
                            'routeUrl' => $routeUrl,
                        ]);
    }
}