<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClassesRequest;
use App\Mail\InviteStudent;
use App\Models\Classes;
use App\Models\SendInvite;
use App\Models\Student\Student;
use App\Models\Student\Post;
use App\Models\Teacher;
use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Auth;
use App\Models\Student\ClassStudent;
use App\Models\ClassPost;
use App\Models\ClassTeacher;

class ClassesController extends Controller
{
    /**
     * Display all or the filtered/searched classes.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Classes/List');
    }

    /**
     * Display the form to add a new class.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Classes/Create', [
            'teachers' => Teacher::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"), 'id as value')->latest()->get(),
            'tracks'   => Track::select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Store the new class data.
     *
     * @param  \App\Http\Requests\Admin\ClassesRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(ClassesRequest $request)
    {
        try {
            $class =  Classes::create($request->all());

            if (!empty($request->teacher_ids)) {
                foreach ($request->teacher_ids as $teacherId) {
                    ClassTeacher::create(['class_id' => $class->id, 'teacher_id' => $teacherId['value'] ]);
                }
            }
            return $this->responseSuccess('Class added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the class data of the given class id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $studentsId = ClassStudent::where('class_id',$id)->pluck('student_id');
        $studentsPosts = Post::whereIn('created_by',$studentsId)->with(['comments','media','user.media','likes' => function ($query) {
            $query->where("teacher_id", Auth::user()->id);
        }])->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'DESC')->latest()->simplePaginate(3);
       
        $teacherId = ClassTeacher::where('class_id',$id)->pluck('teacher_id');
        $data['teacher'] = Teacher::whereIn('id',$teacherId)->get()->toArray();
        $data['students'] = Student::whereIn('id',$studentsId)->get()->toArray();
        $data['everyone'] = [
            "0" => [
                'first_name' => 'everyone',
                'last_name' => '',
                'id' => '1'
            ]];
        $data['teacherLabel'] = [
            "0" => [
                'first_name' => 'Teachers',
                'last_name' => '',
                'id' => 0,
            ]];
        $data['studentLabel'] = [
            "0" => [
                'first_name' => 'Students',
                'last_name' => '',
                'id' => 0,
            ]];
        $students = array_merge($data['everyone'],(!empty($data['teacher']) ? $data['teacherLabel'] : []), $data['teacher'], (!empty($data['students']) ? $data['studentLabel'] : []), $data['students']);
        $studentsData = $data['students'];
        $classTeacher = Teacher::whereIn('id',$teacherId)->get();
        $teachers = ClassPost::whereIn('teacher_id',$teacherId)->with('comments','teacher.media','teacher', 'likes')->orderBy('created_at', 'desc')->latest()->simplePaginate(3);

        if (request()->has('type')) {
            return $this->responseSuccess([
                'students'                 => $students,
                'teachers'                 => $teachers,
                'studentsPosts'            => $studentsPosts,
            ]);
        }else{
            return Inertia::render('Admin/Classes/Show', [
                'students'                   => $students,
                'studentsPosts'              => $studentsPosts,
                'teachers'                   => $teachers,
                'class'                      => Classes::with('track','teachers')->find($id),
                'studentsData'             => $studentsData,
                'classTeacher'              => $classTeacher,
            ]);       
        }
    }

    /**
     * Display the edit class form of the given class id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $class = Classes::with(['teachers', 'track', 'students'])->find($id);
        $teacherIds = ClassTeacher::where('class_id',$class->id)->pluck('teacher_id');

        $teachers = Teacher::whereIn('id',$teacherIds)
        ->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get();
        if (!$class) {
            abort(404);
        }
        return Inertia::render('Admin/Classes/Edit', [
            'class'    => $class,
            'teachers' => Teacher::select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"), 'id as value')->latest()->get(),
            'id' => Teacher::whereIn('id', $teacherIds)->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get(),
            'tracks'   => Track::select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Update the class data of the given class id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\ClassesRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, ClassesRequest $request)
    {
        try {
            $class = Classes::find($id);
            if($request['teacher_ids'] != [] ){
                $data = [];
                for ($i=0; $i < count($request['teacher_ids']); $i++) { 
                    array_push($data,$request['teacher_ids'][$i]['value']);
                }
                $class->teachers()->sync($data);
            }
            if (!$class) {
                return $this->responseNotFound('Class with the given id not found.');
            }
            $class->update($request->all());
            return $this->responseSuccess('Class updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());
            return $this->responseFailed();
        }
    }

    /**
     * Update the progress handler of the student for the given class id.
     *
     * @param  integer  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function studentProgressHandler($id, Request $request)
    {
        $class = Classes::find($id);
        if (!$class) {
            return $this->responseNotFound('Class with the given id not found.');
        }

        try {
            foreach ($request->all() as $key => $data) {
                $id = last(explode('progress_handler_', $key));
                $class->students()->sync([$id => ['progress_handler' => $data]], false);
            }

            return $this->responseSuccess('Student Progress Handler updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the class data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $class = Classes::find($id);
        if (!$class) {
            return $this->responseNotFound('Class with the given id not found.');
        }

        try {
            $class->delete();

            return $this->responseSuccess('Class deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Remove the student from the given class id.
     *
     * @param  integer  $classId
     * @param  integer  $studentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeStudent($classId, $studentId)
    {
        $class = Classes::find($classId);
        if (!$class) {
            $this->responseNotFound('Class with the given id not found.');
        }

        $student = $class->students()->find($studentId);
        if (!$student) {
            $this->responseNotFound('Student with the given id not found.');
        }

        try {
            $class->students()->detach($studentId);

            return $this->responseSuccess('Student removed successfully from the class');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Send class invitation email to the given email addresses.
     *
     * @param  integer  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendInvites($id, Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
        ]);

        $class = Classes::find($id);
        if (!$class) {
            return $this->responseNotFound('Class with the given id not found.');
        }

        try {
            foreach ($request->email as $email) {
                $student = Student::where('email', $email)->first();

                $studentExists  = false;
                $studentInClass = false;
                if ($student) {
                    $studentExists = true;

                    if ($student->isMemberOfClass($class)) {
                        $studentInClass = true;
                    }
                }

                if (!$studentInClass) {
                    $invite = SendInvite::create([
                        'class_id'   => $class->id,
                        'track_id'   => $class->track_id,
                        'teacher_id' => $class->teacher->id,
                        'email'      => $email,
                        'token'      => Str::random(32),
                    ]);

                    Mail::to($email)
                        ->send(new InviteStudent($invite, $studentExists));
                }
            }

            return $this->responseSuccess('Invites sent successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the classes.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $classes = Classes::has('teachers')
            ->with(['teachers', 'track:id,name'])
            ->withCount('students')->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $classes->toArray()['data'],
            'total'           => $classes->total(),
            'allData'         => $classes,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    public function fetchTeacher($track_id){
        $teachers = Teacher::where('track_id',$track_id)->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"), 'id as value')->get();
        return $this->responseSuccess([
            'teachers'            => $teachers,
        ], 201);
    }
}
