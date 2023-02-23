<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Admin::truncate();

        Admin::create([
            'first_name' => 'Admin',
            'last_name' => 'One',
            'email' => 'admin@example.com',
            'password' => bcrypt('Password'),
            'contact_number' => '9876543210',
        ]);
    }
}
