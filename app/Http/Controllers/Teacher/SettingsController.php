<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\ChangePasswordRequest;
use App\Http\Requests\Teacher\SettingsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the account settings page.
     *
     * @return \Inertia\Response
     */
    public function edit()
    {
        $emailPreferences = auth()->user()->email_preferences;
        if ($emailPreferences == null) {
            $emailPreferences = [
                'newsletter'  => false,
                'promotional' => false,
            ];
        }

        return Inertia::render('Teacher/Settings', [
            'emailPreferences' => $emailPreferences,
            'profilePicture'   => auth()->user()->getProfilePicture(),
        ]);
    }

    /**
     * Update the teacher account settings.
     *
     * @param  \App\Http\Requests\Teacher\SettingsRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(SettingsRequest $request)
    {
        $teacher = auth()->user();

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

            return $this->responseSuccess('Account settings updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }

    /**
     * Update the teacher account settings.
     *
     * @param  \App\Http\Requests\Teacher\ChangePasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        $validCurrentPassword = Hash::check($request->current_password, auth()->user()->password);
        if (!$validCurrentPassword) {
            return $this->responseFailed('Invalid current password.', 201, ['status' => 'failed']);
        }

        try {
            auth()->user()->update([
                'password' => bcrypt($request->new_password),
            ]);

            return $this->responseSuccess('Password changed successfully');
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
        $teacher = auth()->user();
        try {
            $teacher->getMedia('profile_pictures')->first()->delete();

            cache()->forget('teacher_dp_' . auth()->id());
            cache()->rememberForever('teacher_dp_' . auth()->id(), function () {
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
