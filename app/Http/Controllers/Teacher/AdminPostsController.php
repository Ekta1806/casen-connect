<?php

namespace App\Http\Controllers\Teacher;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AdminPost;
use Inertia\Inertia;
use App\Models\Classes;
use App\Models\AdminPostLike;
use App\Models\Student\Student;
use App\Http\Requests\Teacher\AdminPostsRequest;
use App\Http\Requests\Teacher\AdminCommentRequest;
use App\Http\Requests\Teacher\EditAdminPostCommentRequest;
use Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Word;
use App\Models\FlaggedWord;
use App\Models\AdminPostComment;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Student\ClassStudent;
use Carbon\Carbon;
use App\Models\SiteSetting;
use App\Mail\AdminPostCommentTaggedMail;
use Mail;
use App\Notifications\AdminTagNotification;
use App\Notifications\TagNotification;
use App\Models\ClassTeacher;

class AdminPostsController extends Controller
{
    public function index()
    {
        $classes = Classes::select('name as label', 'id as value')
        ->orderBy('id', 'DESC')->get()->toArray();
        $newArray[] = ['label'=>'All Classes','value'=>0];
        $allClasses = array_merge($newArray, $classes);

        $now       = Carbon::now();
        $day       = SiteSetting::where('name', 'view_posts_on')->first();
        $isFriday = $now->format('l') == $day->value;

        $posts = AdminPost::withCount('comments','likes')
                            ->with(['media','likes' => function ($query) {
                                $query->where("admin_id", auth()->id() );
                            },'class','admin'])->orderBy('id', 'DESC')->get();
        
        return Inertia::render('Teacher/AdminPosts/List', [
            'rows'     => $posts->toArray(),
            'students' => Student::get()->toArray(),
            'classes'  => $allClasses,
            'isFriday' => $isFriday,
        ]);
    }

