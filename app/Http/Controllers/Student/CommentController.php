<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\CommentRequest;
use App\Http\Requests\Student\EditCommentRequest;
use App\Models\Student\Comment;
use App\Models\Student\Post;
use App\Models\Student\Like;
use App\Models\ClassPostLike;
use App\Models\ClassPost;
use App\Models\Student\Student;
use App\Models\Teacher;
use App\Notifications\TagNotification;
use Illuminate\Http\Request;
use Auth;
use Mail;
use App\Mail\ApproveRejectCommentMail;
use App\Models\Admin;
use App\Models\ClassTeacher;

class CommentController extends Controller
{
    /**
     * Display a listing of the comments.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $post     = Post::find($id);
        $comments = Comment::where('post_id', $post->id)->with('user.media', 'teacher.media','admin.media')->orderBy('updated_at', 'desc')->get();
        return $this->responseSuccess($comments);
    }

    /**
     * Store a newly created Comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CommentRequest $request)
    {   
        try {
            $comment = Comment::create([
                'post_id'      => $request->post_id,
                'commented_by' => auth()->guard('student')->user()->id,
                'comment'      => str_replace(array( '[', ']' ), '', $request->comment),
                'status'       => 'pending',
            ]);
           
            if ($comment->status === "pending") {
                $this->approvedRejectCommentsTeacherNotify($comment, 'store');
            }

        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified comment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Student\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(EditCommentRequest $request, Comment $comment)
    {
        try {
            $comment->update(['comment' => str_replace(array( '[', ']' ), '', $request->comment_1), 'status' => 'pending']);

            if ($comment->status === "pending") {
                $this->approvedRejectCommentsTeacherNotify($comment ,'update');
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param  \App\Models\Student\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        try {
            $comment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function fetchLikes($postId)
    {
        $post = Post::with('likes')->find($postId);
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
            if ($like->admin_id !== 0 && $like->liked_by == 0 && $like->teacher_id == 0) {
                $admin    = Admin::find($like->admin_id);
                $allAdminLikes[] = [
                    'id'     => $admin->id,
                    'name'   => $admin->full_name,
                    'avatar' => $admin->getProfilePicture(),
                    'type'   => "admin",
                ];
            }
        };

        return $this->responseSuccess([
            'likes' => array_merge($allTeacherLikes, $allLikes, $allAdminLikes),
            'owner' => Like::where('liked_by',Auth::guard('student')->user()->id)->where('post_id',$postId)->first(),
        ]);
    }

    public function approvedRejectCommentsTeacherNotify($comment, $update){
        $student = Student::where('id', auth()->user()->id)->first();
        $classesId = Auth::user()->classes()->pluck('id');
        $post = Post::where("id", $comment->post_id)->first();
        $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
        $teachers = Teacher::whereIn('id',$class_teacher)->get();

        foreach ($teachers as $data) {
            if($comment->commented_by == $post->user->id){
                $message = "has " .($update == "store" ? "commented" : "updated the comment"). " on his post. Please check and Approve/Reject the Comment.";
            } else if($post){
                $message = "has " .($update == "store" ? "commented" : "updated the comment"). " on ".$post->user->full_name."'s post. Please check and Approve/Reject the Comment";
            }else{
                $message = "has " .($update == "store" ? "commented" : "updated the comment"). " on your post. Please check and Approve/Reject the Comment.";
            }
            $details = [
                'greeting'     => 'Hi',
                'name'         => $student->first_name . ' ' . $student->last_name,
                'body'         => $message,
                'post_type'    => "student_post_notification",
                'commented_by' => $comment->commented_by,
                'post_id' => $comment['post_id'],
                'comment' => $comment->comment,
                'teacher_name' => $data->first_name. ' ' . $data->last_name,
                'type' => "student"
            ];
            Mail::to($data->email)->send(new ApproveRejectCommentMail($details));
            $data->notify(new TagNotification($details));
        }
    }
}
