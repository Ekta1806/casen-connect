<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\PostRequest;
use App\Models\Classes;
use App\Models\ClassPost;
use App\Models\ClassPostsCommentHistory;
use App\Models\CommentHistory;
use App\Models\FlaggedWord;
use App\Models\PostHistory;
use App\Models\SiteSetting;
use App\Models\Student\Comment;
use App\Models\Student\Like;
use App\Models\Student\Post;
use App\Models\Student\Student;
use App\Models\Teacher;
use App\Models\Word;
use App\Notifications\TagNotification;
use Auth;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Redirect;
use Spatie\MediaLibrary\Models\Media;
use App\Models\Student\ClassStudent;
use Mail;
use Storage;
use App\Mail\LikeMail;
use App\Mail\ApproveRejectPostMail;
use App\Mail\FlaggedWordMail;
use App\Notifications\FlaggedWordNotification;
use App\Models\Admin;
use App\Models\ClassTeacher;

class PostController extends Controller
{
    /**
     * Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Posts';

    /**
     * Store a newly created post in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PostRequest $request)
    {
        try {
            $student = Student::where('id', auth()->user()->id)->with('classes')->first();
            $post    = Post::create([
                'status'     => 'pending',
                'desc'       => $request->desc,
                'created_by' => Auth::guard('student')->user()->id,
            ]);

            if ($request->file('image')) {
                foreach ($request->file('image') as $photo) {
                    $post->addMedia($photo)->toMediaCollection('post');
                }
            }

            if ($post->status === "pending") {
                $classesId = Auth::user()->classes()->pluck('id');
                $post = Post::where("id", $post->id)->first();
                $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$class_teacher)->get();
                foreach ($teachers as $data) {
                    $details = [
                        'greeting'     => 'Hi',
                        'name'         => $student->first_name . ' ' . $student->last_name,
                        'body'         => "has created new post. Please check and Approve/Reject the Post.",
                        'post_type'    => "student_post_notification",
                        'commented_by' => "",
                        'post_id' => $post->id,
                        'teacher_name' => $data->first_name. ' ' . $data->last_name,
                        'type'=>"student",
                        'desc' => $post->desc,  
                    ];
                    Mail::to($data->email)->send(new ApproveRejectPostMail($details));
                    $data->notify(new TagNotification($details));
                }
            }

            return $this->responseSuccess(["status" => "success", "message" => "Successfully Uploded"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a newly created like in storage
     *
     * @param  $id , $check
     * @return \Illuminate\Http\Response
     */
    public function storeLike($id, $check)
    {
        try {
            $post = Post::find($id);
            if ($check == 'true') {
                $like = Like::updateOrCreate([
                    'post_id'  => $post->id,
                    'liked_by' => Auth::guard('student')->user()->id,
                ]);

                if(Auth::guard('student')->user()->id !== $post->user->id)
                {
                    $type="student";
                   Mail::to($post->user->email)->send(new LikeMail($post, Auth::guard('student')->user(), $type));
                }
                return $this->responseSuccess([$like]);

            } else {
                $like = Like::where('post_id', $post->id)
                    ->where('liked_by', Auth::guard('student')
                            ->user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

    }

    /**
     * Show the form for editing the specified post.
     *
     * @param  \App\Models\Student\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        return Inertia::render('Student/Posts/Edit', ['post' => $post, 'media' => $post->media]);
    }

    /**
     * Update the specified post in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Student\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(PostRequest $request, Post $post)
    {
        try {
            $data = array_merge($request->except('image'), ['status' => 'pending']);
            $post->update($data);

            if ($request->file('image')) {
                foreach ($request->file('image') as $photo) {
                    $post->addMedia($photo)->toMediaCollection('post');
                }
            }

            if ($post->status === "pending") {
                $classesId = Auth::user()->classes()->pluck('id');
                $post = Post::where("id", $post->id)->first();
                $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$class_teacher)->get();
                $student = Student::where('id', auth()->user()->id)->with('classes')->first();
                foreach ($teachers as $teacherData) {
                    $details = [
                        'greeting'     => 'Hi',
                        'name'         => $student->first_name . ' ' . $student->last_name,
                        'body'         => "has updated the post. Please check and Approve/Reject the Post.",
                        'post_type'    => "student_post_notification",
                        'commented_by' => "",
                        'post_id' => $post->id,
                        'teacher_name' => $teacherData->first_name. ' ' . $teacherData->last_name,
                        'type'=>"student",
                        'desc' => $post->desc,  
                    ];
                    Mail::to($teacherData->email)->send(new ApproveRejectPostMail($details));
                    $teacherData->notify(new TagNotification($details));
                }
            }
            return redirect()->back()->with(["status" => "success", "message" => "Successfully updated"]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified post from storage.
     *
     * @param  \App\Models\Student\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        try {
            $postType = 'student_post';
            $postType2 = 'student_post_notification';
            $user = auth()->user()->notifications()->whereJsonContains('data', ['id' => $post->id])->orWhereJsonContains('data',['post_type' => $postType])->orWhereJsonContains('data',['post_type' => $postType2])->delete();
            Comment::where('post_id', $post->id)->delete();
            Like::where('post_id', $post->id)->delete();
            $photos = $post->getMedia('post');
        
            foreach($photos as $photo){
               unlink($photo->getPath());
            }
            $post->media()->delete();
            $post->delete();
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }
    /**
     * Remove the specified media of post from storage.
     *
     * @param  $media
     * @return \Illuminate\Http\Response
     */
    public function destroyMedia($media)
    {
        try {
            $photo = DB::table('media')->where('id', $media)->first();
            Storage::disk('public')->delete($media.'/'.$photo->file_name);
            DB::table('media')->where('id', $media)->delete();
            return $this->responseSuccess(["status" => "success", "message" => "Successfully deleted"]);
            
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

                $student = Student::where('id', auth()->user()->id)->with('classes')->first();
                $classesId = Auth::user()->classes()->pluck('id');
                $class_teacher = ClassTeacher::whereIn('class_id',$classesId)->pluck('teacher_id');
                $teachers = Teacher::whereIn('id',$class_teacher)->get();
                foreach ($teachers as $data) {
                    $details = [
                        'greeting' => 'Hi',
                        'name'     => $student->full_name,
                        'body'     => " has used some Bad words",
                        'post_type' => "teacherpost_flaggedword",
                        'content' => $html,
                        'dear_name' => $data->full_name,
                    ];
                    Mail::to($data->email)->send(new FlaggedWordMail($details));
                    $data->notify(new FlaggedWordNotification($details));
                }
                
                return $this->responseSuccess(["status" => "error", "props" => $posts->rsp->expletive, 'html' => $html, 'message' => $msg]);
            }
        }
    }

    /**
     * Display a listing of the posts resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function postList()
    {
        $post = Post::where('created_by', Auth::guard('student')->user()->id)
        ->with(['comments.user', 'media', 'comments' => function ($q) {
            $q->where('status', 'approved')->orWhere('commented_by', Auth::user()->id);
        }, 'likes' => function ($q) {
            $q->where("liked_by", Auth::user()->id);
        }])->withCount(['likes', 'comments' => function ($query) {$query->where('status', 'approved')->orWhere('status', 'not_required');}])->orderBy('created_at', 'desc')->latest()->simplePaginate(3);
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

        $teacher = Student::where('id', Auth::guard('student')->user()->id)
            ->has('classes')->with('classes.teachers')->first();

        if (request()->has('type')) {
            return $this->responseSuccess(['posts' => $post]);
        }else{
            return Inertia::render('Student/Posts/Post',['posts' => $post, 'students' => $students, 'teacher' => $teacher]);
        }
    }

    public function show($post)
    {
        try {
            $post = Post::find($post);
            if(!$post){
                return Inertia::render('Student/Partials/Show', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $media = $post->media;
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

            $student   = Student::where('id', $post->created_by)->with('media')->first();
            $post_type = "student_post";
            return Inertia::render('Student/Partials/Show', ['post_exits' => true,'post_type' => $post_type, 'student' => $student, 'students' => $students, 'post' => $post, 'media' => $media, 'like' => $post->likes->where("liked_by", Auth::user()->id)->count(), 'comments' => $post->comments]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function classPostShow($classPost)
    {
        try {
            $post = ClassPost::find($classPost);
            if(!$post){
                return Inertia::render('Student/Partials/Classpostshow', 
                    ['post_exits' => false, 
                    'message' => 'Post has been Deleted',
                    ]);
            }
            $media = $classPost->media;
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

            $student = Teacher::where('id', $classPost->teacher_id)->with('media')->first();
            $post_type = "teacher_post";

            return Inertia::render('Student/Partials/Classpostshow', ['post_exits' => true,'post_type' => $post_type, 'student' => $student, 'students' => $students, 'post' => $classPost, 'media' => $media, 'like' => $classPost->likes->where("liked_id", Auth::user()->id)->count(), 'comments' => $classPost->comments]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
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
    public function tagSomeone(Request $request){
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
        $data['students']  = Student::where('id', '!=', Auth::guard('student')->user()->id)->whereIn('id', $studentsPosts)->get()->toArray();
        $data['teacher'] = Teacher::whereIn('id',$class_teacher)->get()->toArray();
        $data['admin'] = Admin::get()->toArray();
        $tagdata = array_merge($data['everyone'],(!empty($data['admin']) ? $data['adminLabel'] : []), $data['admin'], (!empty($data['teacher']) ? $data['teacherLabel'] : []), $data['teacher'], (!empty($data['students']) ? $data['studentLabel'] : []), $data['students']);
        return $this->responseSuccess([
            'tagdata' => $tagdata,
        ]);
    }

}
