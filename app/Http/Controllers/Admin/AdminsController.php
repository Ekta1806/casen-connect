<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminsRequest;
use App\Http\Requests\Admin\UserPasswordRequest;
use App\Models\Admin;
use Inertia\Inertia;
use App\Models\Classes;
use App\Models\ClassTeacher;

class AdminsController extends Controller
{
    /**
     * Display a list of all the admins.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/Admins/List');
    }

    public function classesTeacher(){
        $classes = Classes::all();
        
        foreach($classes as $class){
            classTeacher::updateOrCreate([
                'teacher_id' => $class->teacher_id,
                'class_id' => $class->id
            ]);
        }
    }

    /**
     * Display the form to add a new admin.
     *
     * @return  \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Admins/Create');
    }

    /**
     * Store the new admin data.
     *
     * @param  \App\Http\Requests\Admin\AdminsRequest  $request
     * @return \Illuminate\Http7JsonResponse
     */
    public function store(AdminsRequest $request)
    {
        $request['password'] = bcrypt($request->password);

        try {
            $admin = Admin::create($request->all());
            if ($request->file('profile_picture')) {
                $admin->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');

                cache()->rememberForever('admin_dp_' . $admin->id, function () use ($admin) {
                    return $admin->getMedia('profile_pictures')->first()->getFullUrl();
                });
            } else {
                cache()->forget('admin_dp_' . $admin->id);
                cache()->rememberForever('admin_dp_' . $admin->id, function () use ($admin) {
                    return false;
                });
            }

            return $this->responseSuccess('Admin added successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Display the admin data of the given admin id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function show($id)
    {
        $admin = Admin::select(['id', 'first_name', 'last_name', 'email', 'contact_number'])->find($id);
        if (!$admin) {
            abort(404);
        }

        return Inertia::render('Admin/Admins/Show', [
            'admin'          => $admin,
            'profilePicture' => $admin->getProfilePicture(),
        ]);
    }

    /**
     * Display the edit admin form of the given admin id.
     *
     * @param  integer  $id
     * @return void|\Inertia\Response
     */
    public function edit($id)
    {
        $admin = Admin::select(['id', 'first_name', 'last_name', 'email', 'contact_number'])->find($id);
        if (!$admin) {
            abort(404);
        }

        return Inertia::render('Admin/Admins/Edit', [
            'admin'          => $admin,
            'profilePicture' => $admin->getProfilePicture(),
        ]);
    }

    /**
     * Update the admin data of the given admin id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\AdminsRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($id, AdminsRequest $request)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return $this->responseNotFound('Admin with the given id not found.');
        }

        try {
            $admin->update($request->all());
            if ($request->file('profile_picture')) {
                $pic = $admin->fresh()->getMedia('profile_pictures')->first();
                if ($pic) {
                    $pic->delete();
                }

                $admin->fresh()->addMediaFromRequest('profile_picture')->toMediaCollection('profile_pictures');

                cache()->forget('admin_dp_' . $admin->id);
                cache()->rememberForever('admin_dp_' . $admin->id, function () use ($admin) {
                    return $admin->getMedia('profile_pictures')->first()->getFullUrl();
                });
            }

            return $this->responseSuccess('Admin updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Change the password of the given admin id.
     *
     * @param  integer  $id
     * @param  \App\Http\Requests\Admin\UserPasswordRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword($id, UserPasswordRequest $request)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return $this->responseNotFound('Admin with the given id not found.');
        }

        try {
            $admin->update([
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
     * Delete the admin data of the given id.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return $this->responseNotFound('Admin with the given id not found.');
        }

        try {
            cache()->forget('admin_dp_' . $admin->id);

            $admin->delete();

            return $this->responseSuccess('Admin deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Delete the profile picture image of the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return $this->responseNotFound('Admin with the given id not found.');
        }

        try {
            $admin->getMedia('profile_pictures')->first()->delete();

            cache()->forget('admin_dp_' . $admin->id);
            cache()->rememberForever('admin_dp_' . $admin->id, function () {
                return false;
            });

            return $this->responseSuccess('Profile image deleted successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Fetch all the admins.
     *
     * @return \Inertia\Response
     */
    public function fetch()
    {
        $admins = Admin::select(['id', 'first_name', 'last_name', 'email'])
            ->orderBy('id', 'DESC')->paginate(config('app.pagination_count'));

        return $this->responseSuccess([
            'rows'            => $admins->toArray()['data'],
            'total'           => $admins->total(),
            'allData'         => $admins,
            'perPageRowCount' => (int) config('app.pagination_count') ?? 10,
        ]);
    }
}
