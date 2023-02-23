<?php

namespace App\Http\Middleware;

use App\Models\User;
use Inertia\Middleware;
use Illuminate\Http\Request;
use App\Models\Student\Student;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'guardName' => $this->getUserGuardName(),
                'unReadNotification'=> ($this->getUserGuardName() == "student" ||  "teacher") && auth()->check() ? auth()->user()->unreadNotifications? auth()->user()->unreadNotifications:"": "",
                'track'=> $this->getUserGuardName() == "student" && auth()->check() ? Student::where('id', auth()->user()->id)
                ->with(['classes.teachers'])->first(): "",
                'profilePicture' => auth()->user() ? auth()->user()->getProfilePicture() : "",
            ],
        ]);
    }

    /**
     * Get the guard name of the authenticated user.
     *
     * @return string
     */
    protected function getUserGuardName()
    {
        $allGuards = array_keys(config('auth.guards'));

        $selectedGuard = 'student';
        foreach ($allGuards as $guard) {
            if (request()->segment(1) == $guard && auth()->guard($guard)->check()) {
                $selectedGuard = $guard;

                break;
            }
        }

        return $selectedGuard;
    }
}
