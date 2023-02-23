<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\QuestionsRequest;
use App\Models\Level;
use App\Models\Question;
use App\Models\Track;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionsController extends Controller
{
    /**
     * Display all or the filtered/searched questions.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Questions/List');
    }

    /**
     * Display the form to add a new question.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Questions/Create', [
            'tracks' => Track::select('name as label', 'id as value')->latest()->get(),
            'levels' => Level::select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Store the new question data.
     *
     * @param  \App\Http\Requests\Admin\QuestionsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(QuestionsRequest $request)
    {
        if ($request->type == 'multiple-choice') {
            $request['descriptive_answer_length'] = null;
            $request['answers']                   = [
                'option_1' => $request->answer_1,
                'option_2' => $request->answer_2,
                'option_3' => $request->answer_3,
                'option_4' => $request->answer_4,
            ];
            $request['correct_answer'] = [
                'option' => $request->correct_answer_option,
            ];
        }

        if ($request->type == 'descriptive') {
            $request['answers']                   = null;
            $request['descriptive_answer_length'] = [
                'minimum' => $request->minimum_length,
                'maximum' => $request->maximum_length,
            ];
        }

        try {
            Question::create($request->all());

            return $this->responseSuccess('Question added successfully.');
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
    public function show($id)
    {
        $question = Question::with(['track', 'level:id,name'])->find($id);
        if (!$question) {
            abort(404);
        }
        $answers = $correctAnswer = [];
        if ($question->answers) {
            $answers       = array_values(($question->answers)) ?? [];
            $correctAnswer = ($question->correct_answer) ?? [];
        }

        $answersLength = [];
        if ($question->descriptive_answer_length) {
            $answersLength = ($question->descriptive_answer_length) ?? [];
        }

        return Inertia::render('Admin/Questions/Show', [
            'question'      => $question,
            'answers'       => $answers,
            'answersLength' => $answersLength,
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
        $question = Question::find($id);
        if (!$question) {
            abort(404);
        }
        $answers = $correctAnswer = [];
        if ($question->answers) {
            $answers       = ($question->answers) ?? [];
            $correctAnswer = ($question->correct_answer) ?? [];
        }

        $answersLength = [];
        if ($question->descriptive_answer_length) {
            $answersLength = ($question->descriptive_answer_length) ?? [];
        }

        return Inertia::render('Admin/Questions/Edit', [
            'question'      => $question,
            'answers'       => $answers,
            'tracks'        => Track::select('name as label', 'id as value')->latest()->get(),
            'answersLength' => $answersLength,
            'correctAnswer' => $correctAnswer,
            'levels'        => Level::select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Update the question data of the given question id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\QuestionsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, QuestionsRequest $request)
    {
        $question = Question::find($id);
        if (!$question) {
            return $this->responseNotFound('Question with the given id not found.');
        }

        if ($request->type == 'multiple-choice') {
            $request['descriptive_answer_length'] = null;
            $request['answers']                   = [
                'option_1' => $request->answer_1,
                'option_2' => $request->answer_2,
                'option_3' => $request->answer_3,
                'option_4' => $request->answer_4,
            ];
            $request['correct_answer'] = [
                'option' => $request->correct_answer_option,
            ];
        }

        if ($request->type == 'descriptive') {
            $request['answers']                   = null;
            $request['descriptive_answer_length'] = [
                'minimum' => $request->minimum_length,
                'maximum' => $request->maximum_length,
            ];
        }

        try {
            $question->update($request->all());

            return $this->responseSuccess('Question updated successfully.');
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
        $question = Question::find($id);
        if (!$question) {
            return $this->responseNotFound('Question with the given id not found.');
        }

        try {
            $question->delete();

            return $this->responseSuccess('Question deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the questions.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $questions = Question::has('track')
            ->select(['id', 'content', 'type', 'track_id', 'level_id'])
            ->with(['level:id,name', 'track:id,name'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $questions->toArray()['data'],
            'total'           => $questions->total(),
            'allData'         => $questions,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
