<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use App\Models\Student\Student;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next,$guard = null)
    {
        switch ($guard) {
            case 'student':
                if (auth()->guard('admin')->check()) {
                    if ($request->id) {
                        auth()->guard('student')->login(Student::find($request->id));
                        return redirect()->route('student.home');
                    }else{
                        return redirect(route('admin.dashboard'));
                    }
                }

                if (auth()->guard('teacher')->check()) {
                    if ($request->id) {
                        auth()->guard('student')->login(Student::find($request->id));
                        return redirect()->route('student.home');
                    }else{
                    return redirect(route('teacher.dashboard'));
                   }
                }

                if (Auth::guard($guard)->check()) {
                    if (isset($request->token) && $request->token != null) {
                        $invite = \App\Models\SendInvite::where('token', $request->token)->where('email', auth()->guard('student')->user()->email)->first();
                        if ($invite) {
                            auth()->guard('student')->user()->classes()->attach($invite->class_id);
                            $invite->delete();
                        }
                    }

                    return redirect()->route('student.home');
                }
            break;
            default:
                if (auth()->guard('admin')->check()) {
                    return redirect(route('admin.dashboard'));
                }

                if (Auth::guard('teacher')->check()) {
                    return redirect()->route('teacher.dashboard');
                }

                if (auth()->guard('student')->check()) {
                    return redirect(route('student.home'));
                }
            break;
        }

        return $next($request);
    }
}
