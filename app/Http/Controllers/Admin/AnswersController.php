<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnswersRequest;
use App\Models\Answer;
use Inertia\Inertia;
use DB;

class AnswersController extends Controller
{
    /**
     * Display all or the filtered/searched answers.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Answers/List');
    }

    /**
     * Display the form to add a new answer.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Answers/Create');
    }

    /**
     * Store the new answer data.
     *
     * @param  \App\Http\Requests\Admin\AnswersRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(AnswersRequest $request)
    {
        try {
            Answer::create($request->all());

            return $this->responseSuccess('Note added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the answer data of the given answer id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $answer = Answer::find($id);
        if (!$answer) {
            abort(404);
        }

        return Inertia::render('Admin/Answers/Show', [
            'answer' => $answer,
        ]);
    }

    /**
     * Display the edit answer form of the given answer id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $answer = Answer::find($id);
        if (!$answer) {
            abort(404);
        }

        return Inertia::render('Admin/Answers/Edit', [
            'answer' => $answer,
        ]);
    }

    /**
     * Update the answer data of the given answer id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\AnswersRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, AnswersRequest $request)
    {
        $answer = Answer::find($id);
        if (!$answer) {
            return $this->responseNotFound('Note with the given id not found.');
        }

        try {
            $answer->update($request->all());

            return $this->responseSuccess('Note updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the answer data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $answer = Answer::find($id);
        if (!$answer) {
            return $this->responseNotFound('Note with the given id not found.');
        }

        try {
            $answer->delete();

            return $this->responseSuccess('Note deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the answers.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $answers = Answer::select(['id', 'content',DB::raw("DATE_FORMAT(created_at, '%b %d, %Y') as post_date"),DB::raw("DATE_FORMAT(updated_at, '%b %d, %Y') as update_date")])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));


            return $this->responseSuccess([
            'rows'            => $answers->toArray()['data'],
            'total'           => $answers->total(),
            'allData'         => $answers,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ]);


    }
}
