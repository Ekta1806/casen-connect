<?php

namespace App\Http\Controllers\Student;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AdminPost;
use Inertia\Inertia;
use App\Models\Classes;
use App\Models\AdminPostLike;
use App\Models\Student\Student;
use App\Http\Requests\Student\AdminPostsRequest;
use App\Http\Requests\Student\AdminCommentRequest;
use App\Http\Requests\Student\EditAdminPostCommentRequest;
use Auth;
use Illuminate\Support\Facades\Http;
use App\Models\Word;
use App\Models\FlaggedWord;
use App\Models\AdminPostComment;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Student\ClassStudent;
use App\Models\ClassTeacher;
use App\Models\SiteSetting;
use Carbon\Carbon;
use App\Mail\AdminPostCommentTaggedMail;
use Mail;
use App\Notifications\AdminTagNotification;
use App\Notifications\TagNotification;

class AdminPostsController extends Controller
{
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
                'owner' => AdminPostLike::where('liked_by', 'student')->where('student_id',auth()->user()->id)->where('admin_post_id',$adminPostsLike)->first(),
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function storeLikes($id, $check)
    {
        try {
            $post = AdminPost::find($id);
            if ($check == 'true') {
                $like = AdminPostLike::updateOrCreate([
                    'admin_post_id' => $post->id,
                    'liked_by'      => "student",
                    'student_id'    => Auth::user()->id,
                ]);

                return $this->responseSuccess([$like]);

            } else {
                $like = AdminPostLike::where('admin_post_id', $post->id)
                    ->where('student_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
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
                'commented_by' => "student",
                'student_id' => Auth::user()->id,
                'content'      => str_replace(array( '[', ']' ), '', $request->comment),
            ]);
            if($comment){
                $this->adminPostsCommentsNotify($comment);
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

    public function tagStudents($id){
        $classes_id = AdminPost::where('id',$id)->select('classes_id','admin_id')->first();
        if( $classes_id->classes_id == 0){
            $classesId = Auth::user()->classes()->pluck('id');
            $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
            $data['students']  = Student::where('id', '!=', Auth::user()->id)->get()->toArray();
            $data['teacher'] = Teacher::where('track_id','!=','0')->get()->toArray();
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
        }

        if( $classes_id->classes_id != 0){
            $classesId = Auth::user()->classes()->pluck('id');
            $class = Auth::user()->classes()->first();
            $trackId = Classes::where('track_id',$class->track_id)->pluck('id');
            $class_teacher = ClassTeacher::whereIn('class_id',$trackId)->pluck('teacher_id');
            $student_ids = ClassStudent::whereIn('class_id',$trackId)->pluck('student_id');
            $data['students'] = Student::where('id','!=',Auth::user()->id)->whereIn('id',$student_ids)->get()->toArray();
            $teacher_ids = Classes::where('id',$classes_id->classes_id)->pluck('teacher_id');
            $data['teacher'] = Teacher::whereIn('id',$class_teacher)->get()->toArray();
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
                return Inertia::render('Student/Partials/AdminPostShow', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $posts = AdminPost::where('id',$post->id)->withCount('comments','likes','media')->with('admin','admin.media','media')->first();
            $data['students']  = Student::has('classes')->get()->toArray();
            $data['teacher'] = Teacher::has('class')->get()->toArray();
            $students = array_merge($data['teacher'], $data['students']);

            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $isFriday = $now->format('l') == $day->value;

            return Inertia::render('Student/Partials/AdminPostShow',['post_exits' => true,'students'=>$students, 'posts'=>$posts, 'isFriday'=> $isFriday]);
        
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function adminPostAllTagNotify($data , $comment, $postType){
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
                    $students  = Student::where('id', '!=', Auth::user()->id)->get();
                    $this->adminPostAllTagNotify($students, $comment, 'student');
                    $teachers = Teacher::where('track_id','!=','0')->get();
                    $this->adminPostAllTagNotify($teachers, $comment, 'teacher');
                    $admins = Admin::get();
                    $this->adminPostAllTagNotify($admins, $comment, 'admin');
                } else {
                    $classesId = Auth::user()->classes()->pluck('id');
                    $class = Auth::user()->classes()->first();
                    $trackId = Classes::where('track_id',$class->track_id)->pluck('id');
                    $class_teacher = ClassTeacher::whereIn('class_id',$trackId)->pluck('teacher_id');
                    $student_ids = ClassStudent::whereIn('class_id',$trackId)->pluck('student_id');
                    $students = Student::where('id','!=',Auth::user()->id)->whereIn('id',$student_ids)->get();
                    $this->adminPostAllTagNotify($students, $comment, 'student');
                    $teachers = Teacher::whereIn('id',$class_teacher)->get();
                    $this->adminPostAllTagNotify($teachers, $comment, 'teacher');
                    $admins = Admin::where('id',$adminPost->admin_id)->get();
                    $this->adminPostAllTagNotify($admins, $comment, 'admin');
                }
            }
        }
        if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->content, $matches)) {
            $usernames = $matches[1];
            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
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
