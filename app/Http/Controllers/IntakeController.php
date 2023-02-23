<?php

namespace App\Http\Controllers;

use App\Http\Requests\IntakeFormRequest;
use App\Models\IntakeForm;
use App\Models\IntakeQuestion;
use Inertia\Inertia;

class IntakeController extends Controller
{
    public function intakeForm()
    {
        $intake_questions = IntakeQuestion::
            orderBy('id', 'DESC')->paginate(config('app.pagination_count'));
        return Inertia::render('Intake',
            ['rows'           => $intake_questions->toArray()['data'],
                'total'           => $intake_questions->total(),
                'allData'         => $intake_questions,
                'perPageRowCount' => (int) config('app.pagination_count') ?? 10]);
    }
    public function intakeFormSubmit(IntakeFormRequest $request)
    {
        $var1 = $request->except(['name', 'email']);

        $ques_ans = [];
        foreach ($var1 as $key => $var) {
            $data = ["question" => str_replace("question_", "", $key), "answer" => $var];
            array_push($ques_ans, $data);
        }
        $intake_form               = new IntakeForm;
        $intake_form->name         = $request->name;
        $intake_form->email        = $request->email;
        $intake_form->que_ans_data = json_encode($ques_ans);
        $intake_form->save();
        return $this->responseSuccess('Your Answer Submitted successfully.');
    }
}
