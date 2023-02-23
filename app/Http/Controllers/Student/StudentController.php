<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\DailyQuestion;
use App\Models\News;
use App\Models\SiteSetting;
use App\Models\Student\Student;
use App\Models\Student\StudentAnswers;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Student\Post;
use Auth;
use App\Models\ClassPost;
use App\Models\Track;
use App\Models\Student\ClassStudent;
use App\Models\Classes;
use App\Models\Teacher;
use App\Models\AdminPost;
use App\Models\Admin;
use App\Models\Checklist;
use Illuminate\Http\Request;
use App\Models\ClassTeacher;

class StudentController extends Controller
{
    /**
     * Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Dashboard';
    /**
     * Display a listing of Dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $classesId = Auth::user()->classes()->pluck('id');
            $class = Auth::user()->classes()->first();
            $id = Classes::where('track_id',$class->track_id)->pluck('id');
            if ($now->format('l') == $day->value) {
                $studentsPosts = ClassStudent::whereIn('class_id',$id)->pluck('student_id');
                $class_teacher = ClassTeacher::whereIn('class_id',$id)->pluck('teacher_id');
            } else {
                $studentsPosts = ClassStudent::whereIn('class_id',$classesId)->pluck('student_id');
                $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
            }
            $data['students']  = Student::where('id', '!=', Auth::guard('student')->user()->id)->whereIn('id', $studentsPosts)->get()->toArray();
            $data['teacher'] = Teacher::whereIn('id',$class_teacher)->get()->toArray();
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
            $teacher = Student::where('id', Auth::guard('student')->user()->id)->has('classes')->with('classes.teachers')->first();
            $isFriday = $now->format('l') == $day->value;
            $adminPosts = AdminPost::whereIn('classes_id', $id)->orWhere('classes_id', 0)->withCount('comments','likes')
                            ->with(['admin','admin.media','media','likes' => function ($query) {
                                $query->where("student_id", auth()->id() );
                            },'class'])->orderBy('id', 'DESC')->get();          
            $pinnedPost = ClassPost::whereIn('classes_id', $classesId)->whereIn('teacher_id',$class_teacher)->where('is_pinpost',1)->with(['comments', 'media', 'teacher.media', 'likes' => function ($query) {
                $query->where("liked_id", Auth::user()->id);
            }])->withCount(['likes', 'comments' => function ($query) {$query->where('status', 'approved')->orWhere('status', 'not_required');}])->orderBy('created_at', 'DESC')->get();
            
            $teacherPosts = ClassPost::whereIn('classes_id', $classesId)->whereIn('teacher_id',$class_teacher)->with(['comments', 'media', 'teacher.media', 'likes' => function ($query) {
                $query->where("liked_id", Auth::user()->id);
            }])->withCount(['likes', 'comments' => function ($query) {$query->where('status', 'approved')->orWhere('status', 'not_required');}])->orderBy('created_at', 'DESC')->latest()->simplePaginate(3);
            
            $studentsPosts = Post::whereIn('created_by',$studentsPosts)->with(['comments','media','user.media','likes' => function ($query) {
                $query->where("liked_by", Auth::user()->id);
            }])->withCount(['likes', 'comments' => function ($query) 
            {$query->where('status', 'approved')->orWhere('status', 'not_required');}])
            ->orderBy('created_at', 'DESC')->latest()->simplePaginate(3);

            $checklist = checkList::where('student_id',auth()->user()->id)->first();

            if (request()->has('type')) {
                return $this->responseSuccess(['teacherPosts' => $teacherPosts,'user' => $studentsPosts,'adminPosts' => $adminPosts, 'isFriday' => $isFriday]);
            }else{
                return Inertia::render('Student/Dashboard/Index',['user' => $studentsPosts, 'students' => $students, 'teacher' => $teacher, 'teacherPosts' => $teacherPosts, 'pinnedPost' => $pinnedPost, 'adminPosts' => $adminPosts, 'isFriday' => $isFriday,'checklist'=>$checklist]);
            }
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

    /**
     * Display a listing of all dashboard details.
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        try {
            $answeredId    = StudentAnswers::where('student_id', auth()->user()->id)->pluck('question_id');
            $questions     = DailyQuestion::whereIn('id', $answeredId)->count();
            $missQuestions = DailyQuestion::whereNotIn('id', $answeredId)->whereDate('ask_on_date', '<', Carbon::today())->where('level_id',auth()->user()->level_id)->orWhere('classes_id',auth()->user()->class_id)->count();
            $members       = Student::where('id', auth()->user()->id)
                ->with(['classes' => function ($q) {
                    $q->withCount('students');
                }])->first();
            return $this->responseSuccess(['questions' => $questions, 'missQuestions' => $missQuestions, 'member' => $members]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function getQuestionOftheDay()
    {
        try {
            $answeredId = StudentAnswers::where('student_id', auth()->user()->id)->pluck('question_id');
            $time       = SiteSetting::where('name', 'daily_question_timing')->first();
            $classesId = ClassStudent::where('student_id',auth()->user()->id)->first();
             $questionId = DailyQuestion::whereDate('ask_on_date', Carbon::today())->where('classes_id',$classesId->class_id)->where('level_id',auth()->user()->level_id)->whereJsonContains('student_id',auth()->user()->id)->latest()->first();
             if(!$questionId){
             $questionId = DailyQuestion::whereDate('ask_on_date', Carbon::today())->where('classes_id',$classesId->class_id)->where('level_id',auth()->user()->level_id)->whereJsonContains('student_id',0)->latest()->first();
             }
            $question = "";
            if (Carbon::now()->format('H:i') >= $time->value) {
                $question = Student::where('id',auth()->user()->id)->with('classes.questions', function ($q) use ($answeredId,$questionId) {
                    $q->whereDate('ask_on_date', Carbon::today())->where('level_id',auth()->user()->level_id)->where('question_id', $questionId->question_id)->whereNotIn('id', $answeredId);
                })->first();
            }
            $completeQuestion = StudentAnswers::where('student_id', auth()->user()->id)
                ->whereDate('created_at', Carbon::today())->first();

            return $this->responseSuccess(['question' => $question, 'completed' => $completeQuestion]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function news()
    {

        $news = News::latest()->get();
        return $this->responseSuccess(['news' => $news]);
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

        return Inertia::render('Student/Partials/Notification', ['unReadNotification' => $unReadNotification, 'notification' => $notifications]);
    }

    public function showNews()
    {
        return Inertia::render('Student/Partials/New');
    }

    public function storeCheckList(Request $request)
    {
        $checklist = Checklist::where('student_id',auth()->user()->id)->first();
        if($checklist){
            $checklist->update(['checklist_id' => json_encode($request->checklist)]);
        }else{
            Checklist::Create([
                'student_id' => auth()->user()->id,
                'checklist_id' => json_encode($request->checklist)
            ]);
        }
        return $this->responseSuccess(["status" => "success", "message" => "Successfully Checked Checklist"]);
    }

    public function updateCheckList(Request $request)
    {
        
       $checklist = Checklist::where('student_id',auth()->user()->id)->first();
       $array = json_decode($checklist->checklist_id);
        if (($key = array_search($request->checklist, json_decode($checklist->checklist_id))) !== false) {
            unset($array[$key]);
        }
        $checklist->update(['checklist_id' => array_values($array)]);
        return $this->responseSuccess(["status" => "success", "message" => "Successfully Checked Checklist"]);
    }
    
}
