<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LevelsRequest;
use App\Models\Level;
use Inertia\Inertia;

class LevelsController extends Controller
{
    /**
     * Display all or the filtered/searched levels.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Levels/List');
    }

    /**
     * Display the form to add a new level.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Levels/Create');
    }

    /**
     * Store the new level data.
     *
     * @param  \App\Http\Requests\Admin\LevelsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(LevelsRequest $request)
    {
        try {
            Level::create($request->all());

            return $this->responseSuccess('Level added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the level data of the given level id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $level = Level::select(['id', 'name', 'short_description'])->find($id);
        if (!$level) {
            abort(404);
        }

        return Inertia::render('Admin/Levels/Show', [
            'level'    => $level,
            'classes'  => $level->Classes,
            'teachers' => $level->teachers,
        ]);
    }

    /**
     * Display the edit level form of the given level id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $level = Level::select(['id', 'name', 'short_description'])->find($id);
        if (!$level) {
            abort(404);
        }

        return Inertia::render('Admin/Levels/Edit', [
            'level' => $level,
        ]);
    }

    /**
     * Update the level data of the given level id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\LevelsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, LevelsRequest $request)
    {
        $level = Level::find($id);
        if (!$level) {
            return $this->responseNotFound('Level with the given id not found.');
        }

        try {
            $level->update($request->all());

            return $this->responseSuccess('Level updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the level data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $level = Level::find($id);
        if (!$level) {
            return $this->responseNotFound('Level not found with the given id.');
        }
        try {
            $level->delete();

            return $this->responseSuccess('Level deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the levels.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $levels = Level::select(['id', 'name', 'short_description'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $levels->toArray()['data'],
            'total'           => $levels->total(),
            'allData'         => $levels,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
