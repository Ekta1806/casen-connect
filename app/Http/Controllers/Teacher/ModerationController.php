<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassPost;
use App\Models\Student\Student;
use Auth;
use Inertia\Inertia;
use App\Models\Student\Post;
use App\Models\Student\ClassStudent;
use App\Models\ClassTeacher;
use App\Models\Classes;


class ModerationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Moderation/List');
    }
    /**
     * Fetch all the students that are taking the classes lead by the
     * currently authenticated teacher.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchPendingPosts()
    {

        $teacher = auth()->guard('teacher')->user();
        
        $classes = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $studentsPosts = ClassStudent::whereIn('class_id',$classes)->pluck('student_id');

        $student = Post::whereIn('created_by',$studentsPosts)->with(['user.classes','comments','media','user.media','likes' => function ($query) {
            $query->where("teacher_id", Auth::user()->id);
        }])->where(function($q){
            $q->where('status','pending')->orWhere('status','approved')->whereHas('comments', function($q) {
                $q->where('status','pending')->orderBy('created_at', 'DESC');
            });
        })->withCount(['likes', 'comments' => function($q){ $q->where('status','pending');}])
        ->orderBy('created_at', 'DESC')->get();
        
        $teachers = ClassTeacher::whereIn('class_id',$classes)->pluck('teacher_id');
        $qPosts = ClassPost::whereIn("teacher_id",$teachers)->whereIn('classes_id',$classes)->whereHas('comments', function ($q) {$q->where('status', 'pending')->orderBy('created_at', 'DESC');})
            ->with(['class','media','teacher.media', 'comments' => function ($q) {$q->where('status', 'pending');}, 'likes' => function ($query) {
                $query->where("teacher_id", Auth::user()->id);
            }])->withCount('likes')
            ->orderBy('created_at', 'DESC')->get();
            $posts = [];
        foreach($qPosts as $r){
            $checkTeacherStatus = ClassTeacher::where('teacher_id',$r->teacher_id)->where('class_id', $r->classes_id)->get()->toArray();
            if(count($checkTeacherStatus) > 0){
                array_push($posts,$r);
            }
        }

        $all_students = Student::has('classes')->get();

        if (!$student) {
            abort(404);
        }

        return $this->responseSuccess([
            'students'     => $student,
            'posts'        => $posts,
            'all_students' => $all_students,
        ]);
    }
}
