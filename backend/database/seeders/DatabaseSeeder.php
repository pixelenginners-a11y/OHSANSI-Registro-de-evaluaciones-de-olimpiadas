<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CompetitionPhasesSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(AreaSeeder::class);
        $this->call(GradeSeeder::class);
        $this->call(AreaGradeSeeder::class);
        $this->call(OlimpiadaSeeder::class);

        $this->call(OlympianSeeder::class);
        $this->call(GroupSeeder::class);
        $this->call(InscriptionSeeder::class);
        $this->call(GroupMemberSeeder::class);

        $this->call(EvaluatorAreaSeeder::class);
        $this->call(EvaluatorGradeSeeder::class);
    }
}
