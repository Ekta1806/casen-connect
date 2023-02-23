<?php

namespace App\Http\Controllers;

use App\Models\ClassPost;
use App\Models\ClassPostsLike;
use App\Models\Student\Student;
use App\Models\Teacher;
use Mail;
use App\Mail\LikeMail;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Admin;


class ClassPostsLikeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($id, $check)
    {
        try {
            $post = ClassPost::find($id);
            if ($check == 'true') {
                $like = ClassPostsLike::updateOrCreate([
                    'class_post_id' => $post->id,
                    'liked_by'      => "student",
                    'liked_id'      => Auth::guard('student')->user()->id,
                ]);
                $type = "teacher";
                Mail::to($post->teacher->email)->send(new LikeMail($post, Auth::guard('student')->user(), $type));
                return $this->responseSuccess($like);

            } else {
                $like = ClassPostsLike::where('class_post_id', $post->id)
                    ->where('liked_id', Auth::guard('student')->user()->id)->delete();

                return $this->responseSuccess($like);
            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ClassPostsLike  $classPostsLike
     * @return \Illuminate\Http\Response
     */
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
                'likes' => array_merge($allTeacherLikes, $allLikes, $allAdminLikes),
                'owner' => ClassPostsLike::where('liked_by', 'student')->where('liked_id',Auth::guard('student')->user()->id)->where('class_post_id',$classPostsLike)->first(),
                ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    public function storeLikes($id, $check)
    {
        try {
            $post = ClassPost::find($id);
            if ($check == 'true') {
                $like = ClassPostsLike::create([
                    'class_post_id' => $post->id,
                    'liked_by'      => "student",
                    'liked_id'      => Auth::guard('student')->user()->id,
                ]);

            } else {
                $like = ClassPostsLike::where('class_post_id', $post->id)
                    ->where('liked_id', Auth::guard('student')->user()->id)->delete();
            }
            return $this->responseSuccess($like, '');

        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
