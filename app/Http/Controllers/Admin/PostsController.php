<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassPost;
use App\Models\ClassPostsCommentHistory;
use App\Models\CommentHistory;
use App\Models\PostHistory;
use App\Models\Student\Post;
use App\Models\Student\Student;
use App\Models\Admin;
use App\Models\AdminPost;
use App\Models\Teacher;
use Inertia\Inertia;
use App\Models\Student\Like;
use Auth;
use Illuminate\Http\Request;
use App\Models\Student\Comment;
use App\Http\Requests\Student\EditCommentRequest;
use App\Mail\TaggedMail;
use Mail;
use App\Notifications\AdminTagNotification;
use App\Notifications\TagNotification;
use App\Models\Student\ClassStudent;
use App\Models\Classes;
use App\Models\ClassTeacher;

class PostsController extends Controller
{
    /**
     * Fetch all the likes for the given post id.
     *
     * @param  integer  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchLikes($postId, $modelName)
    {
        if ($modelName && $modelName === "class_posts") {
            $post = ClassPost::with('likes')->find($postId);

        } else {
            $post = Post::with(['likes' => function ($q) {
                $q->select('liked_by as liked_id', 'teacher_id', 'id', 'post_id');
            }])->find($postId);
        }

        if (!$post) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'No post found with the given id.',
            ]);
        }
        $postLikes       = $post->likes;
        $allLikes        = [];
        $allTeacherLikes = [];
        foreach ($postLikes as $like) {
            if ($like->liked_id != 0) {
                $student    = Student::find($like->liked_id);
                $allLikes[] = [
                    'id'     => $student->id,
                    'name'   => $student->full_name,
                    'avatar' => $student->getProfilePicture(),
                    'type'   => 'student',
                ];
            }
            if ($like->teacher_id != 0) {
                $teacher           = Teacher::find($like->teacher_id);
                $allTeacherLikes[] = [
                    'id'     => $teacher->id,
                    'name'   => $teacher->full_name,
                    'avatar' => $teacher->getProfilePicture(),
                    'type'   => 'teacher',
                ];
            }
        };

        return $this->responseSuccess([
            'likes' => array_merge($allTeacherLikes, $allLikes),
        ]);
    }

    /**
     * Fetch all the comments for the given post id.
     *
     * @param  integer  $postId
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchPostsComments($postId)
    {
        $post = ClassPost::with(['comments'=>function($q){
            $q->orderByRaw("
            case
            when status = 'pending' then 0
            when status = 'approved' then 1
            when status ='rejected' then 2
            when status ='not_required' then 3
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

            if ($comment->commented_by == "student") {
                $commentsData = Student::find($comment->commentor_id);
            } 
            if ($comment->commented_by == "teacher") {
                $commentsData = Teacher::find($comment->commentor_id);
            }
            if ($comment->commented_by == "admin") {
                $commentsData = Admin::find($comment->commentor_id);
            }
            $allComments[] = [
                'id'      => $commentsData->id,
                'name'    => $commentsData->full_name,
                'avatar'  => $commentsData->getProfilePicture(),
                'comment' => $comment,
            ];
        }
        return $this->responseSuccess([
            'comments' => $allComments,
        ]);
    }

    public function fetchComments($postId)
    {
        $post = Post::with(['comments'=>function($q){
            $q->with('admin.media')->orderBy("created_at","DESC");
        }])->find($postId);
        
        if (!$post) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'No post found with the given id.',
            ]);
        }

        $allCommentsData = [];
        
        foreach ($post->comments as $comment) {

            if ($comment->teacher_id == 0 && $comment->admin_id == 0) {
                $commentsData = Student::find($comment->commented_by);
                $type = "student";
               
            } 
            if ($comment->commented_by == 0 && $comment->admin_id == 0) {
                $commentsData = Teacher::find($comment->teacher_id);
                $type="teacher";
             
            }
            if ($comment->commented_by == 0 && $comment->teacher_id == 0) {
                $commentsData = Admin::find($comment->admin_id);
                $type = "Admin";

            }

            $allCommentsData[] = [
                'id'      => $commentsData->id,
                'name'    => $commentsData->full_name,
                'avatar'  => $commentsData->getProfilePicture(),
                'comment' => $comment,
                'type' => $type,
            ];
        }
        return $this->responseSuccess([
            'comments' => $allCommentsData,
        ]);
    }

    public function getClassPostCommentNotes($commentId)
    {
        return $this->responseSuccess([
            'notes' => ClassPostsCommentHistory::where('class_post_comment_id', $commentId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function getPostCommentNotes($commentId)
    {
        return $this->responseSuccess([
            'notes' => CommentHistory::where('comment_id', $commentId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function getnotes($postId)
    {
        return $this->responseSuccess([
            'notes' => PostHistory::where('post_id', $postId)->orderBy('created_at', 'DESC')->get(),
        ]);
    }

    public function studentProfile($id)
    {
        try {
            $student = Student::where('id', $id)->with(['posts' => function ($query) {
                $query->where('status', 'approved')->orWhere('created_by', auth()->user()->id)
                    ->withCount(['likes', 'comments'])->orderBy('id', "DESC");

            }, 'posts.likes' => function ($query) {
                $query->where("liked_by", auth()->user()->id);
            }, 'posts.media', 'posts.comments.user', 'media'])->first();

            return Inertia::render('Admin/Profile/Profile', ['student' => $student]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function teacherProfile($id)
    {
        try {
            return Inertia::render('Admin/Profile/TeacherProfile', [
                'name' => Teacher::where('id', $id)->with('media')->first(), 
                'teacher' => ClassPost::with(['comments', 'media', 'comments.creator', 'teacher.media', 'likes'])->withCount(['likes', 'comments' => function ($query) {$query->where('status', 'approved')->orWhere('status', 'not_required');}])->orderBy('updated_at', 'DESC')->get()
            ]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminProfile($id)
    {
        try {
            $name      = Admin::where('id', $id)->with('media')->first();
            $posts = AdminPost::withCount('comments','likes')
                    ->with(['admin.media','media','likes' => function ($query) {
                        $query->where("admin_id", auth()->id() );
                    },'class'])->orderBy('id', 'DESC')->get();

            $data['students']  = Student::get()->toArray();
            $data['teacher'] = Teacher::get()->toArray();
    
            $students = array_merge($data['teacher'], $data['students']);

            return Inertia::render('Admin/Profile/AdminProfile', ['admin' => $posts, 'name' => $name, 'students' => $students]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function storeLikes($id, $check)
    {
        try {
            $post = Post::find($id);
            if ($check == 'true') {
                $like = Like::updateOrCreate([
                    'post_id'  => $post->id,
                    'admin_id' => auth()->user()->id,
                ]);

                return $this->responseSuccess([$like]);

            } else {
                $like = Like::where('post_id', $post->id)
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
            $post = Post::with('likes')->find($postsLike);
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
                if ($like->liked_by !== 0 && $like->teacher_id == 0 && $like->admin_id == 0) {
                    $student    = Student::find($like->liked_by);
                    $allLikes[] = [
                        'id'     => $student->id,
                        'name'   => $student->full_name,
                        'avatar' => $student->getProfilePicture(),
                        'type'   => 'student',
                    ];
                }
                if ($like->teacher_id !== 0 && $like->liked_by == 0 && $like->admin_id == 0) {
                    $teacher           = Teacher::find($like->teacher_id);
                    $allTeacherLikes[] = [
                        'id'     => $teacher->id,
                        'name'   => $teacher->full_name,
                        'avatar' => $teacher->getProfilePicture(),
                        'type'   => 'teacher',
                    ];
                }
                if ($like->admin_id !== 0 && $like->teacher_id == 0 && $like->admin_id == 0) {
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
                'owner' => Like::where('admin_id',Auth::user()->id)->where('post_id',$postsLike)->first(),
                ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function storeComment(Request $request)
    {
        try {
            $comment = Comment::create([
                'post_id'      => $request->post_id,
                'admin_id'     => auth()->user()->id,
                'comment'      => str_replace(array( '[', ']' ), '', $request->comment),
                'status'       => 'not_required',
            ]);

            if($comment->status === "not_required"){
                $this->studentPostCommentNotify($comment);
            }

        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroyComment(Comment $comment)
    {
        try {
            $comment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function updateComment(EditCommentRequest $request, Comment $comment)
    {
        try {
            $comment->update(['comment' => str_replace(array( '[', ']' ), '', $request->comment_1)]);
            if($comment->status === "not_required"){
                $this->studentPostCommentNotify($comment);
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminAllTagNotifyComment($data , $comment, $postType){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has mentioned you in comment section",
                    'commented_by' => $comment->admin_id,
                    'comment' => $comment->comment,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $comment->post_id,
                    'post_type' => $postType
                ];
    
                Mail::to($allTag->email)->send(new TaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }

    public function studentPostCommentNotify($comment){
        if($comment){
            $findString = preg_match("~@everyone~",$comment->comment);
            if($findString){
                $post = Post::where('id', $comment->post_id)->first();
                $classId = ClassStudent::where('student_id',$post->user->id)->first();                 
                $studentsId = ClassStudent::where('class_id',$classId->class_id)->pluck('student_id');
                $teacherId = ClassTeacher::where('class_id',$classId->class_id)->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$teacherId)->get();
                $this->adminAllTagNotifyComment($teachers, $comment, 'student_post');
                $students = Student::whereIn('id',$studentsId)->get();
                $this->adminAllTagNotifyComment($students, $comment, 'student_post');
            }
        }
        if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->comment, $matches)) {
            $usernames = $matches[1];
            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                
                if($student != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $student->id,
                        'comment' => $comment->comment,
                        'dear_name' => $student->full_name,
                        'post_id' => $comment->post_id,
                        'post_type' => 'student_post'
                    ];

                    Mail::to($student->email)->send(new TaggedMail($details));
                    $student->notify(new TagNotification($details));
                }
                if($teacher != null ){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => auth()->user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'commented_by' => $teacher->id,
                        'comment' => $comment->comment,
                        'dear_name' => $teacher->full_name,
                        'post_id' => $comment->post_id,
                        'post_type'=> 'student_post'
                    ];

                    Mail::to($teacher->email)->send(new TaggedMail($details));
                    $teacher->notify(new TagNotification($details));
                }
            }
        }
        else{
            $post = Post::find($comment->post_id);
            if($post){
                $student = Student::where('id',$post->created_by)->first();
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has commented in your post",
                    'commented_by' => $student->id,
                    'comment' => $comment->comment,
                    'dear_name' => $student->full_name,
                    'post_id' => $comment->post_id,
                    'post_type' => 'student_post'
                ];
    
                Mail::to($student->email)->send(new TaggedMail($details));
                $student->notify(new TagNotification($details));
            }
            
        }
    }
}
