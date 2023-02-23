<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\VideoRequest;
use App\Models\Student\Student;
use App\Models\Student\Video;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Redirect;

class VideoController extends Controller
{

    /* Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Videos';

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $video         = Video::where('student_id', Auth::guard('student')->user()->id)->with(['media', 'comments.teacher'])->get();
        $notifications = auth()->guard('student')->user()->unreadNotifications;
        return Inertia::render('Student/Videos/Video', ['video' => $video, 'notifications' => $notifications]);
    }

    /**
     * Store a newly created video in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(VideoRequest $request)
    {
        $video = Video::create([
            'description' => $request->description,
            'student_id'  => Auth::guard('student')->user()->id,
            'title'       => $request->title,
        ]);
        if ($request->file('video')) {
            $video->addMediaFromRequest('video')->toMediaCollection('videos', 'userpost_public');
        }
        return response()->json(["status" => "success", "message" => "Successfully Uploded"]);
    }

    /**
     * Show the form for editing the specified video.
     *
     * @param  \App\Models\Student\Video  $video
     * @return \Illuminate\Http\Response
     */
    public function edit(Video $video)
    {
        $media = $video->media;
        return Inertia::render('Student/Videos/Edit', ['video' => $video, 'media' => $media]);
    }

    /**
     * Update the specified video in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Student\Video  $video
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Video $video)
    {
        try {
            $video->update($request->except('video'));
            if ($request->file('video')) {
                $video->media()->delete();
                $video->addMediaFromRequest('video')->toMediaCollection('videos', 'userpost_public');
            }
            return response()->json(["status" => "success", "message" => "Successfully updated"]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified video from storage.
     *
     * @param  \App\Models\Student\Video  $video
     * @return \Illuminate\Http\Response
     */
    public function destroy(Video $video)
    {
        try {
            $video->delete();
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }

        return Redirect::back();
    }
}
