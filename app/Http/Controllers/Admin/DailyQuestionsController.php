<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DailyQuestionsRequest;
use App\Models\Admin;
use App\Models\Classes;
use App\Models\DailyQuestion;
use App\Models\Level;
use App\Models\Question;
use App\Models\Student\Student;
use App\Models\Student\StudentAnswers;
use App\Models\Teacher;
use App\Models\Track;
use App\Notifications\TagNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Student\ClassStudent;
use App\Models\ClassTeacher;


class DailyQuestionsController extends Controller
{
    /**
     * Display all the daily questions.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $content = request('search') ?? null;

        $questions = DailyQuestion::query();
        if ($content) {
            $questions = $questions->where('question_details->content', 'LIKE', "%{$content}%");
        }
        $questions = $questions->orderBy('id', 'DESC')->cursorPaginate(config('app.pagination_count'));

        return Inertia::render('Admin/DailyQuestions/List', [
            'questions'       => $questions->appends(request()->query()),
            'questionContent' => $content,
        ]);
    }

    /**
     * Display the form to add a new question.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/DailyQuestions/Create', [
            'classes' => Classes::select('name as label', 'id as value')->latest()->get(),
            'levels'  => Level::select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Store the new question data.
     *
     * @param  \App\Http\Requests\Teacher\DailyQuestionsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(DailyQuestionsRequest $request)
    {
        $dailyquestions = DailyQuestion::where('ask_on_date',$request['ask_on_date'])->where('deleted_at',null)->get();
        $student_id = [];
        if(count($request->students_id) < 2 && $request->students == "per_student" && $request->students_id[0] == null){
            return $this->responseFailed('Please Select Particular Student', 201);
        }
        
        for ($i=0; $i < count($request->students_id); $i++) { 
           array_push($student_id,(int)$request->students_id[$i]);
        }

        foreach($dailyquestions as $que){
            if($student_id[0] == 0 && $que['student_id'][0] == 0){
                $class = Classes::where('id',$request['classes_id'])->first();
                if(($request['classes_id'] == $que['classes_id']) && ($request['level_id'] == $que['level_id'])){
                    return $this->responseFailed('The question is already assigned to '. $class->name.' class for this Ask On Date.', 201);
                }
            }else{
                if(array_intersect($que['student_id'],$student_id)){
                    $student = Student::whereIn('id',array_intersect($que['student_id'],$student_id))->get();
                    $data=[];
                    foreach($student as $stu){
                        array_push($data,$stu->full_name);
                    }
                    for ($i=0; $i < count($data); $i++) { 
                        return $this->responseFailed('The question is already assigned to '. $data[$i] .' student for this Ask On Date.', 201);
                    }
                }
            }
        }

        $class = Classes::find($request->classes_id);
        if (!$class) {
            return $this->responseNotFound('Class with the given id not found.');
        }
        $request['teacher_id']    = auth()->user()->id;
        $request['track_id']      = $class->track_id;
        $request['track_details'] = [
            'name'        => $class->track->name,
            'description' => $class->track->description,
        ];
        $request['classes_details'] = [
            'name'        => $class->name,
            'description' => $class->description,
        ];
        $request['teacher_details'] = [
            'first_name'      => auth()->user()->first_name,
            'last_name'       => auth()->user()->last_name,
            'email'           => auth()->user()->email,
            'contact_number'  => auth()->user()->contact_number,
            'avatar_original' => auth()->user()->avatar_original,
        ];
        $question = Question::find($request->question_id);
        if (!$question) {
            return $this->responseNotFound('Question with the selected id not found.');
        }
        $request['question_details'] = [
            'type'                      => $question->type,
            'content'                   => $question->content,
            'answers'                   => $question->answers ?? [],
            'correct_answer'            => $question->correct_answer ?? [],
            'descriptive_answer_length' => $question->descriptive_answer_length ?? [],
        ];

        $request['level_id'] = $request->level_id;
        $request['student_id'] = $student_id? $student_id:null;
        $request['added_by'] = 'admin';

        try {
            DailyQuestion::create($request->all());

            return $this->responseSuccess('Class Daily Question added successfully.');
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
        $question = DailyQuestion::with(['level:id,name'])->find($id);
        if (!$question) {
            abort(404);
        }
        return Inertia::render('Admin/DailyQuestions/Show', [
            'question'       => $question,
            'trackDetails'   => $question->track_details ?? [],
            'classesDetails' => $question->classes_details ?? [],
            'teacherDetails' => $question->teacher_details ?? [],
            'answers'        => StudentAnswers::with(['student'])->where('question_id', $id)->orderBy('id', 'DESC')->get(),
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
        $question = DailyQuestion::find($id);
        if (!$question) {
            abort(404);
        }

        $questionDetails = $question->question_details ?? [];

        $answers = $correctAnswer = [];
        if (!empty($questionDetails['answers'])) {
            $answers       = $questionDetails['answers'];
            $correctAnswer = $questionDetails['correct_answer'];
        }

        $answersLength = [];
        if (!empty($questionDetails['descriptive_answer_length'])) {
            $answersLength = $questionDetails['descriptive_answer_length'];
        }
        $students = Student::whereIn('id',str_replace(array( '[', ']' ), '', $question->student_id))->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get();

        return Inertia::render('Admin/DailyQuestions/Edit', [
            'question'        => $question,
            'questionDetails' => $question->question_details ?? [],
            'answers'         => $answers,
            'answersLength'   => $answersLength,
            'correctAnswer'   => $correctAnswer,
            'tracks'          => Track::select('name as label', 'id as value')->latest()->get(),
            'classes'         => Classes::select('name as label', 'id as value')->latest()->get(),
            'levels'          => Level::select('name as label', 'id as value')->latest()->get(),
            'students'        => $students,
        ]);
    }

    /**
     * Update the question data of the given question id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Teacher\DailyQuestionsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, DailyQuestionsRequest $request)
    {
        $dailyquestions = DailyQuestion::where('ask_on_date',$request['ask_on_date'])->where('deleted_at',null)->get();
        $student_id = [];
        if(count($request->students_id) < 2 && $request->students == "per_student" && $request->students_id[0] == null){
            return $this->responseFailed('Please Select particular Student', 201);
        }
        
        for ($i=0; $i < count($request->students_id); $i++) { 
            array_push($student_id,(int)$request->students_id[$i]["value"]);
        }
        foreach($dailyquestions as $que){
            if($student_id == [] && empty($que['student_id'])){
                $class = Classes::where('id',$request['classes_id'])->first();
                if(($request['classes_id'] == $que['classes_id']) && ($request['level_id'] == $que['level_id'])){
                    return $this->responseFailed('The question is already assigned to '. $class->name.' class for this Ask On Date.', 201);
                }
            }else{
               
                if(array_intersect($que['student_id'],$student_id)){
                    $student = Student::whereIn('id',array_intersect($que['student_id'],$student_id))->get();
                    $data=[];
                    foreach($student as $stu){
                        array_push($data,$stu->full_name);
                    }
                    for ($i=0; $i < count($data); $i++) { 
                        return $this->responseFailed('The question is already assigned to '. $data[$i] .' student for this Ask On Date.', 201);
                    }
                }
            }
        }

        $question = DailyQuestion::find($id);
        if (!$question) {
            return $this->responseNotFound('Class Daily Question with the given id not found.');
        }

        $questionDetails = [
            'type'    => $request->type,
            'content' => $request->content,
        ];
        if ($request->type == 'multiple-choice') {
            $questionDetails['descriptive_answer_length'] = [];
            $questionDetails['answers']                   = [
                'option_1' => $request->answer_1,
                'option_2' => $request->answer_2,
                'option_3' => $request->answer_3,
                'option_4' => $request->answer_4,
            ];
            $questionDetails['correct_answer'] = [
                'option' => $request->correct_answer_option,
            ];
        }
        if ($request->type == 'descriptive') {
            $questionDetails['answers']                   = [];
            $questionDetails['correct_answer']            = [];
            $questionDetails['descriptive_answer_length'] = [
                'minimum' => $request->minimum_length,
                'maximum' => $request->maximum_length,
            ];
        }
        $student_id = [];
        foreach($request->students_id as $id){
            array_push($student_id,$id['value']);
        }

        $class = Classes::find($request->classes_id);
        if (!$class) {
            return $this->responseNotFound('Class with the selected id not found.');
        }

        $trackDetails = [
            'name'        => $class->track->name,
            'description' => $class->track->description,
        ];
        $classesDetails = [
            'name'        => $class->name,
            'description' => $class->description,
        ];
        $teacherDetails = [
            'first_name'      => auth()->user()->first_name,
            'last_name'       => auth()->user()->last_name,
            'email'           => auth()->user()->email,
            'contact_number'  => auth()->user()->contact_number,
            'avatar_original' => auth()->user()->avatar_original,
        ];

        $level = Level::find($request->level_id);

        if($request->priority === 'immediately'){
            $askOnDate = Carbon::now();
        } else {
            $askOnDate = $request->ask_on_date;
        }

        try {
            $question->update([
                'track_id'         => $request->track_id,
                'track_details'    => $trackDetails,
                'classes_id'       => $request->classes_id,
                'classes_details'  => $classesDetails,
                'teacher_id'       => $class->teacher_id,
                'teacher_details'  => $teacherDetails,
                'question_details' => ($questionDetails),
                'ask_on_date'      => $askOnDate,
                'level_id'         => $request->level_id,
                'priority'         => $request->priority,
                'student_id'       => $student_id,
            ]);

            return $this->responseSuccess('Class Daily Question updated successfully.');
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
        $question = DailyQuestion::find($id);
        if (!$question) {
            return $this->responseNotFound('Class Daily Question with the given id not found.');
        }
        try {

            $postType = 'student_answered';
            $postType2 = 'student_answer';
            $notification = DB::table('notifications')->whereJsonContains('data', ['id' => $question->id])->orWhereJsonContains('data',['post_type' => $postType])->orWhereJsonContains('data',['post_type' => $postType2])->delete();
            
            $question->delete();
            return $this->responseSuccess('Class Daily Question deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch the details of the question.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch($level_id=null, $class_id=null)
    {
        if ($class_id!= null && $level_id != null) {
            $students = ClassStudent::where('class_id',$class_id)->pluck('student_id');
            $studentData = Student::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')
                    ->whereIn('id',$students)->where('level_id', $level_id)->get();
            return $this->responseSuccess([
                'data' => Question::select('id as value', 'content as label')
                    ->where('level_id', $level_id)
                    ->orderBy('content', 'ASC')
                    ->get(),
                'studentData' => $studentData
            ]);
        }
        if ($level_id == null) {
            $students = ClassStudent::where('class_id',$class_id)->pluck('student_id');
            $studentData = Student::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')
                    ->whereIn('id',$students)->get();
                   
            return $this->responseSuccess([
                'studentData' => $studentData
            ]);
        }
        if ($class_id == null) {
            $studentData = Student::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')
                    ->where('level_id', $level_id)->get();
            return $this->responseSuccess([
                'data' => Question::select('id as value', 'content as label')
                    ->where('level_id', $level_id)
                    ->orderBy('content', 'ASC')
                    ->get(),
                'studentData' => $studentData
            ]);
        }
    }

    /**
     * Approrve or reject the student's answer for the given id.
     *
     * @param  integer  $answerId
     * @param  string   $approvedOrRejected
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveRejectAnswer($answerId, $approvedOrRejected)
    {
        $answer = StudentAnswers::find($answerId);
        if (!$answer) {
            return $this->responseSuccess([
                'status'  => 'failed',
                'message' => 'Answer not found.',
            ]);
        }
        $student = Student::where('id', $answer->student_id)->first();
        $admin = Admin::find(auth()->user()->id);
        $status = null;
        if ($approvedOrRejected == 'approved') {
            $status = 1;
        }
        if ($approvedOrRejected == 'rejected') {
            $status = 0;
        }
        try {

            $details = [
                'greeting'     => 'Hi',
                'name'         => $admin->first_name . ' ' . $admin->last_name,
                'body'         => ($approvedOrRejected == 'approved' ? 'has approved your answer' : 'has rejected your answer'),
                'post_type'    => "student_answer",
                'post_id'      => "",
                'commented_by' => "",
            ];

            $student->notify(new TagNotification($details));

            $answer->update([
                'answer_approved' => $status,
                'status'          => 1,
            ]);

            return $this->responseSuccess([
                'status'  => 'success',
                'message' => 'Answer ' . $approvedOrRejected . ' successfully.',
            ]);
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }

    }

    /**
     * Fetch all the today's questions.
     *
     * @return \Inertia\Response
     */
    public function fetchAll()
    {
        $questions = DailyQuestion::select(['id', 'classes_id', 'classes_details', 'priority', 'added_by', 'question_details', 'teacher_id', 'teacher_details', 'level_id', 'ask_on_date'])
            ->with(['classes:id,name', 'level:id,name'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $questions->toArray()['data'],
            'total'           => $questions->total(),
            'allData'         => $questions,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    public function getStudents($id,$level_id=null, request $request)
    {
        if($id && $level_id==null){
            $students_ids = ClassStudent::where('class_id',$id)->pluck('student_id');
            $students = Student::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->whereIn('id',$students_ids)->get();
            return $this->responseSuccess([
                'students'         => $students,
            ], 200);
        }
        if($id && $level_id!=null){
            $students_ids = ClassStudent::where('class_id',$id)->pluck('student_id');
            $students = Student::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->whereIn('id',$students_ids)->where('level_id', $level_id)->get();
            return $this->responseSuccess([
                'students'         => $students,
            ], 200);
        }
        
    }
}
