<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\DailyQuestion;
use App\Models\Student\Student;
use Auth;
use App\Models\Word as CustomFlaggedWord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student\ClassStudent;

class DashboardController extends Controller
{
    /**
     * Display the teacher dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Dashboard');
    }

    /**
     * Logout the teacher user.
     *
     * @return \Illuminate\Support\Facaddes\Redirect
     */
    public function logout(Request $request)
    {
        auth()->guard('teacher')->logout();

        request()->session()->invalidate();

        request()->session()->regenerateToken();

        return redirect()->route('teacher.login');
    }

    /**
     * Fetching the counts in the card format in Teacher/Dashboard page.
     *
     * @return \Illiminate\Htto\JsonResponse
     */
    public function detailsInCard()
    {
        $teacher = auth()->guard('teacher')->user();
        $dailyQuestionsCount = DailyQuestion::where('added_by','admin')
        ->orWhere('teacher_id', Auth::guard('teacher')->user()->id)->count('id');
        $flaggedWordsCount = CustomFlaggedWord::count('id');
        $classesId = $teacher->class()->pluck('class_id');
        $studentsIds = ClassStudent::whereIn('class_id',$classesId)->pluck('student_id');

            return $this->responseSuccess([
            'dailyQuestionsCount' => $dailyQuestionsCount,
            'flaggedWordsCount'   => CustomFlaggedWord::count(),
            'studentsCount'       => Student::whereIn('id',$studentsIds)->count('id'),
            'classesCount'        => Classes::whereIn('id',$classesId)->count('id'),
        ]);
    }

    /**
     * depicting notifications.
     *
     * @return \Illuminate\Http\Response
     */
    public function showNotifications()
    {
        $unReadNotification = auth()->user()->unreadNotifications;
        $notifications      = auth()->user()->notifications;

        return Inertia::render('Teacher/Partials/Notification', ['unReadNotification' => $unReadNotification, 'notification' => $notifications]);
    }

    /**
     * destroying notification.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroyNotification($id)
    {
        $user = auth()->user()->notifications()->where('id', $id)->first()->markAsRead();

        return back();
    }
}
