<?php

namespace App\Http\Controllers\Auth\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\RegisterRequest;
use App\Models\SendInvite;
use App\Models\Student\Student;
use App\Providers\RouteServiceProvider;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mail;
use App\Mail\RegistrationMail;
use App\Notifications\RegistrationNotification;
use App\Models\Teacher;
use App\Models\Classes;


class RegisterController extends Controller
{
    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest:student');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */

    public function register(Request $request)
    {
        $invite = null;
        if ($request->token) {
            $invite = SendInvite::where('token', $request->token)->first();
        }

        return Inertia::render('Auth/Student/Register', [
            'invite' => $invite,
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\Student\Student
     */
    protected function create(RegisterRequest $request)
    {
        $data = $request->all();

        $student = Student::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'is_active'  => 1,
        ]);

        if (isset($data['register_token']) && $data['register_token'] != null) {
            $invite = SendInvite::where('token', $data['register_token'])->first();
            $teacher = Teacher::where('id',$invite->teacher_id)->first();
            $class = Classes::where('id',$invite->class_id)->first();
            $student->classes()->attach($invite->class_id);
            $details = [
                'greeting' => 'Hi',
                'name'     => $student->full_name,
                'body'     => "has accepted your class invitation request",
                'post_type' => "student_registration",
                'dear_name' => $teacher->full_name,
                'class' => $class->name,
            ];
            Mail::to($teacher->email)->send(new RegistrationMail($details));
            $teacher->notify(new RegistrationNotification($details));
            $invite->delete();
        }
       
        return redirect(route('student.home'));
    }
}
