<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        
        User::factory()->create([
            'full_name' => 'Admin',
            'username' => 'Test Admin',
            'email' => 'admin@gmail.com',
            'role_id' => 1,
        ]);
        
        User::factory()->create([
            'full_name' => 'Evaluator',
            'username' => 'Test Evaluator',
            'email' => 'evaluator@gmail.com',
            'role_id' => 2,
        ]);

        User::factory()->create([
            'full_name' => 'Academic',
            'username' => 'Test Academic',
            'email' => 'academic@gmail.com',
            'role_id' => 3,
        ]);

        User::factory(20)->create();
    }
}
