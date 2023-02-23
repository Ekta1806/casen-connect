<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\SendInvite;
use App\Models\Student\Student;
use App\Models\Teacher;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Session;
use Socialite;

class GoogleController extends Controller
{
    /**
     * Display a Google sign in page.
     *
     * @return \Illuminate\Http\Response
     */

    public function index($type)
    {
        Session::put('role', $type);

        return Socialite::driver('google')->with(["prompt" => "select_account"])->redirect();
    }

    /**
     * Store the new User data or logged in.
     *
     * @param  \App\Http\Requests\Teacher\DailyQuestionsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */

    public function handleGoogleCallback(Request $request)
    {
        $user    = Socialite::driver('google')->stateless()->user();
        $hasrole = Session::get('role');
        try {
            $studentRegistered = SendInvite::where('email', $user->email)->first();
            $finduser          = Student::where('google_id', $user->id)->orWhere('email', $user->email)->first();
            $findteacher       = Teacher::where('google_id', $user->id)->orWhere('email', $user->email)->first();

            if (!$finduser && $studentRegistered && $hasrole == 'student') {
                $newStudent = Student::create([
                    'first_name' => $user->user['given_name'],
                    'last_name'  => $user->user['family_name'],
                    'password'   => "",
                    'email'      => $user->email,
                    'google_id'  => $user->id,
                    'is_active'  => 1,
                    'level_id'   => 1,
                ]);

                $classId = $studentRegistered->class_id;
                if (!empty($classId)) {
                    $trackIds = Classes::find($classId)->track_id;
                    $newStudent->fresh()->classes()->sync($classId ?? []);
                }
                Auth::guard('student')->login($newStudent);
                return redirect()->intended(route('student.home'));
            }
            if ($finduser && $hasrole == 'student') {
                if ($finduser->is_active == 0) {
                    return redirect()->route('student.login')->with('status', ['error', session('error', "This account is deactivated")]);
                } else {
                    $finduser->update(['google_id' => $user->id]);
                    auth()->guard('student')->login($finduser);
                    return redirect()->route('student.home');
                }
            } else {
                if ($hasrole == 'student') {
                    $text = "Something went wrong please contact adminstrator.
                        To register with Casen Connect, you must have an invitation from us. Please contact Administrator to join us.";
                    $type = "error";
                    return redirect()->route('student.login')->with('status', ['error', session('error', $text)]);
                }
            }
            if ($findteacher && $hasrole == 'teacher') {
                if ($findteacher->is_active == 0) {
                    return redirect()->route('teacher.login')->with('status', ['error', session('error', "This account is deactivated")]);

                } else {

                    $findteacher->update(['google_id' => $user->id]);
                    Auth::guard('teacher')->login($findteacher);
                    return redirect()->route('teacher.dashboard');
                }
            } else {
                if ($hasrole == 'teacher' && !$findteacher) {

                    $text = "Something went wrong please contact adminstrator.
                        To register with Casen Connect, you must have an invitation from us. Please contact Administrator to join us.";

                    return redirect()->route('teacher.login')->with('status', ['error', session('error', $text)]);
                }
            }
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
