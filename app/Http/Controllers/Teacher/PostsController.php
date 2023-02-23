<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\EditCommentRequest;
use App\Http\Requests\Teacher\TeacherCommentRequest;
use App\Models\ClassPost;
use Illuminate\Http\Request;
use Mail;
use App\Mail\CommentMail;
use App\Mail\TaggedMail;
use Auth;
use Inertia\Inertia;
use App\Mail\PostMail;
use App\Models\Student\Like;
use App\Models\ClassPostsCommentHistory;
use App\Models\CommentHistory;
use App\Models\PostHistory;
use App\Models\Student\Comment;
use App\Models\Student\Post;
use App\Models\Student\Student;
use App\Models\Teacher;
use App\Notifications\TagNotification;
use App\Models\ClassPostsLike;
use App\Models\Admin;
use App\Mail\AdminPostCommentTaggedMail;
use App\Notifications\AdminTagNotification;
use App\Models\Student\ClassStudent;
use App\Models\SiteSetting;
use App\Models\ClassTeacher;
use App\Models\Classes;
use Carbon\Carbon;

class PostsController extends Controller
{
    /**
     * Fetch all the likes for the given post id.
     *
     * @param  integer  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchLikes($postId)
    {
        $post = Post::with('likes')->find($postId);
        if (!$post) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'No post found with the given id.',
            ]);
        }
        $postLikes       = $post->likes;
        $allLikes        = [];
        $allTeacherLikes = [];
        $allAdminLikes   =[];
        foreach ($postLikes as $like) {
            if ($like->liked_by !== 0 && $like->teacher_id == 0 && $like->admin_id == 0) {
                $student    = Student::find($like->liked_by);
                $allLikes[] = [
                    'id'     => $student->id,
                    'name'   => $student->full_name,
                    'avatar' => $student->getProfilePicture(),
                    'type'   => "student",
                ];
            }
            if ($like->teacher_id !== 0 && $like->liked_by == 0 && $like->admin_id == 0) {
                $teacher           = Teacher::find($like->teacher_id);
                $allTeacherLikes[] = [
                    'id'     => $teacher->id,
                    'name'   => $teacher->full_name,
                    'avatar' => $teacher->getProfilePicture(),
                    'type'   => "teacher",
                ];
            }
            if ($like->admin_id !== 0 && $like->teacher_id == 0 && $like->liked_by == 0) {
                $admin           = Admin::find($like->admin_id);
                $allAdminLikes[] = [
                    'id'     => $admin->id,
                    'name'   => $admin->full_name,
                    'avatar' => $admin->getProfilePicture(),
                    'type'   => "admin",
                ];
            }
        };

        return $this->responseSuccess([
            'likes' => array_merge($allTeacherLikes, $allLikes,$allAdminLikes),
            'owner' => Like::where('liked_by', 'teacher')->where('teacher_id',Auth::guard('teacher')->user()->id)->where('post_id',$postId)->first(),
        ]);
    }

    /**
     * Fetch all the comments for the given post id.
     *
     * @param  integer  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchComments($postId)
    {
        $post = Post::with(['comments'=>function($q){
            $q->orderByRaw("
            case
            when status = 'pending' then 0
            when status = 'approved' then 1
            when status ='rejected' then 2
            else 1 end ASC");
        }])->find($postId);
        if (!$post) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'No post found with the given id.',
            ]);
        }
        $allComments = [];
        foreach ($post->comments as $comment) {
            $student       = Student::find($comment->commented_by);
            $allComments[] = [
                'id'         => $student->id,
                'name'       => $student->full_name,
                'avatar'     => $student->getProfilePicture(),
                'comment'    => $comment->comment,
                'commentId'  => $comment->id,
                'status'     => $comment->status,
                'notes'      => $comment->notes,
                'created_at' => $comment->created_at,
            ];
        };

        return $this->responseSuccess([
            'comments' => $allComments,
        ]);
    }

    /**
     * Approve or reject the student's post.
     *
     * @param  integer  $postId
     * @param  string  $status
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveReject($postId, $status)
    {
        $post = Post::find($postId);
        $teacher = Teacher::find(auth()->user()->id);
        if ($status == "rejected" || $status == "approved") {
            $data = array_merge([
                'post_id' => $postId,
                'desc'    => $post->desc,
                'notes'   => request('notes') ?? null,
                'status'  => $status,
            ]);
            $postHistory = PostHistory::create($data);
        }
        if (!$post) {
            return $this->responseNotFound();
        }
        try {
            $classStudent = ClassStudent::where('student_id',$post->created_by)->first();
            $classTeacherId = ClassTeacher::where('class_id',$classStudent->class_id)->pluck('teacher_id');
            $allTeachers = Teacher::whereIn('id',$classTeacherId)->get();
            $postCreator = Student::where('id',$post->created_by)->first();
            $day = SiteSetting::where('name', 'view_posts_on')->first();
            if($status == "approved")
            {
                if (preg_match_all('!@(.+)(?:\s|$)!U', $post->desc, $matches)) {
                    $usernames = $matches[1];
                    foreach ($usernames as $username) {
                        $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();

                        if($student){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $postCreator->full_name,
                                'body'     => " has mentioned you in post",
                                'post_type' => "student_post",
                                'post_id'  => $post->id,
                                'commented_by' =>$post->created_by,
                                'desc' => $post->desc,
                                'dear_name' => $student->first_name . " " . $student->last_name,
                            ];

                            Mail::to($student->email)->send(new PostMail($details));
                            $student->notify(new TagNotification($details));
                        }
                        if($teacher){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $postCreator->full_name,
                                'body'     => " has mentioned you in post",
                                'post_type' => "teacher_post",
                                'post_id'  => $post->id,
                                'commented_by' =>"",
                                'desc' => $post->desc,
                                'dear_name' => $teacher->first_name . " " . $teacher->last_name
                            ];

                            Mail::to($teacher->email)->send(new PostMail($details));
                            $teacher->notify(new TagNotification($details));
                        }
                        if($admin){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $postCreator->full_name,
                                'body'     => " has mentioned you in post",
                                'post_type' => "admin_post",
                                'post_id'  => $post->id,
                                'commented_by' =>"",
                                'desc' => $post->desc,
                                'dear_name' => $admin->first_name . " " . $admin->last_name
                            ];

                            Mail::to($admin->email)->send(new PostMail($details));
                        }
                    }
                }
                foreach ($allTeachers as $teacherData) {
                    $authTeacher = Teacher::find(auth()->user()->id);
                    if($teacherData->id == $authTeacher->id){
                        $details = [
                            'name'         => $teacherData->full_name,
                            'body'         => " has Approved your post.",
                            'post_type'    => "student_post",
                            'post_id'      => $post->id,
                            'commented_by' => $post->user->id,
                            'desc' => $post->desc,
                            'dear_name'    => $postCreator->full_name,
                        ];
                        Mail::to($postCreator->email)->send(new PostMail($details));
                        $postCreator->notify(new TagNotification($details));
                    }
                    if($teacherData->id != $authTeacher->id){
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has Approved ".$postCreator->full_name."'s Post.",
                            'post_type'    => "teacher_post",
                            'post_id'      => $post->id,
                            'commented_by' => $post->user->id,
                            'desc' => $post->desc,
                            'dear_name'    => $teacherData->fullname,
                        ];
                        Mail::to($teacherData->email)->send(new PostMail($details));
                        $teacherData->notify(new TagNotification($details));
                    }
                    
                }
                $findString = preg_match("~@everyone~",$post->desc);
                if($findString){
                    $now       = Carbon::now();
                    $day       = SiteSetting::where('name', 'view_posts_on')->first();
                    $classesId = $postCreator->classes()->pluck('id');
                    $class = $postCreator->classes()->first();
                    $id = Classes::where('track_id',$class->track_id)->pluck('id');        
                    if ($now->format('l') == $day->value) {
                        $studentsPosts = ClassStudent::whereIn('class_id',$id)->pluck('student_id');
                        $class_teacher = ClassTeacher::whereIn('class_id',$id)->pluck('teacher_id');
                    } else {
                        $studentsPosts = ClassStudent::whereIn('class_id',$classesId)->pluck('student_id');
                        $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
                    }
                    $students  = Student::where('id', '!=', $postCreator->id)->whereIn('id', $studentsPosts)->get();                    $teachers = Teacher::whereIn('id',$class_teacher)->get();
                    $admin = Admin::get();
                    $this->studentAllTagNotifyPost($students, $post, 'student_post');
                    $this->studentAllTagNotifyPost($teachers, $post, 'student_post');
                    $this->studentAllTagNotifyPost($admin, $post, 'student_post');
                }
            } else {
                foreach ($allTeachers as $teacherData) {
                    $authTeacher = Teacher::find(auth()->user()->id);
                    if($teacherData->id == $authTeacher->id){
                        $details = [
                            'name'         => $teacherData->full_name,
                            'body'         => " has rejected your post.",
                            'post_type'    => "student_post",
                            'post_id'      => $post->id,
                            'commented_by' => $post->user->id,
                            'desc' => $post->desc,
                            'dear_name'    => $postCreator->full_name,
                        ];
                        Mail::to($postCreator->email)->send(new PostMail($details));
                        $postCreator->notify(new TagNotification($details));
                    }
                    if($teacherData->id != $authTeacher->id){
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has rejected ".$postCreator->full_name."'s Post.",
                            'post_type'    => "teacher_post",
                            'post_id'      => $post->id,
                            'commented_by' => $post->user->id,
                            'desc' => $post->desc,
                            'dear_name'    => $teacherData->fullname,
                        ];
                        Mail::to($teacherData->email)->send(new PostMail($details));
                        $teacherData->notify(new TagNotification($details));
                    }
                }
            }

            $post->update([
                'status'                       => $status,
                'status_updated_on'            => now(),
                'status_updated_by_teacher_id' => auth()->guard('teacher')->id(),
                'notes'                        => request('notes') ?? null,
            ]);

            return $this->responseSuccess("Post {$status} successfully.");
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Approve or reject the student's comments.
     *
     * @param  integer  $commentId
     * @param  string  $status
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveRejectComment($commentId, $status)
    {
        $comment = Comment::find($commentId);
        $teacher = Teacher::find(auth()->user()->id);
        if ($status == "rejected" || $status == "approved") {
            $data = array_merge([
                'post_id'    => $comment->post_id,
                'comment_id' => $commentId,
                'comment'    => $comment->comment,
                'notes'      => request('notes') ?? null,
                'status'     => $status,
            ]);
            $commentHistory = CommentHistory::create($data);
        }
        if (!$comment) {
            return $this->responseNotFound();
        }
        try {
            $post = Post::where('id', $comment->post_id)->first();
            $now = Carbon::now();
            $day = SiteSetting::where('name', 'view_posts_on')->first();
            $classStudent = ClassStudent::where('student_id',$comment->user->id)->first();
            $classTeacherId = ClassTeacher::where('class_id',$classStudent->class_id)->pluck('teacher_id');
            $allTeachers = Teacher::whereIn('id',$classTeacherId)->get();
            $class = Classes::where('id',$classStudent->class_id)->first();
            if($status == "approved")
            {
                $findString = preg_match("~@everyone~",$comment->comment);
                if($findString){
                    if (Carbon::now()->format('l') == $day->value) {
                        $id = Classes::where('track_id',$class->track_id)->pluck('id');
                    } else {
                        $id = Classes::where('id',$classStudent->class_id)->pluck('id');
                    }
                    $studentsPosts = ClassStudent::whereIn('class_id',$id)->pluck('student_id');
                    $class_teacher = ClassTeacher::whereIn('class_id',$id)->pluck('teacher_id');
                    $students  = Student::where('id', '!=', $comment->user->id)->whereIn('id', $studentsPosts)->get();
                    $this->allTaggedNotify($students,$comment);
                    $teachers  = Teacher::whereIn('id',$class_teacher)->get();
                    $this->allTaggedNotify($teachers,$comment);
                    $admins  = Admin::get();
                    $this->allTaggedNotify($admins,$comment);
                }
                
                if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->comment, $matches)) {
                    $usernames = $matches[1];
                    foreach ($usernames as $username) {
                        $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();

                        if($student){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->user->fullname,
                                'body'     => "has mentioned you in comment section",
                                'post_type' => "student_post",
                                'post_id'  => $comment->post_id,
                                'commented_by' => $comment->user->id,
                                'comment' => $comment->comment,
                                'dear_name' => $student->first_name . " " . $student->last_name,
                            ];

                            Mail::to($student->email)->send(new TaggedMail($details));
                            $student->notify(new TagNotification($details));
                        }
                        if($teacher){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->user->fullname,
                                'body'     => " has mentioned you in comment section",
                                'post_type' => "student_post",
                                'post_id'  => $comment->post_id,
                                'commented_by' => $comment->user->id,
                                'comment' => $comment->comment,
                                'dear_name' => $teacher->first_name . " " . $teacher->last_name
                            ];

                            Mail::to($teacher->email)->send(new TaggedMail($details));
                            $teacher->notify(new TagNotification($details));
                        }
                        if($admin){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->user->fullname,
                                'body'     => " has mentioned you in comment section",
                                'post_type' => "student_post",
                                'post_id'  => $comment->post_id,
                                'commented_by' => $comment->user->id,
                                'comment' => $comment->comment,
                                'dear_name' => $admin->first_name . " " . $admin->last_name
                            ];

                            Mail::to($admin->email)->send(new TaggedMail($details));
                            $admin->notify(new TagNotification($details));
                        }
                    }
                }else{
                    
                    $details = [
                        'greeting'     => 'Hi',
                        'name'         => $comment->user->fullname,
                        'body'         => " has commented on your post",
                        'post_type'    => "student_post",
                        'post_id'      => $comment->post_id,
                        'commented_by' => $comment->user->id,
                        'comment'      => $comment->comment,
                        'dear_name'    => $post->user->full_name,
                    ];
                    if($comment->user->id !== $post->user->id){
                        Mail::to($post->user->email)->send(new CommentMail($details));
                        $post->user->notify(new TagNotification($details));
                    }
                    
                }
                $authTeacher = Teacher::find(auth()->user()->id);
                foreach ($allTeachers as $teacher) {
                    if($teacher->id == $authTeacher->id){
                        $details = [
                            'name'         => $teacher->full_name,
                            'body'         => " has approved your comment",
                            'post_type'    => "student_post",
                            'post_id'      => $comment->post_id,
                            'commented_by' => $comment->user->id,
                            'comment'      => $comment->comment,
                            'dear_name'    => $comment->user->fullname,
                        ];
                        Mail::to($comment->user->email)->send(new CommentMail($details));
                        $comment->user->notify(new TagNotification($details));
                    }else{
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has approved ".$comment->user->full_name."'s comment",
                            'post_type'    => "student_post",
                            'post_id'      => $comment->post_id,
                            'commented_by' => $teacher->id,
                            'comment'      => $comment->comment,
                            'dear_name'    => $teacher->fullname,
                        ];
                        Mail::to($teacher->email)->send(new CommentMail($details));
                        $teacher->notify(new TagNotification($details));
                    }
                    
                }
                
            } else {
                $authTeacher = Teacher::find(auth()->user()->id);
                foreach ($allTeachers as $teacher) {
                    if($teacher->id == $authTeacher->id){
                        $details = [
                            'name'         => $teacher->full_name,
                            'body'         => " has rejected your comment",
                            'post_type'    => "student_post",
                            'post_id'      => $comment->post_id,
                            'commented_by' => $comment->user->id,
                            'comment' => $comment->comment,
                            'dear_name' => $comment->user->fullname,
                        ];
                        Mail::to($comment->user->email)->send(new CommentMail($details));
                        $comment->user->notify(new TagNotification($details));
                    }else{
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has rejected ".$comment->user->full_name."'s comment",
                            'post_type'    => "student_post",
                            'post_id'      => $comment->post_id,
                            'commented_by' => $teacher->id,
                            'comment'      => $comment->comment,
                            'dear_name'    => $teacher->fullname,
                        ];
                        Mail::to($teacher->email)->send(new CommentMail($details));
                        $teacher->notify(new TagNotification($details));
                    }
                    
                }
            }
            $comment->update([
                'status'                       => $status,
                'status_updated_on'            => now(),
                'status_updated_by_teacher_id' => auth()->guard('teacher')->id(),
                'notes'                        => request('notes') ?? null,
            ]);

            return $this->responseSuccess("Comment {$status} successfully.");
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    public function getnotes($postId)
    {
        return $this->responseSuccess([
            'notes' => PostHistory::where('post_id', $postId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function getCommentNotes($commentId)
    {
        return $this->responseSuccess([
            'notes' => CommentHistory::where('comment_id', $commentId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function getClassPostCommentNotes($commentId)
    {
        return $this->responseSuccess([
            'notes' => ClassPostsCommentHistory::where('class_post_comment_id', $commentId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function studentComments($id)
    {
        $post     = Post::find($id);
        $comments = Comment::where('post_id', $post->id)->with('user.media','teacher.media','admin.media')->orderBy('updated_at', 'desc')->get();
        return $this->responseSuccess($comments);
    }

    public function storeComments(TeacherCommentRequest $request)
    {
        try {
            $teacher               = Teacher::where('id', auth()->user()->id)->first();
            $comment               = new Comment();
            $comment->post_id      = $request->post_id;
            $comment->commented_by = 0;
            $comment->teacher_id   = $teacher->id;
            $comment->comment      = str_replace(array( '[', ']' ), '', $request->comment);
            $comment->status       = 'not_required';
            $comment->save();
            
            if ($comment->status === "not_required") {
                $this->studentPostCommentsNotify($teacher, $comment);
            }

        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(Comment $comment)
    {
        try {
            $comment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function update(EditCommentRequest $request, Comment $comment)
    {
        try {
            $teacher = Teacher::where('id', auth()->user()->id)->first();
            $comment->update(['comment' => str_replace(array( '[', ']' ), '', $request->comment_1)]);
            if ($comment->status === "not_required") {
                $this->studentPostCommentsNotify($teacher, $comment);
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show($classPostsLike)
    {
        try {
            $post = ClassPost::with('likes')->find($classPostsLike);
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
                if ($like->liked_by === "student") {
                    $student    = Student::find($like->liked_id);
                    $allLikes[] = [
                        'id'     => $student->id,
                        'name'   => $student->full_name,
                        'avatar' => $student->getProfilePicture(),
                        'type'   => 'student',
                    ];
                }
                if ($like->liked_by === "teacher") {
                    $teacher           = Teacher::find($like->teacher_id);
                    $allTeacherLikes[] = [
                        'id'     => $teacher->id,
                        'name'   => $teacher->full_name,
                        'avatar' => $teacher->getProfilePicture(),
                        'type'   => 'teacher',
                    ];
                }
                if ($like->liked_by === "admin") {
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
                'likes' => array_merge($allTeacherLikes, $allLikes,$allAdminLikes),
                'owner' => ClassPostsLike::where('liked_by', 'teacher')->where('teacher_id',Auth::guard('teacher')->user()->id)->where('class_post_id',$classPostsLike)->first(),
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function showPost($post)
    {
        try {
            $post = Post::find($post);
            if(!$post){
                return Inertia::render('Teacher/Partials/Show', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $media = $post->media;
            
            $classesId = ClassTeacher::where('teacher_id',Auth::user()->id)->pluck('class_id');            
            $students = Student::whereHas('classes', function ($q) use ($classesId) {
                $q->whereIn('id', $classesId);
            })->get();

            $student  = Student::where('id',$post->created_by)->with('media')->first();
            $post_type = "student_post";
            return Inertia::render('Teacher/Partials/Show', ['post_type' => $post_type,
            'post_exits' => true,
            'student' => $student,
            'students' => $students,
            'post' => $post,
            'media' => $media,
            'like' => $post->likes->where("liked_by", Auth::user()->id)->count(),
            'comments' => $post->comments, 
            'modulePanel' =>"teacher"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function classPostShow($classPost)
    {
        try {
            $classPost = ClassPost::find($classPost);
            if(!$classPost){
                return Inertia::render('Teacher/Partials/Classpostshow', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $media = $classPost->media;
            $classesId = ClassTeacher::where('teacher_id',Auth::user()->id)->pluck('class_id'); 
            $students = Student::has('classes')->get();
            $student  = Teacher::where('id',$classPost->teacher_id)->with('media')->first();
            $post_type = "teacher_post";

            return Inertia::render('Teacher/Partials/Classpostshow', 
            ['post_type' => $post_type,
            'post_exits' => true,  
            'student' => $student,
            'students' => $students,
            'post' => $classPost,
            'media' => $media,
            'like' => $classPost->likes->where("teacher_id", Auth::user()->id)->count(),
            'total_likes' => $classPost->likes->count(),
            'comments' => $classPost->comments
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function studentAllTagNotifyPost($data , $post, $postType){
        $postCreator = Student::where('id',$post->created_by)->first();
        foreach($data as $allTag){
            if($allTag){

                $details = [
                    'greeting' => 'Hi',
                    'name'     => $postCreator->full_name,
                    'body'     => "has mentioned you in post section",
                    'commented_by' => $post->user->id,
                    'desc' => $post->desc,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $post->id,
                    'post_type' => $postType
                ];
    
                Mail::to($allTag->email)->send(new PostMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }
    public function allTaggedNotify($data, $comment){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => $comment->user->fullname,
                    'body'     => "has mentioned you in comment section",
                    'post_type' => "student_post",
                    'post_id'  => $comment->post_id,
                    'commented_by' => $comment->user->id,
                    'comment' => $comment->comment,
                    'dear_name' => $allTag->first_name . " " . $allTag->last_name,
                ];
                Mail::to($allTag->email)->send(new TaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
            
        }
    }

    public function allTaggedNotifyTeacherComments($data, $comment){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has mentioned you in comment section",
                    'post_type' => "student_post",
                    'commented_by' => $comment->teacher_id,
                    'comment' => $comment->comment,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $comment->post_id,
                ];
    
                Mail::to($allTag->email)->send(new TaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }

    public function studentPostCommentsNotify($teacher, $comment){
        $findString = preg_match("~@everyone~",$comment->comment);
        if($findString){
            $student_id = Post::where('id',$comment->post_id)->select('created_by')->first();
            $class_id = ClassStudent::where('student_id',$student_id->created_by)->pluck('class_id');
            $student_ids = ClassStudent::where('class_id',$class_id)->pluck('student_id');
            $teacher_ids = ClassTeacher::where('class_id',$class_id)->pluck('teacher_id');
            $students = Student::whereIn('id',$student_ids)->get();
            $this->allTaggedNotifyTeacherComments($students,$comment);
            $teachers = Teacher::whereIn('id',$teacher_ids)->where('id','!=',Auth::user()->id)->get();
            $this->allTaggedNotifyTeacherComments($teachers,$comment);
            $admins = Admin::get();
            $this->allTaggedNotifyTeacherComments($admins,$comment);
        }

        $post = Post::where("id", $comment->post_id)->first();

        if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->comment, $matches)) {
            $usernames = $matches[1];

            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                if($student){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'post_type' => "student_post",
                        'commented_by' => $comment->teacher_id,
                        'comment' => $comment->comment,
                        'dear_name' => $student->full_name,
                        'post_id' => $comment->post_id,
                    ];

                    Mail::to($student->email)->send(new TaggedMail($details));
                    $student->notify(new TagNotification($details));
                }
                if($admin){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'post_type' => "admin_post",
                        'commented_by' => $comment->teacher_id,
                        'comment' => $comment->comment,
                        'dear_name' => $admin->full_name,
                        'post_id' => $comment->post_id,
                    ];

                    Mail::to($admin->email)->send(new TaggedMail($details));
                    $admin->notify(new TagNotification($details));
                }
            }
        } else {
            $details = [
                'greeting'     => 'Hi',
                'name'         => $teacher->full_name,
                'body'         => "has commented your post.",
                'post_type'    => "student_post",
                'commented_by' => $comment->teacher_id,
                'post_id'      => $comment->post_id,
            ];
            $post->user->notify(new TagNotification($details));
        }
    }
}
