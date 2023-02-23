<?php

namespace Database\Seeders;

use App\Models\Track;
use Illuminate\Database\Seeder;

class TrackTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Track::truncate();

        Track::create([
            'name' => 'Track 1',
            'short_description' => 'This is a short description for Track 1.'
        ]);
    }
}
