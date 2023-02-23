<?php

namespace Database\Seeders;

use App\Models\Student\Student;
use Illuminate\Database\Seeder;

class StudentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Student::truncate();

        Student::create([
            'first_name' => 'Student',
            'last_name' => 'One',
            'email' => 'student@example.com',
            'password' => bcrypt('Password'),
            'level_id' => 1,
            'is_active' => 1
        ]);
    }
}
