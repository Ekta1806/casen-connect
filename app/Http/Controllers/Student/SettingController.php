<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\SettingRequest;
use App\Models\Student\Student;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Current page title
     *
     * @var string
     */
    public $_pageTitle = 'Settings';

    /**
     * Display a listing of the settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $emailPreferences = auth()->user()->email_preferences;
        if ($emailPreferences == null) {
            $emailPreferences = [
                'newsletter'  => false,
                'promotional' => false,
            ];
        }
        $is_private = auth()->user()->is_private;
        return Inertia::render('Student/Settings/Settings', [
            'emailPreferences' => $emailPreferences,
            'is_private'       => $is_private,
            'profilePicture'   => auth()->user()->getProfilePicture(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SettingRequest $request)
    {
        try {
            $student = auth()->user();

            if ($request->file('profile_image')) {
                $pic = $student->fresh()->getMedia('profile_pictures')->first();
                if ($pic) {
                    $pic->delete();
                }
                $student->fresh()->addMediaFromRequest('profile_image')->toMediaCollection('profile_pictures');
            }

            if ($request->current_password) {
                $password = Hash::check($request->current_password, auth()->user()->password);

                if (!$password) {
                    return response()->json([
                        'status'  => 'failed',
                        'message' => 'Incorrect current password.',
                    ]);
                }
            }
            $request->is_private == "1" ? auth()->user()->update(['is_private' => 1]) : auth()->user()->update(['is_private' => 0]);

            if ($request->current_password && $request->new_password) {
                auth()->user()->update([
                    'password' => bcrypt($request->new_password),
                ]);
            }

            $request['email_preferences'] = [
                "promotional" => $request->receive_promotional_email == "true" ? true : false,
                "newsletter"  => $request->receive_newsletter_email == "true" ? true : false,
            ];
            $student->update($request->all());

            return $this->responseSuccess([
                'status'  => 'success',
                'message' => 'Account settings updated successfully.',
            ]);
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
    }

    /**
     * Remove the profile image from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $student = Student::find($id);
        $student->getMedia('profile_pictures')->first()->delete();

        return $this->responseSuccess([
            'status'  => 'success',
            'message' => 'Profile image deleted successfully.',
        ]);
    }
}
