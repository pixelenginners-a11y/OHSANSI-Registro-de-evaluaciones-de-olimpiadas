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
        User::updateOrCreate(
            ['username' => 'Test Admin'],
            [
                'full_name' => 'Admin',
                'email'     => 'admin@gmail.com',
                'role_id'   => 1,
                'password'  => bcrypt('password'),
                'active'    => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'Test Evaluator'],
            [
                'full_name' => 'Evaluator',
                'email'     => 'evaluator@gmail.com',
                'role_id'   => 2,
                'password'  => bcrypt('password'),
                'active'    => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'Test Academic'],
            [
                'full_name' => 'Academic',
                'email'     => 'academic@gmail.com',
                'role_id'   => 3,
                'password'  => bcrypt('password'),
                'active'    => true,
            ]
        );

        User::factory(20)->create();
    }
}
