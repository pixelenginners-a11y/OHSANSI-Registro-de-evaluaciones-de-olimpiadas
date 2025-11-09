<?php

namespace App\Services;

use App\Models\EvaluatorGrade;
use Illuminate\Support\Collection;

class EvaluatorGradeService
{
  public function findByUserId(int $userId): ?Collection
  {
    return EvaluatorGrade::where('evaluator_id', $userId)->get();
  }

  public function assign(int $userId, array $grades): Collection
  {
    $evaluatorGrades = [];

    foreach ($grades as $gradeId) {
      $evaluatorGrades[] = EvaluatorGrade::create([
          'evaluator_id' => $userId,
          'grade_id' => $gradeId
      ]);
    }
    return collect($evaluatorGrades);
  }

  public function updateGrades(int $userId, array $gradeIds): Collection
  {
      $this->remove($userId);
      return $this->assign($userId, $gradeIds);
  }

    public function remove(int $userId): bool
    {
        $deleted = EvaluatorGrade::where('evaluator_id', $userId)->delete();
        return $deleted > 0;
    }
}