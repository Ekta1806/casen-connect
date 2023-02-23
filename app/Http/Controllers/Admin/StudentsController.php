<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentsRequest;
use App\Http\Requests\Admin\UserPasswordRequest;
use App\Models\Classes;
use App\Models\Level;
use App\Models\Student\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student\Post;
use App\Models\Student\ClassStudent;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\ClassTeacher;
use Mail;
use App\Mail\ClassChangeMail;
use App\Notifications\ClassChangeNotification;


class StudentsController extends Controller
{
    /**
     * Display all or the filtered/searched students.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Students/List');
    }

    /**
     * Display the form to add a new student.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        $classList = Classes::join('tracks', 'tracks.id', '=', 'classes.track_id')
            ->select('classes.id as value', \DB::raw('CONCAT(classes.name, " (Track: ", tracks.name, ")") as label'))
            ->get();

        $levels = Level::select(['id as value', 'name as label'])->get();

        return Inertia::render('Admin/Students/Create', [
            'classList' => $classList,
            'levels'    => $levels,
        ]);
    }

    /**
     * Store the new student data.
     *
     * @param  \App\Http\Requests\Admin\StudentsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(StudentsRequest $request)
    {
        $request['password']          = bcrypt($request->password);
        $request['is_active']         = $request->is_active == true ? 1 : 0;
        $request['is_private']        = $request->is_private == true ? 1 : 0;
        $request['email_preferences'] = [
            "promotional" => $request->receive_promotional_email == true ? true : false,
            "newsletter"  => $request->receive_newsletter_email == true ? true : false,
        ];
        $classesId = array_filter($request->classes_id) ?? [];
        try {
            if (!empty($classesId)) {
                $trackIds = [];
                foreach ($classesId as $classId) {
                    $trackIds[] = Classes::find($classId)->track_id;
                }

                if (count(array_unique($trackIds, SORT_REGULAR)) < count($trackIds)) {
                    return $this->responseFailed(
                        'A student can be part of only 1 class in 1 track.', 201, [
                            'status' => 'classMappingFailed',
                        ]);
                }

                $student = Student::create($request->all());
                $student->classes()->attach($classesId);
            } else {
                $student = Student::create($request->all());
            }

            if ($request->file('profile_picture')) {
                $student->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');
            }

            return $this->responseSuccess('Student added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the student data of the given student id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        
        $student = Post::where('created_by', $id)->with(['media', 'likes', 'comments', 'user' => function($q){
            $q->with(['classes' => function ($q) {
                $q->withCount('students');
            }, 'dailyQuestionAnswers', 'level:id,name']);
        }])->withCount(['likes', 'comments'])->orderBy('status', 'DESC')->latest()->simplePaginate(3);

        if (!$student) {
            abort(404);
        }

        $student_id = Student::find($id);

        $emailPreferences = $student_id->email_preferences;
        if ($student_id->email_preferences == null) {
            $emailPreferences = [
                'promotional' => false,
                'newsletter'  => false,
            ];
        }

        $classesList = $student_id->classes()->pluck('id');
        $class = $student_id->classes;
        $students_ids = ClassStudent::whereIn('class_id',$classesList)->pluck('student_id');
        $teachers_ids = ClassTeacher::whereIn('class_id',$classesList)->pluck('teacher_id');

        $data['students'] = Student::whereIn('id',$students_ids)->get()->toArray();
        $data['teacher'] = Teacher::whereIn('id',$teachers_ids)->get()->toArray();
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

        if (request()->has('type')) {
            return $this->responseSuccess([
                'student'              => $student,
            ]);
        }else{
            return Inertia::render('Admin/Students/Show', [
                'student'              => $student,
                'emailPreferences'     => $emailPreferences,
                'classesList'          => $class,
                'dailyQuestionAnswers' => $student_id->dailyQuestionAnswers,
                'profilePicture'       => $student_id->getProfilePicture(),
                'student_id' => $student_id,
                'students' => $students,
            ]);        
        }
    }

    /**
     * Display the edit student form of the given student id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $student = Student::with('classes')->find($id);
        if (!$student) {
            abort(404);
        }

        $emailPreferences = $student->email_preferences;
        if ($student->email_preferences == null) {
            $emailPreferences = [
                'promotional' => false,
                'newsletter'  => false,
            ];
        }

        $classList = Classes::join('tracks', 'tracks.id', '=', 'classes.track_id')
            ->select('classes.id as value', \DB::raw('CONCAT(classes.name, " (Track: ", tracks.name, ")") as label'))
            ->get();
        $studentMappedClass = $student->classes()->join('tracks', 'tracks.id', '=', 'classes.track_id')
            ->select('classes.id as value', \DB::raw('CONCAT(classes.name, " (Track: ", tracks.name, ")") as label'))
            ->get();

        $levels = Level::select(['id as value', 'name as label'])->get();

        return Inertia::render('Admin/Students/Edit', [
            'student'            => $student,
            'emailPreferences'   => $emailPreferences,
            'classList'          => $classList,
            'levels'             => $levels,
            'studentMappedClass' => $studentMappedClass,
            'profilePicture'     => $student->getProfilePicture(),
        ]);
    }

    /**
     * Update the student data of the given student id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\StudentsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, StudentsRequest $request)
    {
        $student = Student::find($id);
        $old_class = $student->classes()->select('class_id')->first();
        if (!$student) {
            return $this->responseNotFound('Student with the given id not found.');
        }

        $request['is_active']         = ($request->is_active == true) ? 1 : 0;
        $request['is_private']        = $request->is_private == true ? 1 : 0;
        $request['email_preferences'] = [
            "promotional" => $request->receive_promotional_email == true ? true : false,
            "newsletter"  => $request->receive_newsletter_email == true ? true : false,
        ];
        $classesId = $request->classes_id ?? '';
        $student->update($request->all());
        $update_class = Classes::where('id',$classesId)->first();
        $oldClassName = Classes::find($old_class->class_id); 
        if($old_class->class_id !== $update_class->id){
            $details = [
                'greeting' => 'Hi',
                'name'     => auth()->user()->full_name,
                'body'     => "Changed your class ".$oldClassName->name." to New Class ".$update_class->name,  
                'post_type' => "student_class_change",
                'dear_name' => $student->full_name,
            ];
            Mail::to($student->email)->send(new ClassChangeMail($details));
            $student->notify(new ClassChangeNotification($details));
        }

        try {
            if (!empty($classesId)) {
                $trackIds   = [];
                $trackIds[] = Classes::find($classesId)->track_id;

                if (count(array_unique($trackIds, SORT_REGULAR)) < count($trackIds)) {
                    return $this->responseFailed(
                        'A student can be part of only 1 class in 1 track.', 201, [
                            'status' => 'classMappingFailed',
                        ]);
                }

                $student->fresh()->classes()->sync($classesId ?? []);
            } else {
                $student->fresh()->classes()->sync($classesId ?? []);
            }

            if ($request->file('profile_picture')) {
                $pic = $student->fresh()->getMedia('profile_pictures')->first();
                if ($pic) {
                    $pic->delete();
                }

                $student->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');
            }

            return $this->responseSuccess('Student updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Change the password of the given student id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\UserPasswordRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword($id, UserPasswordRequest $request)
    {
        $student = Student::find($id);
        if (!$student) {
            return $this->responseNotFound('Student with the given id not found.');
        }

        try {
            $student->update([
                'password' => bcrypt($request->new_password),
            ]);

            return $this->responseSuccess('Password changed successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the student data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return $this->responseNotFound('Student with the given id not found.');
        }

        try {
            $student->delete();

            return $this->responseSuccess('Student deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the profile picture image of the given student id.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return $this->responseNotFound('Student with the given id not found.');
        }

        try {
            $student->getMedia('profile_pictures')->first()->delete();

            return $this->responseSuccess('Profile image deleted successfully.');
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
        $students = Student::select(['id', 'first_name', 'last_name', 'email', 'is_active', 'level_id'])
            ->with(['level:id,name','classes'])
            ->withCount(['posts' => function ($query) {
                $query->select(\DB::raw('count(id)'));
            }])->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $students->toArray()['data'],
            'total'           => $students->total(),
            'allData'         => $students,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);


    }
}
