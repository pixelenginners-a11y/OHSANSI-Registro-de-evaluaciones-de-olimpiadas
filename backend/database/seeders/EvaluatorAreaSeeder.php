<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EvaluatorArea;
use App\Models\User;

class EvaluatorAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evaluators = User::whereHas('role', fn($q) => $q->where('name', 'Evaluador'))->get();

        foreach ($evaluators as $index => $evaluator) {
            $areaId = ($index % 5) + 1;
            EvaluatorArea::create([
                'user_id' => $evaluator->id,
                'area_id' => $areaId,
            ]);
        }
    }
}
