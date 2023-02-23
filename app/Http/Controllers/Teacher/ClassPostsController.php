<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ClassPostRequest;
use App\Http\Requests\Teacher\CommentRequest;
use App\Http\Requests\Teacher\EditCommentRequest;
use App\Models\Classes;
use App\Models\ClassPost;
use App\Models\ClassPostsComment;
use App\Models\ClassPostsCommentHistory;
use App\Models\ClassPostsLike;
use Mail;
use App\Mail\ClasspostCommentMail;
use App\Mail\ClasspostTaggedMail;
use App\Mail\TaggedMail;
use App\Mail\LikeMail;
use App\Models\Student\Like;
use App\Models\Student\Post;
use App\Models\Student\Student;
use App\Models\Teacher;
use App\Notifications\TagNotification;
use Auth;
use Illuminate\Http\Request;
use App\Models\Student\ClassStudent;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\ClassTeacher;
use App\Models\SiteSetting;
use Carbon\Carbon;

class ClassPostsController extends Controller
{
    /**
     * Display the index page of class posts.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // $classes = Classes::where('teacher_id',Auth::user()->id)->select('name as label', 'id as value')
        //     ->orderBy('id', 'DESC')->get()->toArray();
        
        $classesTeacher = ClassTeacher::where('teacher_id',Auth::user()->id)->pluck('class_id');
        $classesData = Classes::whereIn('id',$classesTeacher )->select('name as label', 'id as value')->get()->toArray();
        $newArray[] = ['label'=>'My Posts','value'=>0];
        $classes = array_merge($newArray, $classesData);

        $classesId = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $teachers = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
        $qPosts = ClassPost::whereIn('classes_id',$classesId)
            ->withCount('comments', 'likes')
            ->with(['class:id,name', 'media','teacher.media', 'likes' => function ($query) {
                $query->where("teacher_id", Auth::user()->id);
            }])->orderBy('id', 'DESC')->get();
        $studentIds =  ClassStudent::whereIn('class_id',$classesId)->pluck('student_id');
        
        $posts = [];
        foreach($qPosts as $r){
            $checkTeacherStatus = ClassTeacher::where('teacher_id',$r->teacher_id)->where('class_id', $r->classes_id)->get()->toArray();
            if(count($checkTeacherStatus) > 0){
                array_push($posts,$r);
            }
        }

        return Inertia::render('Teacher/ClassPosts/List', [
            'rows'     => $posts,
            'students' =>  Student::whereIn('id', $studentIds)->get(),
            'classes'  => $classes,
        ]);
    }

    public function taggedData($id){
        $classes_id = ClassPost::where('id',$id)->select('classes_id')->first();
        $student_ids = ClassStudent::where('class_id',$classes_id->classes_id)->pluck('student_id');
        $teacher_ids = ClassTeacher::where('class_id',$classes_id->classes_id)->pluck('teacher_id');
        $data['students'] = Student::whereIn('id',$student_ids)->get()->toArray();
        $data['teacher'] = Teacher::whereIn('id',$teacher_ids)->where('id','!=',Auth::user()->id)->get()->toArray();
        $data['admin'] = Admin::get()->toArray();
        $data['everyone'] = 
        ["0" =>[
            'first_name' => 'everyone',
            'last_name' => '',
            'id' => '1']];
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
        return $this->responseSuccess($students);
    }


    /**
     * Display the form to add a new class post.
     *
     * @return  \Inertia\Response
     */
    public function create($classId = [])
    {

        $classesTeacher = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $classes = Classes::whereIn('id',$classesTeacher)->select('name as label', 'id as value')->orderBy('id', 'DESC')->get();
        return Inertia::render('Teacher/ClassPosts/Create', [
            'classes' => $classes,
            'class'   => Classes::find($classId),
        ]);
    }

