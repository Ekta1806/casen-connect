<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\Teacher;
use Inertia\Inertia;
use App\Models\ClassPost;
use App\Models\ClassPostsLike;
use App\Models\ClassPostsComment;
use App\Http\Controllers\Controller;
use App\Models\Student\Student;
use App\Models\Admin;
use Auth;
use App\Http\Requests\Student\EditCommentRequest;
use App\Mail\ClasspostTaggedMail;
use Mail;
use App\Notifications\AdminTagNotification;
use App\Models\Student\ClassStudent;
use App\Notifications\TagNotification;
use App\Models\Classes;
use App\Models\ClassTeacher;

class ClassPostsController extends Controller
{
    public function storeLikes($id, $check)
    {
        try {
            $post = ClassPost::find($id);
            if ($check == 'true') {
                $like = ClassPostsLike::updateOrCreate([
                    'class_post_id'  => $post->id,
                    'admin_id' => auth()->user()->id,
                    'liked_by' => 'admin'
                ]);

                return $this->responseSuccess([$like]);

            } else {
                $like = ClassPostsLike::where('class_post_id', $post->id)
                    ->where('admin_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function showPostLikes($postsLike)
    {
        try {
            $post = ClassPost::with('likes')->find($postsLike);
            if (!$post) {
                return response()->json([
                    'status'  => 'failed',
                    'message' => 'No post found with the given id.',
                ]);
            }
            $postLikes = $post->likes;
            $allLikes        = [];
            $allTeacherLikes = [];
            $allAdminLikes = [];
            foreach ($postLikes as $like) {
                if ($like->liked_id !== 0 && $like->teacher_id == 0 && $like->admin_id== 0) {
                    $student    = Student::find($like->liked_id);
                    $allLikes[] = [
                        'id'     => $student->id,
                        'name'   => $student->full_name,
                        'avatar' => $student->getProfilePicture(),
                        'type'   => 'student',
                    ];
                }
                if ($like->teacher_id !== 0 && $like->liked_id == 0 && $like->admin_id == 0) {
                    $teacher           = Teacher::find($like->teacher_id);
                    $allTeacherLikes[] = [
                        'id'     => $teacher->id,
                        'name'   => $teacher->full_name,
                        'avatar' => $teacher->getProfilePicture(),
                        'type'   => 'teacher',
                    ];
                }
                if ($like->admin_id !== 0 && $like->liked_id == 0 && $like->teacher_id == 0 ) {
                    $admin           = Admin::find($like->admin_id);
                    $allAdminLikes[] = [
                        'id'     => $admin->id,
                        'name'   => $admin->full_name,
                        'avatar' => $admin->getProfilePicture(),
                        'type'   => 'admin',
                    ];
                }

            };

            return $this->responseSuccess([
                'likes' => array_merge($allTeacherLikes, $allLikes, $allAdminLikes),
                'owner' => ClassPostsLike::where('admin_id',Auth::user()->id)->where('class_post_id',$postsLike)->first(),
                ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }
    public function storeComment(Request $request)
    {
        try {
            $comment = ClassPostsComment::create([
                'class_post_id'      => $request->post_id,
                'commentor_id'     => auth()->user()->id,
                'content'      => str_replace(array( '[', ']' ), '', $request->comment),
                'status'       => 'not_required',
                'commented_by' => 'admin',
            ]);
            
            if($comment){
                $this->teacherPostCommentsNotify($comment);
            }
            
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroyComment(ClassPostsComment $comment)
    {
        try {
            $comment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function updateComment(EditCommentRequest $request, ClassPostsComment $comment)
    {
        try {
            $comment->update(['content' => str_replace(array( '[', ']' ), '', $request->comment_1), 'status' => 'not_required']);
            if($comment){
                $this->teacherPostCommentsNotify($comment);
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminAllTagNotifyClassPostComment($data , $comment, $postType){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has mentioned you in comment section",
                    'commented_by' => $comment->commented_by,
                    'comment' => $comment->content,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $comment->class_post_id,
                    'post_type' => $postType
                ];
    
                Mail::to($allTag->email)->send(new ClasspostTaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }

    public function teacherPostCommentsNotify($comment){
        if($comment){
            $findString = preg_match("~@everyone~",$comment->content);
            if($findString){
                $classPost = ClassPost::where('id', $comment->class_post_id)->first();
                $studentsId = ClassStudent::where('class_id', $classPost->classes_id)->pluck('student_id');
                $teacherId = ClassTeacher::where('class_id',$classPost->classes_id)->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$teacherId)->get();
                $this->adminAllTagNotifyClassPostComment($teachers, $comment, 'teacher_post');
                $students = Student::whereIn('id',$studentsId)->get();
                $this->adminAllTagNotifyClassPostComment($students, $comment, 'teacher_post');
            }
        }

        if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->content, $matches)) {
            $usernames = $matches[1];
            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                
                if($student != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $comment->commented_by,
                        'comment' => $comment->content,
                        'dear_name' => $student->full_name,
                        'post_id' => $comment->class_post_id,
                        'post_type' => 'teacher_post'
                    ];

                    Mail::to($student->email)->send(new ClasspostTaggedMail($details));
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
                        'post_id' => $comment->class_post_id,
                        'post_type'=> 'teacher_post'
                    ];

                    Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                    $teacher->notify(new TagNotification($details));
                }
            }
        } else{
            $post = ClassPost::find($comment->class_post_id);
            if($post){
                $teacher = Teacher::where('id',$post->teacher_id)->first();
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has commented in your post",
                    'post_type' => "teacher_post",
                    'commented_by' => $comment->commented_by,
                    'comment' => $teacher->content,
                    'dear_name' => $teacher->full_name,
                    'post_id' => $comment->class_post_id,
                ];

                Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                $teacher->notify(new TagNotification($details));
            }
        }
    }
}
