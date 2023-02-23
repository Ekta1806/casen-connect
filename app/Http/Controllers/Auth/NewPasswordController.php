<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function create(Request $request)
    {
        $guardNames = array_keys(config('auth.guards'));
        if (! in_array($request->user_type, $guardNames)) {
            return redirect(url('/'));
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'user_type' => $request->user_type,
        ]);
    }

    /**
     * Handle an incoming new password request.
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
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:'. implode(',', $guardNames),
        ]);

        $userType = $request->user_type;
        $loginRouteName = "welcomeHomePage";

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = $this->broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == Password::PASSWORD_RESET) {
            if ($userType == 'admin') {
                $loginRouteName = 'admin.login';
            } if ($userType == 'teacher') {
                $loginRouteName = 'teach.login';
            }
            if ($userType == 'student') {
                $loginRouteName = 'student.login';
            }
            return redirect()->route($loginRouteName)->with('status', __($status));
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
