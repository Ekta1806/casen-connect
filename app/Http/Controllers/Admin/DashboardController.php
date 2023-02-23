<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\DailyQuestion;
use App\Models\FlaggedWord;
use App\Models\Student\Student;
use App\Models\Word as CustomFlaggedWord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Dashboard');
    }

    /**
     * Logout the admin user.
     *
     * @return \Illuminate\Support\Facaddes\Redirect
     */
    public function logout()
    {
        auth()->guard('admin')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect(route('admin.login'));
    }

    /**
     * Fetching the counts in the card format in Admin/Dashboard page.
     *
     * @return \Illiminate\Htto\JsonResponse
     */
    public function detailsInCard()
    {
        return $this->responseSuccess([
            'dailyQuestionsCount' => DailyQuestion::count('id'),
            'flaggedWordsCount'   => CustomFlaggedWord::count(),
            'studentsCount'       => Student::where('is_active', 1)->count('id'),
            'classesCount'        => Classes::count('id'),
        ]);
    }
}
