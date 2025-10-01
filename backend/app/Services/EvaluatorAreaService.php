<?php

namespace App\Services;

use App\Models\EvaluatorArea;

class EvaluatorAreaService
{
  public function findByUserId(int $userId): ?EvaluatorArea
  {
    return EvaluatorArea::where('user_id', $userId)->first();
  }

  public function assign(int $userId, int $areaId): EvaluatorArea
  {
    return EvaluatorArea::create([
      'user_id' => $userId,
      'area_id' => $areaId
    ]);
  }

  public function updateArea(int $userId, int $areaId): ?EvaluatorArea
  {
    $evaluatorArea = $this->findByUserId($userId);
    if ($evaluatorArea) {
      $evaluatorArea->update([
        'area_id' => $areaId
      ]);
    }
    return $evaluatorArea;
  }

  public function remove(int $userId): bool
  {
    $evaluatorArea = $this->findByUserId($userId);
    if ($evaluatorArea) {
      return $evaluatorArea->delete();
    }
    return false;
  }

  public function getAreaIdByUserId(int $userId): ?int
  {
    $evaluatorArea = $this->findByUserId($userId);
    return $evaluatorArea ? $evaluatorArea->area_id : null;
  }
}