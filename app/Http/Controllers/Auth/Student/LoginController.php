<?php

namespace App\Http\Controllers\Auth\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\LoginRequest;
use App\Models\SendInvite;
use App\Models\Student\Student;
use App\Providers\RouteServiceProvider;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Redirect to the student login page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToLogin()
    {
        return redirect(route('student.login'));
    }

    public function showLoginForm(Request $request)
    {
        $invite = null;
        if ($request->token) {
            $invite = SendInvite::where('token', $request->token)->first();
        }

        return Inertia::render('Auth/Student/Login', [
            'status' => session('status'),
            'invite' => $invite,
        ]);
    }

    public function login(LoginRequest $request)
    {

        $finduser = Student::where('email', $request->email)->first();

        if ($finduser && $finduser->is_active == 0) {

            return Inertia::render('Auth/Student/Login', [
                'status' => session('error', 'This account is deactivated'),
                'type'   => 'error',
            ]);
        }

        if (Auth::guard('student')->attempt(['email' => $request->email, 'password' => $request->password])) {

            if (isset($request->invite_token) && $request->invite_token != null) {
                $invite = SendInvite::where('token', $request->invite_token)->where('email', $request->email)->first();
                if ($invite) {
                    auth()->guard('student')->user()->classes()->attach($invite->class_id);
                    $invite->delete();
                }
            }
            $request->session()->regenerate();
            return redirect()->intended(route('student.home'));
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    public function logout()
    {
        Auth::guard('student')->logout();
        return redirect()->route('student.login');
    }
}
