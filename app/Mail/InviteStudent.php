<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InviteStudent extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The SendInvite model object.
     *
     * @var \App\Models\SendInvite
     */
    private $invite;

    /**
     * The boolean for student exists.
     *
     * @var boolean
     */
    private $studentExists;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($invite, $studentExists)
    {
        $this->invite = $invite;
        $this->studentExists = $studentExists;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $routeUrl = route('studregister', ['token' => $this->invite->token]);
        if ($this->studentExists == true) {
            $routeUrl = route('student.login', ['token' => $this->invite->token]);
        }

        return $this->from(config('mail.from.address'), config('app.name'))
                    ->subject('Class Registration invite')
                    ->markdown('emails.send-class-invite')
                    ->with([
                        'invite' => $this->invite,
                        'studentExists' => $this->studentExists,
                        'routeUrl' => $routeUrl
                    ]);
    }
}