    public function showLikes($adminPostsLike)
    {
        try {
            $post = AdminPost::with('likes')->find($adminPostsLike);
            if (!$post) {
                return response()->json([
                    'status'  => 'failed',
                    'message' => 'No post found with the given id.',
                ]);
            }
            $postLikes = $post->likes;

            $allAdminLikes   = [];
            $allTeacherLikes = [];
            $allStudentLikes = [];
            foreach ($postLikes as $like) {
                if ($like->liked_by === "student") {
                    $student    = Student::find($like->student_id);
                    $allStudentLikes[] = [
                        'id'     => $student->id,
                        'name'   => $student->full_name,
                        'avatar' => $student->getProfilePicture(),
                        'type'   => 'student',
                    ];
                }
            };
            foreach ($postLikes as $like) {
                if ($like->liked_by === "teacher") {
                    $teacher           = Teacher::find($like->teacher_id);
                    $allTeacherLikes[] = [
                        'id'     => $teacher->id,
                        'name'   => $teacher->full_name,
                        'avatar' => $teacher->getProfilePicture(),
                        'type'   => 'teacher',
                    ];
                }
            };
            foreach ($postLikes as $like) {
                if ($like->liked_by === "admin") {
                    $admin    = Admin::find($like->admin_id);
                    $allAdminLikes[] = [
                        'id'     => $admin->id,
                        'name'   => $admin->full_name,
                        'avatar' => $admin->getProfilePicture(),
                        'type'   => 'admin',
                    ];
                }
            };

            return $this->responseSuccess([
                'likes' => array_merge($allTeacherLikes, $allAdminLikes, $allStudentLikes),
                'owner' => AdminPostLike::where('liked_by', 'teacher')->where('teacher_id',Auth::user()->id)->where('admin_post_id',$adminPostsLike)->first(),
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function checkwords(Request $request)
    {
        if ($request->desc) {
        
            $data = Http::get('http://api1.webpurify.com/services/rest/?api_key=ad45678428d30ac1237f12e2cfcf102a&method=webpurify.live.return&text=' . $request->desc . '&format=json');
            
            $posts = json_decode($data);
            $html  = "";
            $msg   = "";
            if ($posts && $posts->rsp->found > 0) {
                if (is_array($posts->rsp->expletive)) {

                    $descMsg     = [];
                    $description = Word::whereIn('content_word', $posts->rsp->expletive)->get();
                    if (count($description) > 0) {
                        foreach ($description as $desc) {
                            $descMsg[] = '<br>' . $desc->content_word . ':-<span style="color:red;">' . $desc->description . '</span>';
                        }
                        $msg = $descMsg;
                    }

                    foreach ($posts->rsp->expletive as $word) {
                        FlaggedWord::create(['word_phrase' => $word,
                            'content'                          => $request->desc,
                            'student_id'                       => Auth::guard('student')->user()->id]);
                        $array[] = '<span style="color: red;">' . $word . '</span>';
                    }
                    $html = str_replace($posts->rsp->expletive, $array, strtolower($request->desc));

                } else {

                    $description = Word::where('content_word', $posts->rsp->expletive)->get();
                    $descMsg     = [];
                    foreach ($description as $desc) {
                        $descMsg = '<br>' . $desc->content_word . ':-<span style="color:red;">' . $desc->description . '</span>';
                    }
                    $msg = $descMsg;

                    $html = str_replace($posts->rsp->expletive, '<span style="color:red;">' . $posts->rsp->expletive . '</span>', strtolower($request->desc));
                    FlaggedWord::create(['word_phrase' => $posts->rsp->expletive,
                        'content'                          => $request->desc,
                        'student_id'                       => Auth::guard('student')->user()->id]);
                }
                return $this->responseSuccess(["status" => "error", "props" => $posts->rsp->expletive, 'html' => $html, 'message' => $msg]);
            }
        }
    }
    
    public function storeLikes($id, $check)
    {
        try {
            $post = AdminPost::find($id);
            if ($check == 'true') {
                $like = AdminPostLike::updateOrCreate([
                    'admin_post_id' => $post->id,
                    'liked_by'      => "teacher",
                    'teacher_id'    => Auth::user()->id,
                ]);
                return $this->responseSuccess([$like]);
            } else {
                $like = AdminPostLike::where('admin_post_id', $post->id)
                    ->where('teacher_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroyComment(AdminPostComment $comment)
    {
        try {
            $comment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }
    public function updateComment(EditAdminPostCommentRequest $request, AdminPostComment $comment)
    {
        try {
            $comment->update(['content' => str_replace(array( '[', ']' ), '', $request->comment_1)]);
            if($comment){
                $this->adminPostsCommentsNotify($comment);
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminComments($id){
        $post     = AdminPost::find($id);
        $comments = AdminPostComment::where('admin_post_id', $post->id)->with('student.media', 'teacher.media', 'admin.media')->orderBy('updated_at', 'desc')->get();
        return $this->responseSuccess($comments);
    }

    public function storeComment(AdminCommentRequest $request)
    {
        try {
            $comment = AdminPostComment::create([
                'admin_post_id'      => $request->post_id,
                'commented_by' => "teacher",
                'teacher_id' => auth()->user()->id,
                'content'      => str_replace(array( '[', ']' ), '', $request->comment),
            ]);
            if($comment){
                $this->adminPostsCommentsNotify($comment);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function tagStudents($id){
        $classes_id = AdminPost::where('id',$id)->select('classes_id', 'admin_id')->first();
        if( $classes_id->classes_id == 0){
            $data['students']  = Student::has('classes')->get()->toArray();
            $data['teacher'] = Teacher::where('track_id','!=','0')->where('id','!=',Auth::user()->id)->get()->toArray();
            $data['admin'] = Admin::where('id',$classes_id->admin_id)->get()->toArray();
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
        }
        if( $classes_id->classes_id != 0){
            $student_ids = ClassStudent::where('class_id',$classes_id->classes_id)->pluck('student_id');
            $teacher_ids = ClassTeacher::where('class_id',$classes_id->classes_id)->pluck('teacher_id');
            $data['students'] = Student::whereIn('id',$student_ids)->get()->toArray();
            $data['teacher'] = Teacher::whereIn('id',$teacher_ids)->where('id','!=',Auth::user()->id)->get()->toArray();
            $data['admin'] = Admin::where('id',$classes_id->admin_id)->get()->toArray();
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
        }
        return $this->responseSuccess($students);
    }

    public function show($post)
    {
        try {
            $post = AdminPost::find($post);
            if(!$post){
                return Inertia::render('Teacher/Partials/AdminPostShow', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $posts = AdminPost::where('id',$post->id)->withCount('comments','likes')->with(['admin','admin.media','media','likes','class'])->first();
            $data['students']  = Student::has('classes')->get()->toArray();
            $classes = ClassTeacher::where('teacher_id', auth()->user()->id)->pluck('class_id');
            $data['teacher'] = Teacher::has('class')->get()->toArray();
            $students = array_merge($data['teacher'], $data['students']);

            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $isFriday = $now->format('l') == $day->value;

            return Inertia::render('Teacher/Partials/AdminPostShow',['post_exits' => true,'students'=>$students, 'posts'=>$posts, 'isFriday'=> $isFriday]);

        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function teacherAdminPostAllTagNotify($data , $comment, $postType){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has mentioned you in comment section",
                    'commented_by' => $comment->commented_by,
                    'comment' => $comment->content,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $comment->admin_post_id,
                    'post_type' => $postType
                ];
    
                Mail::to($allTag->email)->send(new AdminPostCommentTaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }

    public function adminPostsCommentsNotify($comment){
        if($comment){
            $findString = preg_match("~@everyone~",$comment->content);
            if($findString){
                $adminPost = AdminPost::where('id',$comment->admin_post_id)->first();
                if($adminPost->classes_id == 0){
                    $students  = Student::has('classes')->get();
                    $this->teacherAdminPostAllTagNotify($students, $comment, 'student');
                    $teachers = Teacher::where('track_id','!=','0')->where('id','!=',Auth::user()->id)->get();
                    $this->teacherAdminPostAllTagNotify($teachers, $comment, 'teacher');
                    $admins = Admin::where('id',$adminPost->admin_id)->get();
                    $this->teacherAdminPostAllTagNotify($admins, $comment, 'admin');
                } else {
                    $student_ids = ClassStudent::where('class_id',$adminPost->classes_id)->pluck('student_id');
                    $teacher_ids = ClassTeacher::where('class_id',$adminPost->classes_id)->pluck('teacher_id');
                    $students = Student::whereIn('id',$student_ids)->get();
                    $this->teacherAdminPostAllTagNotify($students, $comment, 'student');
                    $teachers = Teacher::whereIn('id',$teacher_ids)->get();
                    $this->teacherAdminPostAllTagNotify($teachers, $comment, 'teacher');
                    $admins = Admin::where('id',$adminPost->admin_id)->get();
                    $this->teacherAdminPostAllTagNotify($admins, $comment, 'admin');
                }
            }
        }

        if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->content, $matches)) {
            $usernames = $matches[1];
            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $teacher = Teacher:: whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();

                if($student != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $comment->commented_by,
                        'comment' => $comment->content,
                        'dear_name' => $student->full_name,
                        'post_id' => $comment->admin_post_id,
                        'post_type' => 'student'
                    ];

                    Mail::to($student->email)->send(new AdminPostCommentTaggedMail($details));
                    $student->notify(new TagNotification($details));
                }
                if($teacher != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $comment->commented_by,
                        'comment' => $comment->content,
                        'dear_name' => $teacher->full_name,
                        'post_id' => $comment->admin_post_id,
                        'post_type'=> 'teacher'
                    ];

                    Mail::to($teacher->email)->send(new AdminPostCommentTaggedMail($details));
                    $teacher->notify(new TagNotification($details));
                }
                if($admin != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $comment->commented_by,
                        'comment' => $comment->content,
                        'dear_name' => $admin->full_name,
                        'post_id' => $comment->admin_post_id,
                        'post_type'=> 'admin'
                    ];

                    Mail::to($admin->email)->send(new AdminPostCommentTaggedMail($details));
                    $admin->notify(new TagNotification($details));
                }
            }
        }
    }
}
