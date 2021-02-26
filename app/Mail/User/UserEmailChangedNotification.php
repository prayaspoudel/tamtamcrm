<?php

namespace App\Mail\User;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserEmailChangedNotification extends Mailable
{
    use Queueable, SerializesModels;

    private User $user;

    private $message;

    /**
     * @var array
     */
    private array $message_array;

    /**
     * Create a new message instance.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->setSubject();
        $this->setMessage();
        $this->buildMessage();

        return $this->to($this->user->email)
                    ->from(config('taskmanager.from_email'))
                    ->subject($this->subject)
                    ->markdown(
                        'email.admin.new',
                        [
                            'data' => $this->message_array
                        ]
                    );
    }

    private function setSubject()
    {
        $this->subject = trans(
            'texts.email_changed_subject',
            $this->buildDataArray()
        );
    }

    private function buildDataArray()
    {
        return [
            'email' => $this->user->email
        ];
    }

    private function setMessage()
    {
        $this->message = trans(
            'texts.email_changed',
            $this->buildDataArray()

        );
    }

    private function buildMessage()
    {
        $account = !empty($this->user->account_user()) ? $this->user->account_user(
        )->account : $this->user->accounts->first();

        $this->message_array = [
            'title'   => $this->subject,
            'message' => $this->message,
            'logo'    => $account->present()->logo(),
        ];
    }


}