<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Grade;
use App\Models\AreaGrade;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AreaGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areaGradesMap = [
            'Astronomía y Astrofísica' => [
                'Primero de Secundaria', 
                'Segundo de Secundaria'
            ],
            'Física' => [
                'Tercero de Secundaria', 
                'Cuarto de Secundaria'
            ],
            'Informática' => [
                'Primero de Secundaria', 
                'Segundo de Secundaria', 
                'Tercero de Secundaria'
            ],
            'Matemática' => [
                'Primero de Secundaria', 
                'Segundo de Secundaria', 
                'Tercero de Secundaria', 
                'Cuarto de Secundaria'
            ],
            'Química' => [
                'Quinto de Secundaria', 
                'Sexto de Secundaria'
            ],
            'Biología' => [
                'Quinto de Secundaria', 
                'Sexto de Secundaria'
            ],
        ];

        foreach ($areaGradesMap as $areaName => $grades) {
            $area = Area::where('name', $areaName)->first();
            if (!$area) continue;

            foreach ($grades as $gradeName) {
                $grade = Grade::where('name', $gradeName)->first();
                if (!$grade) continue;

                AreaGrade::updateOrCreate([
                    'area_id' => $area->id,
                    'grade_id' => $grade->id,
                ]);
            }
        }
    }
}
