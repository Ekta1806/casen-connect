<?php

namespace App\Http\Controllers\Teacher\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\RegisterRequest;
use App\Models\Teacher;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Display the registration form to the teacher.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Auth/Register', [
            'tracks' => \App\Models\Track::latest()->get(),
        ]);
    }

    /**
     * Register the teacher with the given details.
     *
     * @param  \App\Http\Requests\Teacher\RegisterRequest  $request
     * @return \App\Models\Student\Student
     */
    protected function store(RegisterRequest $request)
    {
        $findTeacher = Teacher::where('email', $request->email)->first();

        if (!$findTeacher) {
            $text = "Something went wrong please contact adminstrator.
                        To register with Casen Connect, you must have an invitation from us. Please contact Administrator to join us.";
            return redirect()->route('teacher.login')->with('status', ['error', session('error', $text)]);
        } else {
            return redirect()->route('teacher.login');
        }
    }
}
