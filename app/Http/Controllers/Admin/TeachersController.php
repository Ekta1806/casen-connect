<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeachersRequest;
use App\Http\Requests\Admin\UserPasswordRequest;
use App\Models\Teacher;
use App\Models\Track;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassPost;
use App\Models\Student\ClassStudent;
use App\Models\Student\Student;
use App\Models\Admin;

class TeachersController extends Controller
{
    /**
     * Display all or the filtered/searched teachers.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Teachers/List');
    }

    /**
     * Display the form to add a new teacher.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        $tracks = Track::select('name as label', 'id as value')->latest()->get();

        return Inertia::render('Admin/Teachers/Create', [
            'tracks' => $tracks,
        ]);
    }

    /**
     * Store the new teacher data.
     *
     * @param  \App\Http\Requests\Admin\TeachersRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(TeachersRequest $request)
    {
        $request['password']          = bcrypt($request->password);
        $request['is_active']         = $request->is_active == true ? 1 : 0;
        $request['email_preferences'] = [
            "promotional" => $request->receive_promotional_email == true ? true : false,
            "newsletter"  => $request->receive_newsletter_email == true ? true : false,
        ];

        try {
            $teacher = Teacher::create($request->all());
            if ($request->file('profile_picture')) {
                $teacher->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');

                cache()->rememberForever('teacher_dp_' . $teacher->id, function () use ($teacher) {
                    return $teacher->getMedia('profile_pictures')->first()->getFullUrl();
                });
            }

            return $this->responseSuccess('Teacher added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the teacher data of the given teacher id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $teacher = ClassPost::where('teacher_id', $id)->with(['media', 'likes', 'comments', 'teacher' => function($q){
            $q->with(['track:id,name', 'class']);
        }])->withCount(['likes', 'comments'])->orderBy('id', 'DESC')->latest()->simplePaginate(3);
        if (!$teacher) {
            abort(404);
        }
        $teacher_id = Teacher::find($id);

        $emailPreferences = $teacher_id->email_preferences;
        if ($teacher_id->email_preferences == null) {
            $emailPreferences = [
                'promotional' => true,
                'newsletter'  => true,
            ];
        }

        $classes = $teacher_id->class;
        $class_teacher =  $teacher_id->class;
        $students_array= "";
        foreach($classes as $class){
            $student_ids = ClassStudent::where('class_id',$class->id)->pluck('student_id')->toArray();
            if(count($student_ids)){
                if($students_array == ""){
                    $students_array= implode(array_values($student_ids),",");
                }else{
                $students_array= $students_array. ",". implode(array_values($student_ids),",");

                }
            }
        }
        $data['students'] = Student::whereIn('id',explode(",",$students_array))->get()->toArray();
        $data['teacher'] = Teacher::where('id',$id)->get()->toArray();
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
                'teacher'          => $teacher,
                'emailPreferences' => $emailPreferences,
                'classes'          => $classes->merge($class_teacher),
                'profilePicture'   => $teacher_id->getProfilePicture(),
                'teacher_id'       => $teacher_id,
                'students'         => $students
            ]);
        }else{
            return Inertia::render('Admin/Teachers/Show', [
                'teacher'          => $teacher,
                'emailPreferences' => $emailPreferences,
                'classes'          => $classes->merge($class_teacher),
                'profilePicture'   => $teacher_id->getProfilePicture(),
                'teacher_id'       => $teacher_id,
                'students'         => $students
            ]);
        }
    }

    /**
     * Display the edit teacher form of the given teacher id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $teacher = Teacher::select(['id', 'first_name', 'last_name', 'email', 'contact_number', 'track_id', 'is_active', 'email_preferences'])->find($id);
        if (!$teacher) {
            abort(404);
        }

        $emailPreferences = $teacher->email_preferences;
        if ($teacher->email_preferences == null) {
            $emailPreferences = [
                'promotional' => false,
                'newsletter'  => false,
            ];
        }

        $tracks = Track::select('name as label', 'id as value')->latest()->get();

        return Inertia::render('Admin/Teachers/Edit', [
            'teacher'          => $teacher,
            'tracks'           => $tracks,
            'emailPreferences' => $emailPreferences,
            'profilePicture'   => $teacher->getProfilePicture(),
        ]);
    }

    /**
     * Update the teacher data of the given teacher id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\TeachersRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, TeachersRequest $request)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return $this->responseNotFound('Teacher with the given id not found.');
        }

        $request['is_active']         = $request->is_active == true ? 1 : 0;
        $request['email_preferences'] = [
            "promotional" => $request->receive_promotional_email == true ? true : false,
            "newsletter"  => $request->receive_newsletter_email == true ? true : false,
        ];

        try {
            $teacher->update($request->all());
            if ($request->file('profile_picture')) {
                $pic = $teacher->fresh()->getMedia('profile_pictures')->first();
                if ($pic) {
                    $pic->delete();
                }

                $teacher->fresh()->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');

                cache()->forget('teacher_dp_' . $teacher->id);
                cache()->rememberForever('teacher_dp_' . $teacher->id, function () use ($teacher) {
                    return $teacher->getMedia('profile_pictures')->first()->getFullUrl();
                });
            }

            return $this->responseSuccess('Teacher updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Change the password of the given teacher id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\UserPasswordRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword($id, UserPasswordRequest $request)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return $this->responseNotFound('Teacher with the given id not found.');
        }

        try {
            $teacher->update([
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
     * Delete the teacher data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return $this->responseNotFound('Teacher with the given id not found.');
        }

        try {
            $teacher->delete();

            cache()->forget('teacher_dp_' . $id);
            cache()->rememberForever('teacher_dp_' . $id, function () {
                return false;
            });

            return $this->responseSuccess('Teacher deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the profile picture image of the given teacher id.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return $this->responseNotFound('Teacher with the given id not found.');
        }

        try {
            $teacher->getMedia('profile_pictures')->first()->delete();

            cache()->forget('teacher_dp_' . $id);
            cache()->rememberForever('teacher_dp_' . $id, function () {
                return false;
            });

            return $this->responseSuccess('Profile image updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the teachers.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $teachers = Teacher::has('track')
            ->with('track:id,name')
            ->select(['id', 'first_name', 'last_name', 'email', 'track_id', 'is_active'])
            ->withCount(['class' => function ($query) {
                $query->select(\DB::raw('count(class_teacher.id)'));
            }])->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

            return $this->responseSuccess([
            'rows'            => $teachers->toArray()['data'],
            'total'           => $teachers->total(),
            'allData'         => $teachers,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }
}
