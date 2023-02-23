<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Level::truncate();

        for ($i = 1; $i <= 5; $i++) {
            Level::create([
                'name' => "Level {$i}",
                'short_description' => "Short description for Level {$i}",
            ]);
        }
    }
}
