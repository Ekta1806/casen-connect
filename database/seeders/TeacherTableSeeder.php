<?php

namespace Database\Seeders;

use App\Models\Track;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class TeacherTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Teacher::truncate();

        Teacher::create([
            'track_id' => Track::first()->id,
            'first_name' => 'Teacher',
            'last_name' => 'One',
            'email' => 'teacher@example.com',
            'password' => bcrypt('Password'),
            'contact_number' => '9876543210',
            'is_active' => 1
        ]);
    }
}
