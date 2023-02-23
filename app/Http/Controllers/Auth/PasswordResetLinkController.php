<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     *
     * @return \Illuminate\View\View
     */
    public function create($type)
    {
        $guardNames = array_keys(config('auth.guards'));
        if (! in_array($type, $guardNames)) {
            return redirect(url('/'));
        }

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'user_type' => $type,
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
       
        $guardNames = array_keys(config('auth.guards'));

        $request->validate([
            'email' => 'required|email',
            'user_type' => 'required|in:'. implode(',', $guardNames),
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.


        $status = $this->broker()->sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            if($request->user_type == 'student'){

                return Inertia::render('Auth/Student/Login', [
                    'status' =>  __($status),
                    'type' => 'success',
                ]);
            }

            if ($request->user_type == 'admin') {

                return Inertia::render('Admin/Auth/Login', [
                    'status' =>  __($status),
                    'type' => 'success',
                ]);
            }
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return IlluminateContractsAuthStatefulGuard
     */
    protected function guard()
    {
        return auth()->guard(request()->user_type);
    }

    /**
     * Returns the password broker for given broker name.
     *
     * @return broker
     */
    protected function broker()
    {
        return Password::broker(
            $this->getBrokerName(request()->user_type)
        );
    }

    /**
     * Get the password broker name of the given guard name.
     *
     * @param  string  $guardName
     * @return string
     */
    protected function getBrokerName($guardName)
    {
        switch ($guardName) {
            case 'admin':
                return 'admins';

            case 'teacher':
                return 'teachers';

            case 'student':
                return 'students';

            default:
                return 'users';
        }
    }
}
