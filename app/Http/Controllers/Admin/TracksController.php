<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TracksRequest;
use App\Models\Track;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TracksController extends Controller
{
    /**
     * Display all or the filtered/searched tracks.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Tracks/List');
    }

    /**
     * Display the form to add a new track.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Tracks/Create');
    }

    /**
     * Store the new track data.
     *
     * @param  \App\Http\Requests\Admin\TracksRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(TracksRequest $request)
    {
        try {
            Track::create($request->all());

            return $this->responseSuccess('Track added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the track data of the given track id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $track = Track::select(['id', 'name', 'short_description'])->with([
            'Classes:id,name,description,track_id',
            'teachers:id,first_name,last_name,email,track_id',
        ])->find($id);
        if (!$track) {
            abort(404);
        }

        return Inertia::render('Admin/Tracks/Show', [
            'track'    => $track,
            'classes'  => $track->Classes,
            'teachers' => $track->teachers,
        ]);
    }

    /**
     * Display the edit track form of the given track id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $track = Track::select(['id', 'name', 'short_description'])->find($id);
        if (!$track) {
            abort(404);
        }

        return Inertia::render('Admin/Tracks/Edit', [
            'track' => $track,
        ]);
    }

    /**
     * Update the track data of the given track id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\TracksRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, TracksRequest $request)
    {
        $track = Track::find($id);
        if (!$track) {
            return $this->responseNotFound('Track with the given id not found.');
        }

        try {
            $track->update($request->all());

            return $this->responseSuccess('Track updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the track data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $track = Track::find($id);
        if (!$track) {
            return $this->responseNotFound('Track not found with the given id.');
        }

        try {
            $track->delete();

            return $this->responseSuccess('Track deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the tracks.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $tracks = Track::select(['id', 'name', 'short_description'])
            ->withCount(['classes' => function ($query) {
                $query->select(\DB::raw('count(id)'));
            }])->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $tracks->toArray()['data'],
            'total'           => $tracks->total(),
            'allData'         => $tracks,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
