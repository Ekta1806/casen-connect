<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\QuestionsRequest;
use App\Models\DailyQuestion;
use App\Models\Student\Student;
use App\Models\Student\StudentAnswers;
use App\Models\Teacher;
use App\Notifications\TagNotification;
use Illuminate\Http\Request;

class StudentAnswersController extends Controller
{

    /* Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Classs Members';

    /**
     * Store a newly created daily questions in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(QuestionsRequest $request)
    {
        try {

            $question = DailyQuestion::find($request->question_id);
            if ($request->type == "multiple-choice" && $request->option_answer == $question->question_details['correct_answer']['option']) {
                $request['options'] = (['answers' => $question->question_details['answers']]);
                $data               = array_merge($request->all(), ['student_id' => auth()->user()->id, 'status' => 'pending']);
            } else {
                $data = array_merge($request->all(), ['student_id' => auth()->user()->id]);
            }

            $studentAnswer = StudentAnswers::create($data);
            $student       = Student::where('id', auth()->user()->id)->with('classes')->first();
            $teacher       = Teacher::where('id', $studentAnswer->teacher_id)->first();
            $details       = [
                'greeting'     => 'Hi',
                'name'         => $student->first_name . ' ' . $student->last_name,
                'body'         => "has answered the question.",
                'post_type'    => "student_answered",
                'commented_by' => $studentAnswer->student_id,
                'post_id'      => $studentAnswer->question_id,
            ];

            $teacher->notify(new TagNotification($details));

        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }

    }
}
