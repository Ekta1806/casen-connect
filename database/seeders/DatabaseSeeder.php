<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this->call(TrackTableSeeder::class);
        $this->call(AdminTableSeeder::class);
        $this->call(TeacherTableSeeder::class);
        $this->call(StudentTableSeeder::class);
        $this->call(ClassesTableSeeder::class);
        $this->call(LevelTableSeeder::class);
        $this->call(SiteSettingTableSeeder::class);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
