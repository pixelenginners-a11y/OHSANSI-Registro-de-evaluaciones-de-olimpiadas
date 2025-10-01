<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Grade;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            'Primero de Secundaria',
            'Segundo de Secundaria',
            'Tercero de Secundaria',
            'Cuarto de Secundaria',
            'Quinto de Secundaria',
            'Sexto de Secundaria',
        ];

        foreach ($grades as $gradeName) {
            Grade::firstOrCreate(
                ['name' => $gradeName],
                ['description' => "$gradeName description"]
            );
        }
    }
}
