<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteSettingsRequest;
use App\Models\SiteSetting;
use Inertia\Inertia;

class SiteSettingsController extends Controller
{
    /**
     * Display the site settings with pre-filled form.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $settings = [
            'daily_question_timing' => optional(SiteSetting::where('name', 'daily_question_timing')->first())->value,
            'view_posts_on'         => optional(SiteSetting::where('name', 'view_posts_on')->first())->value,
        ];

        return Inertia::render('Admin/SiteSettings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the site settings.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(SiteSettingsRequest $request)
    {
        $allSettings = $request->all();

        try {
            foreach ($allSettings as $name => $value) {
                $setting = SiteSetting::where('name', $name)->first();
                if (!$setting) {
                    SiteSetting::create([
                        'name'  => $name,
                        'value' => $value,
                        'title' => $name,
                    ]);
                } else {
                    $setting->update(['value' => $value]);
                }
            }

            return $this->responseSuccess('Site Settings updated successfully.');
        } catch (\Exception $e) {
            info($e->getMessage());
            info($e->getTraceAsString());

            return $this->responseFailed();
        }
    }
}
