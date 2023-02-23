<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IntakeQuestionsRequest;
use App\Models\IntakeQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IntakeQuestionsController extends Controller
{
    /**
     * Display all or the filtered/searched questions.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/IntakeQuestions/List');
    }
    /**
     * Display the form to add a new question.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/IntakeQuestions/Create');
    }
    /**
     * Store the new question data.
     *
     * @param  \App\Http\Requests\Admin\IntakeQuestionsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(IntakeQuestionsRequest $request)
    {
        try {
            $intakeque->create($request->all());
            return $this->responseSuccess('Intake Question added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());
            return $this->responseFailed();
        }
    }

    /**
     * Display the question data of the given question id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function fetch()
    {
        $intake_questions = IntakeQuestion::
            orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

        return $this->responseSuccess([
            'rows'            => $intake_questions->toArray()['data'],
            'total'           => $intake_questions->total(),
            'allData'         => $intake_questions,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    public function show($id)
    {
        $question = IntakeQuestion::find($id);
        if (!$question) {
            abort(404);
        }
        $correctAnswer = $question->correct_answer;

        return Inertia::render('Admin/IntakeQuestions/Show', [
            'question'      => $question,
            'correctAnswer' => $correctAnswer,
        ]);
    }
    /**
     * Display the edit question form of the given question id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $question = IntakeQuestion::find($id);
        if (!$question) {
            abort(404);
        }
        return Inertia::render('Admin/IntakeQuestions/Edit', [
            'question'      => $question,
            'correctAnswer' => $question->correct_answer,
        ]);
    }
    /**
     * Update the question data of the given question id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\QuestionsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, IntakeQuestionsRequest $request)
    {
        $question = IntakeQuestion::find($id);
        if (!$question) {
            return $this->responseNotFound('Intake Question with the given id not found.');
        }
        try {
            $question->update($request->all());
            return $this->responseSuccess('Intake Question updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the question data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $question = IntakeQuestion::find($id);
        if (!$question) {
            return $this->responseNotFound('Intake Question with the given id not found.');
        }

        try {
            $question->delete();

            return $this->responseSuccess('Intake Question deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

}
