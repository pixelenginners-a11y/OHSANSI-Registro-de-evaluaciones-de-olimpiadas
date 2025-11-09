<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Olympian;
use App\Models\Area;
use App\Models\Grade;
use App\Models\Inscription;
use Faker\Factory as Faker;

class OlympianSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $areas = Area::all();
        $grades = Grade::all();

        for ($i = 0; $i < 50; $i++) {
            $olympian = Olympian::create([
                'full_name' => $faker->name(),
                'identity_document' => $faker->unique()->numerify('########'),
                'legal_guardian_contact' => $faker->optional()->phoneNumber(),
                'educational_institution' => $faker->company(),
                'department' => $faker->state(),
                'academic_tutor' => $faker->optional()->name(),
            ]);
            
            $area = $areas->random();
            $grade = $grades->random();
        }
    }
}
