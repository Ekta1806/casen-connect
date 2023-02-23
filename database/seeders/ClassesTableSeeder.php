<?php

namespace Database\Seeders;

use App\Models\Track;
use App\Models\Classes;
use App\Models\Teacher;
use App\Models\Student\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Classes::truncate();

        $class = Classes::create([
            'name' => 'Class One',
            'track_id' => Track::first()->id,
            'teacher_id' => Teacher::first()->id,
            'description' => 'This is a short description for Class One.',
        ]);

        DB::table('class_student')->truncate();
        $class->students()->attach(Student::first()->id);
    }
}
