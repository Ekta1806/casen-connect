<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StudentPasswordRequest;
use App\Http\Requests\Teacher\StudentsRequest;
use App\Models\Classes;
use App\Models\Level;
use App\Models\Student\Student;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student\Post;
use App\Models\Student\ClassStudent;
use Mail;
use App\Mail\ClassChangeMail;
use App\Notifications\ClassChangeNotification;
use App\Models\ClassPost;
use App\Models\Admin;
use App\Models\ClassTeacher;
use App\Models\Teacher;

class StudentsController extends Controller
{
    /**
     * Display all or the searched/filtered students that are taking
     * the authenticated teacher's class.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Students/List');
    }
    /**
     * Display the student data of the given student id.
     *
     * @param  integer  $classId
     * @param  integer  $studentId
     * @return void|\Inertia\Response
     */

    public function studentTaggedData($id){
        $student_id = Post::where('id',$id)->select('created_by')->first();
        $class_id = ClassStudent::where('student_id',$student_id->created_by)->pluck('class_id');
        $student_ids = ClassStudent::where('class_id',$class_id)->pluck('student_id');
        $teacher_ids = ClassTeacher::where('class_id',$class_id)->pluck('teacher_id');
        $data['students'] = Student::whereIn('id',$student_ids)->get()->toArray();
        $data['teacher'] = Teacher::whereIn('id',$teacher_ids)->where('id','!=',Auth::user()->id)->get()->toArray();
        $data['admin'] = Admin::get()->toArray();
        $data['everyone'] = [
            "0" => [
                'first_name' => 'everyone',
                'last_name' => '',
                'id' => '1'
            ]];
        $data['adminLabel'] = [
            "0" => [
                'first_name' => 'Admins',
                'last_name' => '',
                'id' => 0,
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
        $students = array_merge($data['everyone'],(!empty($data['admin']) ? $data['adminLabel'] : []), $data['admin'], (!empty($data['teacher']) ? $data['teacherLabel'] : []), $data['teacher'], (!empty($data['students']) ? $data['studentLabel'] : []), $data['students']);
        return $this->responseSuccess($students);
    }

    public function show($studentId)
    {
        $student = Post::where('created_by',$studentId)->with(['comments','media','user.media','likes' => function ($query) {
            $query->where("teacher_id", Auth::user()->id);
        }])->withCount(['likes', 'comments'])
        ->orderByRaw("case
                    when status = 'pending' then 0
                    when status = 'approved' and status = 'rejected' then 1
                    else 1 end ASC")
        ->withCount(['likes', 'comments'])->latest()->simplePaginate(3);

        if (!$student) {
            abort(404);
        }
        $student_data = Student::with('level:id,name')->find($studentId);

        $emailPreferences = $student_data->email_preferences;
        if ($student_data->email_preferences == null) {
            $emailPreferences = [
                'promotional' => false,
                'newsletter'  => false,
            ];
        }

        $classesList = $student_data->classes;
        $students    = Student::has('classes')->get();

        if (request()->has('type')) {
            return $this->responseSuccess(['student' => $student]);
        }
            
        return Inertia::render('Teacher/Students/Show', [
            'student'              => $student,
            'students'             => $students,
            'classesList'          => $classesList,
            'emailPreferences'     => $emailPreferences,
            'dailyQuestionAnswers' => $student_data->dailyQuestionAnswers,
            'profilePicture'       => $student_data->getProfilePicture(),
            'student_data'         => $student_data
        ]);
    }

    /**
     * Display the edit form of the given student id.
     *
     * @param  integer  $studentId
     * @return void|\Inertia\Response
     */
    public function edit($studentId)
    {
        $classesId = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $student   = Student::has('classes')->find($studentId);
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

        return Inertia::render('Teacher/Students/Edit', [
            'student'            => $student,
            'classList'          => $classList,
            'studentMappedClass' => $studentMappedClass,
            'emailPreferences'   => $emailPreferences,
            'profilePicture'     => $student->getProfilePicture(),
            'levels'             => $levels,
        ]);
    }

    /**
     * Update the student data of the given student id.
     *
     * @param  integer  $classId
     * @param  integer  $studentId
     * @param  \App\Http\Requests\Teacher\StudentsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($studentId, StudentsRequest $request)
    {
        
        $student = Student::find($studentId);
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
                'body'     => "Changed your class ". $oldClassName->name. " to New Class ".$update_class->name,  
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
     * @param  integer  $studentId
     * @param  \App\Http\Requests\Teacher\StudentPasswordRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword($studentId, StudentPasswordRequest $request)
    {
        $student = Student::has('classes')->find($studentId);
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
     * Delete the profile picture image of the given student id.
     *
     * @param  integer  $studentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar($studentId)
    {
        $classesId = auth()->user()->classes()->pluck('id');
        $student   = Student::has('classes')->find($studentId);
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
     * Fetch all the students that are taking the classes lead by the
     * currently authenticated teacher.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch()
    {
        $classesId = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $classes = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id')->toArray();
        $studentsIds = ClassStudent::whereIn('class_id',$classes)->pluck('student_id');

        $students = Student::whereIn('id',$studentsIds)->select(['id', 'first_name', 'last_name', 'email', 'level_id'])
        ->with(['level:id,name'])
        ->with('classes')->withCount(['posts' => function ($query) {$query->select(\DB::raw('count(id)'));},
        ])->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $students->toArray()['data'],
            'total'           => $students->total(),
            'allData'         => $students,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    /**
     * Fetch all the students that are taking the classes lead by the
     * currently authenticated teacher.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetchPendingPosts()
    {
        $students = Student::select(['id', 'first_name', 'last_name', 'email'])
            ->has('classes')->withCount(['classes', 'pendingPosts', 'pendingComments'])->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));
            return $this->responseSuccess([
            'rows'            => $students->toArray()['data'],
            'total'           => $students->total(),
            'allData'         => $students,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
    
    public function fetchPostComments($studentId)
    {
        $student = Student::has('classes')->with(['comments' => function ($q) {
            $q->where('status', 'pending');
            $q->with(['post' => function ($q) {
                $q->where('status', 'approved')->with('media');
            }]);
        }])->find($studentId);
        if (!$student) {
            abort(404);
        }

        return Inertia::render('Teacher/Students/Comments', [
            'student'        => $student,
            'profilePicture' => $student->getProfilePicture(),
        ]);
    }

}
