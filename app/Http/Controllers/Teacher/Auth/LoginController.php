<?php

namespace App\Http\Controllers\Teacher\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\LoginRequest;
use App\Models\Teacher;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Redirect to the teacher login page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToLogin()
    {
        return redirect(route('teacher.login'));
    }

    /**
     * Display the teacher login page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Authenticate the teacher credentials.
     *
     * @param  \App\Http\Requests\Teacher\LoginRequest  $request
     * @return \Illuminate\Support\Facaddes\Redirect
     */
    public function check(LoginRequest $request)
    {
        $finduser = Teacher::where('email', $request->email)->first();
        if ($finduser && $finduser->is_active == 0) {
            return Inertia::render('Teacher/Auth/Login')->with([
                'status' => session('error', 'This account is deactivated'),
                'type'   => 'error']);
        }

        if (auth()->guard('teacher')->attempt(['email' => $request->email, 'password' => $request->password])) {
            $request->session()->regenerate();

            return redirect(route('teacher.dashboard'));
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }
}
