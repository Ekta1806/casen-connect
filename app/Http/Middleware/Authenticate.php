<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            
            if($request->is('teacher') || $request->is('teacher/*'))
                return route('teacher.login');

            else if($request->is('admin') || $request->is('admin/*'))
                return route('admin.login');
            else
                return route('student.login');
        }
    }
}
