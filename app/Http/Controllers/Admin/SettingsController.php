<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChangePasswordRequest;
use App\Http\Requests\Admin\SettingsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the admin account settings page.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        return Inertia::render('Admin/Settings', [
            'profilePicture' => auth()->guard('admin')->user()->getProfilePicture(),
        ]);
    }

    /**
     * Update the admin account settings.
     *
     * @param  \App\Http\Requests\Admin\SettingsRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(SettingsRequest $request)
    {
        $admin = auth()->guard('admin')->user();

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

            return $this->responseSuccess('Account settings updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Update the password of the admin.
     *
     * @param  \App\Http\Requests\Admin\ChangePasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $validCurrentPassword = Hash::check($request->current_password, auth()->guard('admin')->user()->password);
        if (!$validCurrentPassword) {
            return $this->responseFailed('Invalid current password.', 201, ['status' => 'failed']);
        }

        try {
            auth()->guard('admin')->user()->update([
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
     * Delete the profile picture image of the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAvatar()
    {
        $admin = auth()->guard('admin')->user();
        $image = $admin->getMedia('profile_pictures')->first();
        if (!$image) {
            return $this->responseNotFound('Avatar image does not exist.');
        }

        try {
            $image->delete();

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
}
