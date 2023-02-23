<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ClassesRequest;
use App\Http\Requests\Teacher\SendInvitesRequest;
use App\Mail\InviteStudent;
use App\Models\Classes;
use App\Models\SendInvite;
use App\Models\Student\Like;
use App\Models\Student\Post;
use App\Models\Student\Student;
use App\Models\Student\ClassStudent;
use App\Models\ClassTeacher;
use App\Models\Teacher;
use App\Models\Track;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\ClassPost;
use App\Models\Admin;
use App\Models\AdminPost;
use Carbon\Carbon;
use App\Models\SiteSetting;

class ClassesController extends Controller
{
    /**
     * Display all the classes of the authenticated teacher.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Teacher/Class/List');
    }

    /**
     * Display the form to add a new class.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Teacher/Class/Create', [
            'tracks' =>   auth()->user()->track()->select('name as label', 'id as value')->latest()->get(),
            'teachers' => Teacher::where('track_id', auth()->user()->track_id)
            ->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get()
        ]);
    }

    /**
     * Store the new class data.
     *
     * @param  \App\Http\Requests\Teacher\ClassesRequest  $request
     * @return \Illuminate\Http\JsonResponse
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
        $teacher = auth()->guard('teacher')->user();
        $studentsPosts = ClassStudent::where('class_id',$id)->pluck('student_id');
        $class = Classes::where('id',$id)->with('track','students')->first();
        $students = Post::whereIn('created_by',$studentsPosts)->with(['comments','media','user.media','likes' => function ($query) {
            $query->where("teacher_id", Auth::user()->id);
        }])->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'DESC')->latest()->simplePaginate(3);
        
         
        $data['student']= Student::whereIn('id',$studentsPosts)->get()->toArray();
        $data['admin']= Admin::get()->toArray();
        $taggedData = array_merge($data['admin'],$data['student']);
        $teachersId = ClassTeacher::where('class_id',$id)->pluck('teacher_id');
        $classTeacher = Teacher::whereIn('id',$teachersId)->get();
        $teacherId = ClassTeacher::where('class_id',$id)->where('teacher_id',Auth::user()->id)->first();

        $posts = ClassPost::whereIn('teacher_id', $teachersId)
            ->withCount('comments', 'likes')
            ->with(['class:id,name', 'class' =>function($q) use ($teacherId){
                 $q->with('track', 'students');
            }, 'teacher.media', 'likes' => function ($query) {
                $query->where("teacher_id", Auth::user()->id);
            }])->orderBy('id', 'DESC')->latest()->simplePaginate(3);

        if (request()->has('type')) {
            return $this->responseSuccess(['class_id' => $id,'students' => $students, 'posts' => $posts]);
        }

        return Inertia::render('Teacher/Class/Show', [
            'posts'                 => $posts,
            'teacher'               => $teacher,
            'teacherProfilePicture' => $teacher->getProfilePicture(),
            'students' => $students,
            'class_id' => $id,
            'class'    => $class,
            'taggedData'=> $taggedData,
            'classTeacher' => $classTeacher
        ]);
    }

    /**
     * Display the edit class form of the given class id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $class = Classes::with(['track', 'students'])->find($id);

        $teacherIds = ClassTeacher::where('class_id',$class->id)->pluck('teacher_id');

        $teachers = Teacher::whereIn('id',$teacherIds)->orWhere('id','!=',$class->teacher_id)->where('track_id', auth()->user()->track_id)
        ->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get();

        if (!$class) {
            abort(404);
        }
        return Inertia::render('Teacher/Class/Edit', [
            'class'  => $class,
            'teachers' => $teachers,
            'id' => Teacher::whereIn('id', $teacherIds)->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"),'id as value')->get(),
            'tracks' => auth()->user()->track()->select('name as label', 'id as value')->latest()->get(),
        ]);
    }

    /**
     * Update the class data of the given class id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Teacher\ClassesRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, ClassesRequest $request)
    {
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

        try {
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
     * Send class invitation email to the given email addresses.
     *
     * @param  integer  $id
     * @param  App\Http\Requests\Teacher\SendInvitesRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendInvites($id, SendInvitesRequest $request)
    {
        $class = Classes::find($id);
        if (!$class) {
            return $this->responseNotFound('Class with the given id not found.');
        }

        try {
            $sentEmailCount = 0;
            foreach ($request->email as $email) {
                $student = Student::where('email', $email)->withCount('classes')->first();

                $studentExists = false;
                if ($student) {
                    $studentExists = true;
                }
                if ($student === null || ($student && ($student->classes_count === 0 || !$student->isMemberOfClassInSameTrack($class->track_id)))) {
                    $invite = SendInvite::create([
                        'class_id'   => $class->id,
                        'track_id'   => $class->track_id,
                        'teacher_id' => auth()->user()->id,
                        'email'      => $email,
                        'token'      => Str::random(32),
                    ]);

                    Mail::to($email)
                        ->send(new InviteStudent($invite, $studentExists));

                    $sentEmailCount++;
                }
            }

            if ($sentEmailCount == 0) {
                return response()->json([
                    'status'  => 'failed',
                    'message' => 'Already registered',
                ]);
            }

            return $this->responseSuccess("Invites sent successfully to {$sentEmailCount} email address.");
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed('Something went wrong', 500, ['status' => 'errorInCode']);
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
            return $this->responseNotFound('Class with the given id not found.');
        }

        $student = Student::find($studentId);
        if (!$student) {
            return $this->responseNotFound('Student with the given id not found.');
        }

        if ($student->classes()->count() <= 1) {
            return $this->responseFailed('Please add this student to at least 1 class.', 201);
        }

        try {
            Student::detach($studentId);

            return $this->responseSuccess('Student removed successfully from the class');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the classes of the authenticated teacher.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function fetch()
    {
        $classesTeacher = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
        $classes = Classes::with(['teachers', 'track:id,name'])->whereIn('id',$classesTeacher)->has('track')
            ->with('track:id,name')
            ->withCount('students')->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));
        return $this->responseSuccess([
            'rows'            => $classes->toArray()['data'],
            'total'           => $classes->total(),
            'allData'         => $classes,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ], 201);
    }

    public function storeLikes($id, $check)
    {
        try {
            $post = Post::find($id);
            if ($check == 'true') {
                $like = Like::create([
                    'post_id'    => $post->id,
                    'liked_by'   => 0,
                    'teacher_id' => Auth::user()->id,
                ]);

                return $this->responseSuccess($like);
            } else {
                $like = Like::where('post_id', $post->id)
                    ->where('teacher_id', Auth::user()->id)->delete();

                return $this->responseSuccess($like);

            }
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function teacherProfile($id)
    {
        try {
            $teacher = Teacher::where('id', $id)->with(['classPosts' => function ($query) {
                $query->where('teacher_id', auth()->user()->id)
                    ->withCount(['likes', 'comments'])->orderBy('id', "DESC");
            }, 'classPosts.likes' => function ($query) {
                $query->where('teacher_id', auth()->user()->id);
            }, 'classPosts.media', 'classPosts.comments.creator', 'media'])->first();
            return Inertia::render('Teacher/Profile/Profile', ['teacher' => $teacher]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminProfile($id)
    {
        try {
            $classesId = ClassTeacher::where('teacher_id',auth()->guard('teacher')->user()->id)->pluck('class_id');
            $name      = Admin::where('id', $id)->with('media')->first();
            $posts = AdminPost::withCount('comments','likes')
                    ->with(['admin.media','media','likes' => function ($query) {
                        $query->where("teacher_id", auth()->id() );
                    },'class'])->orderBy('id', 'DESC')->get();

            $students  = Student::has('classes')->get()->toArray();

            $now       = Carbon::now();
            $day       = SiteSetting::where('name', 'view_posts_on')->first();
            $isFriday = $now->format('l') == $day->value;

            return Inertia::render('Teacher/Profile/AdminProfile', ['admin' => $posts, 'name' => $name, 'students' => $students, 'isFriday' => $isFriday]);
        } catch (\Execption $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function fetchTeacher($track_id){
        $teachers = Teacher::where('track_id',$track_id)->select(\DB::raw("CONCAT(first_name, ' ', last_name) as label"), 'id as value')->get();
        return $this->responseSuccess([
            'teachers'            => $teachers,
        ], 201);
    }
}
