<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Services\EvaluatorService;
use App\Services\EvaluatorGradeService;
use App\Models\CompetitionPhase;
use App\Models\Group;
use App\Models\Area;
<<<<<<< Updated upstream
use App\Models\EvaluationChangeLog;
=======
use App\Models\Inscription;
>>>>>>> Stashed changes
use App\Http\Requests\StoreEvaluationRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;
use App\Services\LogService;

class EvaluationService
{

    public function __construct(
        protected EvaluatorService $evaluatorService,
        protected EvaluatorGradeService $evaluatorGradeService,
        protected LogService $logService
    ) {}
    
    /**
     * Editar una evaluación existente
     */
<<<<<<< Updated upstream
    public function updateEvaluationByEvaluationId(int $evaluationId, array $data, int $evaluatorId): ?Evaluation
    {
        $evaluation = Evaluation::with(['inscription', 'group'])->find($evaluationId);
        if (!$evaluation) {
            return null;
        }

        $before = [
            'score' => $evaluation->score,
            'description' => $evaluation->description,
            'status' => $evaluation->status,
        ];

        if (isset($data['score'])) {
=======
      public function updateEvaluationByEvaluationId(int $evaluationId, array $data, int $evaluatorId): ?Evaluation
      {
          $evaluation = Evaluation::find($evaluationId);
          if (!$evaluation) {
              return null;
          }

          $fase = CompetitionPhase::where('active', true)->first();
          if (!$fase) {
              throw new Exception("No hay una fase de competencia activa.");
          }

          if (array_key_exists('score', $data) && $data['score'] !== null) {
>>>>>>> Stashed changes
            $evaluation->score = $data['score'];
          }

          if (array_key_exists('description', $data) && $data['description'] !== null) {
              $evaluation->description = $data['description'];
          }

          
          if (array_key_exists('disqualified', $data) && $data['disqualified'] !== null) {
              $evaluation->disqualified = $data['disqualified'];
          }

          $evaluation->competition_phase_id = $fase->id;

          if ($evaluation->status === Evaluation::STATUS_PENDING) {
              $evaluation->status = Evaluation::STATUS_IN_REVIEW;
          }

<<<<<<< Updated upstream
        $after = [
            'score' => $evaluation->score,
            'description' => $evaluation->description,
            'status' => $evaluation->status,
        ];

        EvaluationChangeLog::create([
            'evaluation_id'  => $evaluation->id,
            'user_id'        => $evaluatorId,
            'previous_score' => $before['score'] ?? 0,
            'new_score'      => $after['score'] ?? 0,
            'description'    => $data['description'] ?? null,
        ]);

        $this->logService->record(
            'evaluation.updated',
            'Evaluation',
            $evaluation->id,
            [
                'area_id' => $evaluation->inscription?->area_id ?? $evaluation->group?->area_id,
                'grade_id' => $evaluation->inscription?->grade_id ?? $evaluation->group?->grade_id,
                'phase' => $evaluation->phase,
                'metadata' => [
                    'before' => $before,
                    'after'  => $after,
                ],
            ]
        );

        return $evaluation;
    }
=======
          if (array_key_exists('status', $data) && $data['status'] !== null) {
              switch ($data['status']) {
                  case Evaluation::STATUS_REJECTED:
                      $evaluation->status = Evaluation::STATUS_REJECTED;
                      $evaluation->disqualified = false;
                      break;
                  case Evaluation::STATUS_APPROVED:
                      $evaluation->status = Evaluation::STATUS_APPROVED;
                      break;
              }
          }
>>>>>>> Stashed changes

          $evaluation->evaluator_id = $evaluatorId;

          $evaluation->save();

          return $evaluation;
      }


    public function getEvaluationsForEvaluator(int $evaluatorId, array $params)
    {
        $grade = $params['grade'] ?? null;
        $areaId = $params['area'] ?? null;
        $search = $params['search'] ?? null;
        $status = $params['status'] ?? null;
        $page = max(1, (int)($params['page'] ?? 1));
        $perPage = min(100, max(1, (int)($params['per_page'] ?? 20)));

        $assignedGradeIds = $this->evaluatorGradeService->findByUserId($evaluatorId)
            ->pluck('grade_id');
          
        $fase = CompetitionPhase::where('active', true)->first();
        if (!$fase) {
            throw new Exception("No hay una fase de competencia activa.");
        }

        $individualQuery = Evaluation::query()
            ->select([
                'evaluations.*',
                'inscriptions.id as inscription_id',
                'olympians.full_name',
                'olympians.identity_document',
                'grades.name as grade_name',
                'areas.name as area_name',
                DB::raw('false as is_group'),
                DB::raw('null as group_id'),
                DB::raw('null as group_name'),
                'competition_phases.phase as phase'
            ])
            ->join('inscriptions', 'evaluations.inscription_id', '=', 'inscriptions.id')
            ->join('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
            ->join('grades', 'inscriptions.grade_id', '=', 'grades.id')
            ->join('areas', 'inscriptions.area_id', '=', 'areas.id')
            ->join('competition_phases', 'evaluations.competition_phase_id', '=', 'competition_phases.id')
            ->whereNull('evaluations.group_id');

            
        if ($fase) {
            $individualQuery->where('evaluations.competition_phase_id', $fase->id);
        }
        if ($areaId) $individualQuery->where('areas.id', $areaId);
        if ($status) $individualQuery->where('evaluations.status', $status);
        if ($grade) $individualQuery->where('grades.name', $grade);
        if ($assignedGradeIds->isNotEmpty()) $individualQuery->whereIn('grades.id', $assignedGradeIds);

        if ($search) {
            $individualQuery->where(function ($q) use ($search) {
                $q->whereRaw('olympians.full_name ILIKE ?', ["%{$search}%"])
                  ->orWhereRaw('olympians.identity_document ILIKE ?', ["%{$search}%"]);
            });
        }

        $groupQuery = Evaluation::query()
            ->select([
                'evaluations.*',
                DB::raw('null as inscription_id'),
                DB::raw('null as full_name'),
                DB::raw('null as identity_document'),
                'grades.name as grade_name',
                'areas.name as area_name',
                DB::raw('true as is_group'),
                'groups.id as group_id',
                'groups.name as group_name',
                'competition_phases.phase as phase'
            ])
            ->join('groups', 'evaluations.group_id', '=', 'groups.id')
            ->join('grades', 'groups.grade_id', '=', 'grades.id')
            ->join('areas', 'groups.area_id', '=', 'areas.id')
            ->join('competition_phases', 'evaluations.competition_phase_id', '=', 'competition_phases.id');

        if ($fase) {
            $groupQuery->where('evaluations.competition_phase_id', $fase->id);
        }
        if ($areaId) $groupQuery->where('areas.id', $areaId);
        if ($status) $groupQuery->where('evaluations.status', $status);
        if ($grade) $groupQuery->where('grades.name', $grade);
        if ($assignedGradeIds->isNotEmpty()) $groupQuery->whereIn('grades.id', $assignedGradeIds);

        if ($search) {
            $groupQuery->where(function ($q) use ($search) {
                $q->whereRaw('groups.name ILIKE ?', ["%{$search}%"]);
            });
        }

        $unionQuery = $individualQuery->unionAll($groupQuery);

        return DB::table(DB::raw("({$unionQuery->toSql()}) as combined"))
            ->mergeBindings($unionQuery->getQuery())
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getEvaluationsForResponsible(int $responsibleId, array $params)
    {
        $grade = $params['grade'] ?? null;
        $search = $params['search'] ?? null;
        $status = $params['status'] ?? null;
        $page = max(1, (int)($params['page'] ?? 1));
        $perPage = min(100, max(1, (int)($params['per_page'] ?? 20)));

        $fase = CompetitionPhase::where('active', true)->first();
        if (!$fase) {
            throw new Exception("No hay una fase de competencia activa.");
        }

        $responsibleAreaIds = Area::where('responsable_id', $responsibleId)->pluck('id');

        $individualQuery = Evaluation::query()
            ->select([
                'evaluations.*',
                'inscriptions.id as inscription_id',
                'olympians.full_name',
                'olympians.identity_document',
                'grades.name as grade_name',
                'areas.name as area_name',
                DB::raw('false as is_group'),
                DB::raw('null as group_id'),
                DB::raw('null as group_name'),
                'competition_phases.phase as phase'
            ])
            ->join('inscriptions', 'evaluations.inscription_id', '=', 'inscriptions.id')
            ->join('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
            ->join('grades', 'inscriptions.grade_id', '=', 'grades.id')
            ->join('areas', 'inscriptions.area_id', '=', 'areas.id')
            ->join('competition_phases', 'evaluations.competition_phase_id', '=', 'competition_phases.id')
            ->whereNull('evaluations.group_id')
            ->whereIn('areas.id', $responsibleAreaIds);

        if ($fase) {
            $individualQuery->where('evaluations.competition_phase_id', $fase->id);
        }
        if ($status) $individualQuery->where('evaluations.status', $status);
        if ($grade) $individualQuery->where('grades.name', $grade);
        if ($search) {
            $individualQuery->where(function ($q) use ($search) {
                $q->whereRaw('olympians.full_name ILIKE ?', ["%{$search}%"])
                  ->orWhereRaw('olympians.identity_document ILIKE ?', ["%{$search}%"]);
            });
        }

        $groupQuery = Evaluation::query()
            ->select([
                'evaluations.*',
                DB::raw('null as inscription_id'),
                DB::raw('null as full_name'),
                DB::raw('null as identity_document'),
                'grades.name as grade_name',
                'areas.name as area_name',
                DB::raw('true as is_group'),
                'groups.id as group_id',
                'groups.name as group_name',
                'competition_phases.phase as phase'
            ])
            ->join('groups', 'evaluations.group_id', '=', 'groups.id')
            ->join('grades', 'groups.grade_id', '=', 'grades.id')
            ->join('areas', 'groups.area_id', '=', 'areas.id')
            ->join('competition_phases', 'evaluations.competition_phase_id', '=', 'competition_phases.id')
            ->whereIn('areas.id', $responsibleAreaIds);

        if ($fase) {
            $groupQuery->where('evaluations.competition_phase_id', $fase->id);
        }
        if ($status) $groupQuery->where('evaluations.status', $status);
        if ($grade) $groupQuery->where('grades.name', $grade);
        if ($search) {
            $groupQuery->where(function ($q) use ($search) {
                $q->whereRaw('groups.name ILIKE ?', ["%{$search}%"]);
            });
        }

        $unionQuery = $individualQuery->unionAll($groupQuery);

        return DB::table(DB::raw("({$unionQuery->toSql()}) as combined"))
            ->mergeBindings($unionQuery->getQuery())
            ->orderBy('id', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Eliminar una evaluación
     */
    public function deleteEvaluation(Evaluation $evaluation): bool
    {
        return DB::transaction(function () use ($evaluation) {
            return $evaluation->delete();
        });
    }

    /**
     * Obtener estadísticas de evaluaciones por fase
     */
    public function getEvaluationStats(string $phase = null): array
    {
        $query = Evaluation::query();

        if ($phase) {
            $query->where('phase', $phase);
        }

        return [
            'total' => $query->count(),
            'average_score' => $query->avg('score'),
            'max_score' => $query->max('score'),
            'min_score' => $query->min('score'),
            'by_status' => $query->groupBy('status')
                ->selectRaw('status, count(*) as count')
                ->pluck('count', 'status')
                ->toArray(),
            'by_type' => [
                'individual' => Evaluation::whereNotNull('inscription_id')->count(),
                'grupal' => Evaluation::whereNotNull('group_id')->count(),
            ]
        ];
    }
<<<<<<< Updated upstream
}
=======

    public function updateAllStatusToApproved(string $phaseId): int
    {
        $responsible = Auth()->user();
        $area = Area::where('responsable_id', $responsible->id)->first();
        
        $evaluationInArea = Evaluation::where('competition_phase_id', $phaseId)
            ->where('status', Evaluation::STATUS_IN_REVIEW)
            ->where(function ($query) use ($area) {
                $query->whereHas('inscription', function ($q) use ($area) {
                    $q->where('area_id', $area->id);
                })->orWhereHas('group', function ($q) use ($area) {
                    $q->where('area_id', $area->id);
                });
            });
        $updatedCount = $evaluationInArea->update([
            'status' => Evaluation::STATUS_APPROVED,
        ]);
        return $updatedCount;
    }
}
>>>>>>> Stashed changes