    /**
     * Store the new class post data.
     *
     * @param  \App\Http\Requests\Teacher\ClassPostRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ClassPostRequest $request)
    {
        try {
            $request['teacher_id'] = Auth::user()->id;
            $post = ClassPost::create($request->all());

            if ($request->file('images')) {
                foreach ($request->file('images') as $photo) {
                    $post->addMedia($photo)->toMediaCollection('class_posts');
                }
            }

            if (preg_match_all('!@(.+)(?:\s|$)!U', $post->content, $matches)) {
                $usernames = $matches[1];
                foreach ($usernames as $username) {
                    $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    if($student){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "teacher_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $student->first_name . " " . $student->last_name,
                       ];
                       Mail::to($student->email)->send(new ClasspostTaggedMail($details));
                       $student->notify(new TagNotification($details));
                    }
                    if($teacher){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "teacher_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $teacher->first_name . " " . $teacher->last_name
                       ];
                       Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                       $teacher->notify(new TagNotification($details));
                    }
                    if($admin){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "teacher_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $admin->first_name . " " . $admin->last_name
                       ];
                       Mail::to($admin->email)->send(new ClasspostTaggedMail($details));
                       $admin->notify(new TagNotification($details));
                    }
                }
            } 
            $findString = preg_match("~@everyone~",$post->content);
            if($findString){

                $student_ids = ClassStudent::where('class_id',$request['classes_id'])->pluck('student_id');
                $teacher_ids = ClassTeacher::where('class_id',$request['classes_id'])->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$teacher_ids)->where('id','!=',auth()->user()->id)->get();
                $students = Student::whereIn('id',$student_ids)->get();
                $admin = Admin::get();
                $this->teacherAllTagNotifyPost($students, $post, 'teacher_post');
                $this->teacherAllTagNotifyPost($teachers, $post, 'teacher_post');
                $this->teacherAllTagNotifyPost($admin, $post, 'teacher_post');
            }
            
            return $this->responseSuccess('Class post added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());
            return $this->responseFailed();
        }
    }

    /**
     * Display the edit form to update the class post of the given id.
     *
     * @param  integer  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $post = ClassPost::with(['class:id,name', 'media'])->find($id);
        if (!$post) {
            abort(404);
        }
        return Inertia::render('Teacher/ClassPosts/Edit', [
            'post'    => $post,
            'classes' => Classes::select('name as label', 'id as value')->orderBy('id', 'DESC')->get(),
        ]);
    }

    /**
     * Update the class post of the given class post id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Teacher\ClassPostRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, ClassPostRequest $request)
    {
        $post = ClassPost::with(['class:id,name', 'media'])->find($id);
        if (!$post) {
            return $this->responseNotFound("Class post with the given id not found.");
        }

        try {
            $post->update($request->all());
            if ($request->file('images')) {
                foreach ($request->file('images') as $photo) {
                    $post->addMedia($photo)->toMediaCollection('class_posts');
                }
            }
            if (preg_match_all('!@(.+)(?:\s|$)!U', $post->content, $matches)) {
                $usernames = $matches[1];
                foreach ($usernames as $username) {
                    $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                    if($student){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "teacher_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $student->first_name . " " . $student->last_name,
                       ];
                       Mail::to($student->email)->send(new ClasspostTaggedMail($details));
                       $student->notify(new TagNotification($details));
                    }
                    if($teacher){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "student_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $teacher->first_name . " " . $teacher->last_name
                       ];
                       Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                       $teacher->notify(new TagNotification($details));
                    }
                    if($admin){
                        $details = [
                            'greeting' => 'Hi',
                            'name'     => $post->teacher->fullname,
                            'body'     => " has mentioned you in post section",
                            'post_type' => "teacher_post",
                            'commented_by' => $post->teacher->id,
                            'post_id' => $post->id,
                            'comment' => $post->content,
                            'dear_name' => $admin->first_name . " " . $admin->last_name
                       ];
                       Mail::to($admin->email)->send(new ClasspostTaggedMail($details));
                       $admin->notify(new TagNotification($details));
                    }
                }
            } 
            $findString = preg_match("~@everyone~",$post->content);
            if($findString){
                $student_ids = ClassStudent::where('class_id',$request['classes_id'])->pluck('student_id');
                $teacher_ids = ClassTeacher::where('class_id',$request['classes_id'])->pluck('teacher_id');
                $teacher = Teacher::whereIn('id',$teacher_ids)->get();
                $students = Student::whereIn('id',$student_ids)->get();
                $admin = Admin::get();
                $students  = Student::has('classes')->get();
                $teachers = Teacher::has('class')->get();
                $this->teacherAllTagNotifyPost($students, $post, 'student_post');
                $this->teacherAllTagNotifyPost($teachers, $post, 'teacher_post');
                $this->teacherAllTagNotifyPost($admin, $post, 'teacher_post');
            }

            return $this->responseSuccess('Class post updated successfully.');
        } catch (\Exception $e) {
            return $this->responseFailed();
        }
    }

    /**
     * Delete a single media of given media id of the given post id.
     *
     * @param  integer  $postId
     * @param  integer  $mediaId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteMedia($postId, $mediaId)
    {
        $post = ClassPost::with(['media'])->find($postId);
        $photo = $post->getMedia('class_posts')->where('id', $mediaId)->first();

        if (!$post) {
            return $this->responseNotFound("Class post with the given id not found.");
        }

        try {
            $photo = $post->getMedia('class_posts')->where('id', $mediaId)->first();
            if (!$photo) {
                return $this->responseNotFound("Media not with the given id not found.");
            }
            unlink($photo->getPath());
            $photo->delete();

            return $this->responseSuccess('Class post media deleted successfully.');
        } catch (\Exception $e) {
            return $this->responseFailed();
        }
    }

    /**
     * Delete the class post of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $post = ClassPost::find($id);
        $photos = $post->getMedia('class_posts');
        
        foreach($photos as $photo){
           unlink($photo->getPath());
        }
        $post->media()->delete();

        if (!$post) {
            return $this->responseNotFound('Class post with the given id not found.');
        }
        try {
            
            $postType = 'teacher_post';
            $postType2 = 'teacher_post_comment';
            $user = auth()->user()->notifications()->whereJsonContains('data', ['id' => $post->id])->orWhereJsonContains('data',['post_type' => $postType])->orWhereJsonContains('data',['post_type' => $postType2])->delete();
            $post->comments()->delete();
            $post->media()->delete();
            $post->delete();

            return $this->responseSuccess('Class post deleted successfully.');
        } catch (\Exception $e) {
            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the class posts that are added by authenticated teacher.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function fetchPendingComments($postId)
    {
        $post = ClassPost::with(['comments'=>function($q){
            $q->orderByRaw("
            case
            when status = 'pending' then 0
            when status = 'not_required' then 1
            when status = 'approved' then 2
            when status ='rejected' then 3
            else 1 end ASC")->orderBy('id', 'DESC');
        }])->find($postId);
        if (!$post) {
            return response()->json([
                'status'  => 'failed',
                'message' => 'No post found with the given id.',
            ]);
        }
        $allComments = [];
        foreach ($post->comments as $comment) {
            if ($comment->commented_by === "student") {
                $student = Student::find($comment->commentor_id);
            } 
            if ($comment->commented_by === "teacher") {
                $student = Teacher::find($comment->commentor_id);
            }
            if ($comment->commented_by === "admin") {
                $student = Admin::find($comment->commentor_id);
            }

            $allComments[] = [
                'id'            => $student->id,
                'name'          => $student->full_name,
                'avatar'        => $student->getProfilePicture(),
                'comment'       => $comment->content,
                'commentId'     => $comment->id,
                'status'        => $comment->status,
                'notes'         => $comment->notes,
                'created_at'    => $comment->created_at,
                'commented_by1' => $comment->commented_by,
            ];
        };

        return $this->responseSuccess([
            'comments' => $allComments,
        ]);
    }

    public function approveRejectPendingComment($commentId, $status)
    {
        $comment = ClassPostsComment::find($commentId);
        $teacher = Teacher::find(auth()->user()->id);
        if ($status == "rejected" || $status == "approved") {
            $data = array_merge([
                'class_post_id'         => $comment->class_post_id,
                'class_post_comment_id' => $commentId,
                'comment'               => $comment->content,
                'notes'                 => request('notes') ?? null,
                'status'                => $status,
            ]);

            $classPostsCommentHistory = ClassPostsCommentHistory::create($data);
        }
        if (!$comment) {
            return $this->responseNotFound();
        }
        try {

            $post = ClassPost::where('id', $comment->class_post_id)->first();
            $now = Carbon::now();
            $day     = SiteSetting::where('name', 'view_posts_on')->first();
            $classStudent = ClassStudent::where('student_id',$comment->creator->id)->first();
            $classTeacherId = ClassTeacher::where('class_id',$classStudent->class_id)->pluck('teacher_id');
            $allTeachers = Teacher::whereIn('id',$classTeacherId)->get();
            $class = Classes::where('id',$classStudent->class_id)->first();
            if($status == "approved")
            {   
                $findString = preg_match("~@everyone~",$comment->content);
                if($findString){
                    if (Carbon::now()->format('l') == $day->value) {
                        $id = Classes::where('track_id',$class->track_id)->pluck('id');
                    } else {
                        $id = Classes::where('id',$classStudent->class_id)->pluck('id');
                    }
                    $studentsPosts = ClassStudent::whereIn('class_id',$id)->pluck('student_id');
                    $class_teacher = ClassTeacher::whereIn('class_id',$id)->pluck('teacher_id');
                    $students  = Student::where('id', '!=', $comment->creator->id)->whereIn('id', $studentsPosts)->get();
                    $this->allClassPostTaggedNotify($students,$comment);
                    $teachers  = Teacher::whereIn('id',$class_teacher)->get();
                    $this->allClassPostTaggedNotify($teachers,$comment);
                    $admins  = Admin::get();
                    $this->allClassPostTaggedNotify($admins,$comment);
                }

                if (preg_match_all('!@(.+)(?:\s|$)!U', $comment->content, $matches)) {
                    $usernames = $matches[1];
                   
                    foreach ($usernames as $username) {
                        $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $teacher = Teacher::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                        if($student){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->creator->fullname,
                                'body'     => " has mentioned you in comment section",
                                'post_type' => "student_post",
                                'commented_by' => $comment->creator->id,
                                'post_id' => $comment->class_post_id,
                                'comment' => $comment->content,
                                'dear_name' => $student->first_name . " " . $student->last_name,
                           ];
                           Mail::to($student->email)->send(new ClasspostTaggedMail($details));
                           $student->notify(new TagNotification($details));
                        }
                        if($teacher){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->creator->fullname,
                                'body'     => " has mentioned you in comment section",
                                'post_type' => "teacher_post",
                                'commented_by' => $comment->creator->id,
                                'post_id' => $comment->class_post_id,
                                'comment' => $comment->content,
                                'dear_name' => $teacher->first_name . " " . $teacher->last_name
                           ];
                           Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                           $teacher->notify(new TagNotification($details));
                        }
                        if($admin){
                            $details = [
                                'greeting' => 'Hi',
                                'name'     => $comment->creator->fullname,
                                'body'     => " has mentioned you in comment section",
                                'post_type' => "teacher_post",
                                'commented_by' => $comment->creator->id,
                                'post_id' => $comment->class_post_id,
                                'comment' => $comment->content,
                                'dear_name' => $admin->first_name . " " . $admin->last_name
                           ];
                           Mail::to($admin->email)->send(new ClasspostTaggedMail($details));
                           $admin->notify(new TagNotification($details));
                        }
                    }
                } 

                foreach ($allTeachers as $teacherData) {
                    $authTeacher = Teacher::find(auth()->user()->id);
                    if($teacherData->id == $authTeacher->id){
                        $details = [
                            'name'         => $authTeacher->first_name. ' ' .$authTeacher->last_name,
                            'body'         => " has approved your comment",
                            'post_type'    => "teacher_post",
                            'post_id'      => $comment->class_post_id,
                            'commented_by' => $comment->creator->id,
                            'comment' => $comment->content,
                            'dear_name'    => $comment->creator->fullname,
                        ];
                        Mail::to($comment->creator->email)->send(new ClasspostTaggedMail($details));
                        $comment->creator->notify(new TagNotification($details));
                    }
                    if($teacherData->id != $authTeacher->id){    
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has approved ".$comment->creator->full_name."'s comment",
                            'post_type'    => "teacher_post",
                            'post_id'      => $comment->class_post_id,
                            'commented_by' => $teacherData->id,
                            'comment'      => $comment->content,
                            'dear_name'    => $teacherData->fullname,
                        ];
                        Mail::to($teacherData->email)->send(new ClasspostTaggedMail($details));
                        $teacherData->notify(new TagNotification($details));
                    }
                    
                }
            } else {
                foreach ($allTeachers as $teacher) {
                    $authTeacher = Teacher::find(auth()->user()->id);
                    if($teacher->id == $authTeacher->id){
                        $details = [
                            'name'         => $authTeacher->first_name. ' ' .$authTeacher->last_name,
                            'body'         => " has rejected your comment",
                            'post_type'    => "teacher_post",
                            'post_id'      => $comment->class_post_id,
                            'commented_by' => $comment->creator->id,
                            'comment' => $comment->content,
                            'dear_name' => $comment->creator->fullname,
                        ];
                        Mail::to($comment->creator->email)->send(new ClasspostTaggedMail($details));
                        $comment->creator->notify(new TagNotification($details));
                    }else{
                        $details = [
                            'name'         => $authTeacher->full_name,
                            'body'         => " has rejected ".$comment->creator->full_name."'s comment",
                            'post_type'    => "teacher_post",
                            'post_id'      => $comment->class_post_id,
                            'commented_by' => $teacher->id,
                            'comment'      => $comment->content,
                            'dear_name'    => $teacher->fullname,
                        ];
                        
                        Mail::to($teacher->email)->send(new ClasspostTaggedMail($details));
                        $teacher->notify(new TagNotification($details));
                    }
                    
                }
            }

            $data = array_merge([
                'status_updated_on'            => now(),
                'status_updated_by_teacher_id' => auth()->guard('teacher')->id(),
                'notes'                        => request('notes') ?? null,
                'status'                       => $status,
            ]);
            $classPostsComment = $comment->update($data);

            return $this->responseSuccess("Comment {$status} successfully.");
        } catch (\Exception $e) {
            dd($e);
            info($e->getMessage());
            info($e->getTraceAsString());
            return $this->responseFailed();
        }
    }

    public function storeComment(CommentRequest $request)
    {
        try {
            $data = array_merge([
                'class_post_id' => $request->post_id,
                'commented_by'  => 'teacher',
                'commentor_id'  => auth()->guard('teacher')->user()->id,
                'content'       => str_replace(array( '[', ']' ), '', $request->comment),
                'status'        => 'not_required',
            ]);
            $classPostsComment = ClassPostsComment::create($data);
            
            if ($classPostsComment->status === "not_required") {
                $this->teacherPostCommentsNotify($classPostsComment);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroyComment(ClassPostsComment $classPostsComment)
    {
        try {
            $classPostsComment->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function updateComment(EditCommentRequest $request, ClassPostsComment $classPostsComment)
    {
        try {
            $classPostsComment->update(['content' => str_replace(array( '[', ']' ), '', $request->comment_1), 'status' => 'not_required']);
            if ($classPostsComment->status === "not_required") {
                $this->teacherPostCommentsNotify($classPostsComment);
            }
            return $this->responseSuccess(["status" => "success", "message" => "Successfully Updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function storeLikes($id, $check)
    {
        try {
            $post = ClassPost::find($id);
            if ($check == 'true') {
                $like = ClassPostsLike::updateOrCreate([
                    'class_post_id' => $post->id,
                    'liked_by'      => "teacher",
                    'teacher_id'    => Auth::user()->id,
                ]);

                return $this->responseSuccess([$like]);

            } else {
                $like = ClassPostsLike::where('class_post_id', $post->id)
                    ->where('teacher_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function storeTeacherLikes($id, $check)
    {
        try {
            $post = Post::find($id);
            $student = Student::where('id', $post->created_by)->first();
            if ($check == 'true') {
                $like = Like::updateOrCreate([
                    'post_id'    => $post->id,
                    'liked_by'   => 0,
                    'teacher_id' => Auth::user()->id,
                ]);
                $type = "student";
                Mail::to($student->email)->send(new LikeMail($post, Auth::user(), $type));
                return $this->responseSuccess([$like]);

            } else {
                $like = Like::where('post_id', $post->id)
                    ->where('teacher_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function pinPost($id, $isPinPost, $classId, Request $request)
    {
        try {
            $post = ClassPost::find($id);
            if (!$post) {
                return $this->responseNotFound("Class post with the given id not found.");
            }
            if($isPinPost == true){
                $pinPostData['is_pinpost'] = 0;
                $postDetails = Classpost::where('teacher_id',auth()->user()->id)->where('classes_id',$classId)->update($pinPostData);
            }

            $request = ($isPinPost == true) ? 1 : 0;  
            $post->update(['is_pinpost' => $request ]);

            return $this->responseSuccess('Class post updated successfully.');
        } catch (\Exception $e) {
            return $this->responseFailed();
        }
    }

    public function tagSomeone($id){
        $student_ids = ClassStudent::where('class_id',$id)->pluck('student_id');
        $teacher_ids = ClassTeacher::where('class_id',$id)->pluck('teacher_id');
        $data['teacher'] = Teacher::where('id','!=',auth()->user()->id)->whereIn('id',$teacher_ids)->get()->toArray();
        $data['students'] = Student::whereIn('id',$student_ids)->get()->toArray();
        $data['admin'] = Admin::get()->toArray();
        $data['everyone'] = 
            ["0" =>[
                'first_name' => 'everyone',
                'last_name' => '',
                'id' => '1']];
        $data['adminLabel'] = [
            "0" => [
                'first_name' => 'Admins',
                'last_name' => '',
                'id' => '0',
            ]];
        $data['teacherLabel'] = [
            "0" => [
                'first_name' => 'Teachers',
                'last_name' => '',
                'id' => '0',
            ]];
        $data['studentLabel'] = [
            "0" => [
                'first_name' => 'Students',
                'last_name' => '',
                'id' => '0',
            ]];
        $students = array_merge($data['everyone'],(!empty($data['admin']) ? $data['adminLabel'] : []), $data['admin'], (!empty($data['teacher']) ? $data['teacherLabel'] : []), $data['teacher'], (!empty($data['students']) ? $data['studentLabel'] : []), $data['students']);
        return $this->responseSuccess([
            'students'         => $students,
        ], 200);
    }

    public function teacherAllTagNotifyPost($data , $post, $postType){
        foreach($data as $allTag){
            if($allTag){
                $details = [
                    'greeting' => 'Hi',
                    'name'     => auth()->user()->full_name,
                    'body'     => "has mentioned you in post section",
                    'commented_by' => $post->admin_id,
                    'comment' => $post->content,
                    'dear_name' => $allTag->full_name,
                    'post_id' => $post->id,
                    'post_type' => $postType
                ];
    
                Mail::to($allTag->email)->send(new ClasspostTaggedMail($details));
                $allTag->notify(new TagNotification($details));
            }
        }
    }
    public function allClassPostTaggedNotify($data, $comment){
        foreach($data as $allTag){
            $details = [
                'greeting' => 'Hi',
                'name'     => $comment->creator->fullname,
                'body'     => " has mentioned you in comment section",
                'post_type' => "teacher_post",
                'commented_by' => $comment->creator->id,
                'post_id' => $comment->class_post_id,
                'comment' => $comment->content,
                'dear_name' => $allTag->first_name . " " . $allTag->last_name,
           ];
           Mail::to($allTag->email)->send(new ClasspostTaggedMail($details));
           $allTag->notify(new TagNotification($details));
        }
    }

    public function allTeacherCommentsTaggedNotify($data, $comment){
        foreach($data as $allTag){
            $details = [
                'greeting' => 'Hi',
                'name'     => Auth::user()->full_name,
                'body'     => "has mentioned you in comment section",
                'post_type' => "teacher_post",
                'commented_by' => $comment->commentor_id,
                'post_id' => $comment->class_post_id,
                'comment' => $comment->content,
                'dear_name' => $allTag->full_name
                ];
    
            Mail::to($allTag->email)->send(new ClasspostTaggedMail($details));
            $allTag->notify(new TagNotification($details));
        }
    }

    public function teacherPostCommentsNotify($classPostsComment){

        $findString = preg_match("~@everyone~",$classPostsComment->content);
        if($findString){
            $classes_id = ClassPost::where('id',$classPostsComment->class_post_id)->select('classes_id')->first();
            $student_ids = ClassStudent::where('class_id',$classes_id->classes_id)->pluck('student_id');
            $teacher_ids = ClassTeacher::where('class_id',$classes_id->classes_id)->pluck('teacher_id');
            $students = Student::whereIn('id',$student_ids)->get();
            $this->allTeacherCommentsTaggedNotify($students,$classPostsComment);
            $teachers = Teacher::whereIn('id',$teacher_ids)->where('id','!=',Auth::user()->id)->get();
            $this->allTeacherCommentsTaggedNotify($teachers,$classPostsComment);
            $admins = Admin::get();
            $this->allTeacherCommentsTaggedNotify($admins,$classPostsComment);
        }

        if (preg_match_all('!@(.+)(?:\s|$)!U', $classPostsComment->content, $matches)) {
            $usernames = $matches[1];

            foreach ($usernames as $username) {
                $student = Student::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                $admin = Admin::whereRaw("concat(first_name, last_name) like '%" . $username . "%' ")->first();
                
                if($student){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => Auth::user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'post_type' => "teacher_post",
                        'commented_by' => $classPostsComment->commentor_id,
                        'post_id' => $classPostsComment->class_post_id,
                        'comment' => $classPostsComment->content,
                        'dear_name' => $student->full_name
                    ];

                    Mail::to($student->email)->send(new ClasspostTaggedMail($details));
                    $student->notify(new TagNotification($details));
                }
                if($admin){
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => Auth::user()->full_name,
                        'body'     => "has mentioned you in comment section",
                        'post_type' => "teacher_post",
                        'commented_by' => $classPostsComment->commentor_id,
                        'post_id' => $classPostsComment->class_post_id,
                        'comment' => $classPostsComment->content,
                        'dear_name' => $admin->full_name
                    ];

                    Mail::to($admin->email)->send(new ClasspostTaggedMail($details));
                    $admin->notify(new TagNotification($details));
                }
                    
            }
        }
    }
}
