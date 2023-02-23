<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Redirect to the admin login page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToLogin()
    {
        return redirect(route('admin.login'));
    }

    /**
     * Display the admin login form.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Auth/Login');
    }

    /**
     * Authenticate the admin credentials.
     *
     * @param  \App\Http\Requests\Admin\LoginRequest  $request
     * @return \Illuminate\Support\Facaddes\Redirect
     */
    public function store(LoginRequest $request)
    {
        if (auth()->guard('admin')->attempt(['email' => $request->email, 'password' => $request->password])) {
            $request->session()->regenerate();

            return redirect(route('admin.dashboard'));
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }
}
