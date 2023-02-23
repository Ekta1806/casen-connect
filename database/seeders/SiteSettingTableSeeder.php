<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SiteSetting::truncate();

        SiteSetting::create([
            'title' => 'Daily Question Timing',
            'name' => 'daily_question_timing',
            'value' => '09:00',
        ]);

        SiteSetting::create([
            'title' => 'View other students posts on this day',
            'name' => 'view_posts_on',
            'value' => 'Friday',
        ]);
    }
}
