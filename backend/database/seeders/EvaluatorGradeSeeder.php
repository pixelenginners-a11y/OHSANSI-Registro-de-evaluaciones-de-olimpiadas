<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EvaluatorGrade;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvaluatorGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evaluators = User::whereHas('role', fn($q) => $q->where('name', 'Evaluador'))->get();
        $allGradeIds = [1, 2, 3, 4, 5, 6];

        foreach ($evaluators as $index => $evaluator) {
            $startIndex = rand(0, 3);
            
            $gradeIds = array_slice($allGradeIds, $startIndex, 3);
            
            foreach ($gradeIds as $gradeId) {
                EvaluatorGrade::firstOrCreate([
                    'evaluator_id' => $evaluator->id,
                    'grade_id' => $gradeId,
                ]);
            }
        }
    }
}
