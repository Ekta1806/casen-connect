<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassPost;
use App\Models\Student\Student;
use App\Models\Student\StudentAnswers;
use App\Models\Teacher;
use App\Models\DailyQuestion;
use Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Admin;
use App\Models\AdminPost;
use App\Models\SiteSetting;
use App\Models\ClassTeacher;
use App\Models\Classes;
use App\Models\Student\ClassStudent;

class ClassController extends Controller
{
    /* Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Classs Members';

    /**
     * Displaying all class and members.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {
            $members = Student::where('id', auth()->user()->id)
                ->with(['classes.teachers', 'classes.students.level', 'classes.students' => function ($q) {
                    $q->withCount(['posts' => function ($q) {
                        $q->where('status', 'approved')->orWhere('created_by', Auth::user()->id);
                    }]);
                }])->first();
            $class = auth()->user()->classes()->pluck('id');
            $class_teacher = ClassTeacher::whereIn('class_id',$class)->pluck('teacher_id');
            $teachers = Teacher::whereIn('id',$class_teacher)->get();
            return Inertia::render('Student/Classmates/Classmates', ['members' => $members, 'teachers'=>$teachers]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

    }

    /**
     * Display the Student Profile.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function studentProfile($id)
    {
        try {
            $student = Student::where('id', $id)->with(['posts' => function ($query) {
                $query->where('status','approved')->orWhere('created_by',auth()->user()->id)
                ->withCount(['likes','comments'=> function($q){
                   $q->where('status','approved')->orWhere('status','not_required');
                }])->orderBy('id', "DESC");

            }, 'posts.likes' => function ($query) {
                $query->where("liked_by", auth()->user()->id);
            }, 'posts.media', 'posts.comments.user', 'media'])->first();
            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $class = Auth::user()->classes()->first();
            $id = Classes::where('track_id',$class->track_id)->pluck('id');
            $classesId = Auth::user()->classes()->pluck('id');
            if ($now->format('l') == $day->value) {
                $studentsPosts = ClassStudent::whereIn('class_id',$id)->pluck('student_id');
            } else {
                $studentsPosts = ClassStudent::whereIn('class_id',$classesId)->pluck('student_id');
            }
            $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
            $data['students']  = Student::where('id', '!=', Auth::guard('student')->user()->id)->whereIn('id', $studentsPosts)->get()->toArray();
            $data['teacher'] = Teacher::where('id', auth()->user()->classes[0]->teacher_id)->orWhereIn('id',$class_teacher)->get()->toArray();
            $data['admin'] = Admin::get()->toArray();
            $data['everyone'] = [
                "0" => [
                    'first_name' => 'everyone',
                    'last_name' => '',
                    'id' => '1'
                ]];
            $data['adminLabel'] = [
                "0" => [
                    'first_name' => 'Admins',
                    'last_name' => '',
                    'id' => 0,
                ]];
            $data['teacherLabel'] = [
                "0" => [
                    'first_name' => 'Teachers',
                    'last_name' => '',
                    'id' => 0,
                ]];
            $data['studentLabel'] = [
                "0" => [
                    'first_name' => 'Students',
                    'last_name' => '',
                    'id' => 0,
                ]];
            $students = array_merge($data['everyone'],(!empty($data['admin']) ? $data['adminLabel'] : []), $data['admin'], (!empty($data['teacher']) ? $data['teacherLabel'] : []), $data['teacher'], (!empty($data['students']) ? $data['studentLabel'] : []), $data['students']);      
    
            return Inertia::render('Student/Profile/Profile', ['student' => $student,'students' => $students]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Displaying the Daily Questions.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function questions()
    {
        return Inertia::render('Student/ClassRoom/List');
    }

    /**
     * Displaying answered questions.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function reviewQuestion()
    {
        $answeredId    = StudentAnswers::where('student_id', auth()->user()->id)->pluck('question_id');
        $missQuestions = DailyQuestion::whereNotIn('id', $answeredId)->whereDate('ask_on_date', '<', Carbon::today())->where('level_id',auth()->user()->level_id)->orWhere('classes_id',auth()->user()->class_id)->latest()->simplePaginate(3);
        $questions = StudentAnswers::where('student_id', auth()->user()->id)->latest()->simplePaginate(3);
        if (request()->has('type')) {
            return $this->responseSuccess(['answeredQuestions' => $questions , 'missedQuestions' => $missQuestions]);
        }
        return Inertia::render('Student/Questions/List',['answeredQuestions' => $questions, 'missedQuestions' => $missQuestions]);
    }

    public function teacherProfile($id)
    {
        try {
            $classesId = Auth::user()->classes()->pluck('id');
            $name      = Teacher::where('id', $id)->with('media')->first();
            $posts     = ClassPost::whereIn('classes_id', $classesId)->with(['comments', 'media', 'comments.creator', 'teacher.media', 'likes' => function ($query) {
                $query->where("liked_id", Auth::user()->id);
            }])->withCount(['likes', 'comments' => function ($query) {$query->where('status', 'approved')->orWhere('status', 'not_required');}])->orderBy('updated_at', 'DESC')->get();
            return Inertia::render('Student/Profile/TeacherProfile', ['teacher' => $posts, 'name' => $name]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminProfile($id)
    {
        try {
            $classesId = Auth::user()->classes()->pluck('id');
            $name      = Admin::where('id', $id)->with('media')->first();
            $posts = AdminPost::withCount('comments','likes')
                    ->with(['admin.media','media','likes' => function ($query) {
                        $query->where("admin_id", auth()->id() );
                    },'class'])->orderBy('id', 'DESC')->get();

            $data['students']  = Student::where('id', '!=', Auth::guard('student')->user()->id)
                                ->has('classes')->get()->toArray();
        
            $student = Student::where('id', auth()->user()->id)->with('classes')->first();
            $data['teacher'] = Teacher::where('id', $student->classes[0]->teacher_id)->get()->toArray();
    
            $students = array_merge($data['teacher'], $data['students']);

            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $isFriday = $now->format('l') == $day->value;

            return Inertia::render('Student/Profile/AdminProfile', ['admin' => $posts, 'name' => $name, 'students' => $students, 'isFriday'=> $isFriday]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

}
