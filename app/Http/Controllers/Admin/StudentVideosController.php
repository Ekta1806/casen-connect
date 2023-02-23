<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student\Video;
use Inertia\Inertia;

class StudentVideosController extends Controller
{
    /**
     * Display all or searched/filtered students' videos.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/StudentVideos/List');
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
        $video = Video::with(['student', 'media', 'comments.teacher'])->find($videoId);
        if (!$video) {
            abort(404);
        }

        return Inertia::render('Admin/StudentVideos/Show', [
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

            return $this->responseSuccess('Student video deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the videos uploaded by students.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch()
    {
        $wordss = Video::has('student')->has('media')
            ->select(['id', 'title', 'student_id'])
            ->with(['student:id,first_name,last_name,email', 'media'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $wordss->toArray()['data'],
            'total'           => $wordss->total(),
            'allData'         => $wordss,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
