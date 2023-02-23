<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\CommentRequest;
use App\Http\Requests\Student\EditCommentRequest;
use App\Models\ClassPost;
use App\Models\ClassPostsComment;
use App\Models\Student\Student;
use App\Models\Teacher;
use App\Notifications\TagNotification;
use Mail;
use App\Mail\ApproveRejectCommentMail;
use App\Mail\TaggedMail;
use App\Models\Admin;
use Illuminate\Http\Request;
use Auth;
use App\Models\ClassTeacher;

class ClassPostsCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $post     = ClassPost::find($id);
        $comments = ClassPostsComment::where('class_post_id', $post->id)->with('creator.media', 'classPost.teacher.media','admin.media')->orderBy('updated_at', 'desc')->get();
        return $this->responseSuccess($comments, '');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CommentRequest $request)
    {
        try {
            $data = array_merge([
                'class_post_id' => $request->post_id,
                'commented_by'  => 'student',
                'commentor_id'  => auth()->guard('student')->user()->id,
                'content'       => str_replace(array( '[', ']' ), '', $request->comment),
                'status'        => 'pending',
            ]);

            $classPostsComment = ClassPostsComment::create($data);
            if ($classPostsComment->status === "pending") {
                $this->teacherPostCommentsNotify($classPostsComment, 'store');
            }

        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ClassPostsComment  $classPostsComment
     * @return \Illuminate\Http\Response
     */
    public function update(EditCommentRequest $request, ClassPostsComment $classPostsComment)
    {
        try {
            $classPostsComment->update(['content' => str_replace(array( '[', ']' ), '', $request->comment_1), 'status' => 'pending']);

            if ($classPostsComment->status === "pending") {
                $this->teacherPostCommentsNotify($classPostsComment, 'update');
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ClassPostsComment  $classPostsComment
     * @return \Illuminate\Http\Response
     */
    public function destroy(ClassPostsComment $classPostsComment)
    {
        try {
            $classPostsComment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return $this->responseFailed($e->getMessage(), 500);
        }
    }

    public function teacherPostCommentsNotify($classPostsComment, $update){

        $student = Student::where('id', auth()->user()->id)->with('classes')->first();
        
        $classesId = ClassStudent::where('student_id',auth()->user()->id)->pluck('class_id');
        $post = ClassPost::where("id", $classPostsComment->class_post_id)->first();
        $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
        $teachers = Teacher::whereIn('id',$class_teacher)->get();

        foreach ($teachers as $data) {
            if($post->teacher->id == $data->id){
                $message = "has " .($update == "store" ? "commented" : "updated the comment"). " on your post. Please check and Approve/Reject the Comment.";
            }else{
                $message = "has " .($update == "store" ? "commented" : "updated the comment"). " on ".$post->teacher->full_name."'s post. Please check and Approve/Reject the Comment.";
            }
            $details = [
                'greeting'     => 'Hi',
                'name'         => $student->first_name . ' ' . $student->last_name,
                'body'         => $message,
                'post_type'    => "teacher_post_comment",
                'commented_by' => $classPostsComment->commentor_id,
                'post_id' => $classPostsComment->class_post_id,
                'comment' => $classPostsComment->content,
                'teacher_name' => $data->full_name,
                'type' => "teacher"
            ];
            Mail::to($data->email)->send(new ApproveRejectCommentMail($details));
            $data->notify(new TagNotification($details));
        }
    }
}
