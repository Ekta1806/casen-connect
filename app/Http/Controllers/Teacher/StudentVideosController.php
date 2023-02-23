<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classes;
use App\Models\Student\Student;
use App\Models\Student\Video;
use Inertia\Inertia;

class StudentVideosController extends Controller
{
    /**
     * Display all or searched/filtered videos of the students
     * that are taking the authenticated teacher's class.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/StudentVideos/List');
    }

    /**
     * Display the student data of the given student id.
     *
     * @param  integer  $classId
     * @param  integer  $studentId
     * @return void|\Inertia\Response
     */
    public function show($videoId)
    {
        $video = Video::with(['student', 'media', 'comments'])->find($videoId);
        if (!$video) {
            abort(404);
        }

        return Inertia::render('Teacher/StudentVideos/Show', [
            'video' => $video,
        ]);
    }

    /**
     * Delete the video uploaded of the given video id.
     *
     * @param  integer  $videoId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($videoId)
    {
        $video = Video::find($videoId);
        if (!$video) {
            return $this->responseNotFound('Video with the given id not found.');
        }

        try {
            $video->delete();

            return $this->responseSuccess('Video deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the videos of the students who are currently taking the
     * authenticated teacher's classes.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $studentIds = Student::has('classes')->pluck('id');

        $videos = Video::has('student')->has('media')
            ->with(['student:id,first_name,last_name,email', 'media'])
            ->whereIn('student_id', $studentIds)
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $videos->toArray()['data'],
            'total'           => $videos->total(),
            'allData'         => $videos,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
