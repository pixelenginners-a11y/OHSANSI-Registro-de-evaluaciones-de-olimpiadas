<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Services\EvaluatorService;
use App\Services\EvaluatorGradeService;
use App\Models\Area;
use App\Http\Requests\StoreEvaluationRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;

class EvaluationService
{

    public function __construct(
        protected EvaluatorService $evaluatorService,
        protected EvaluatorGradeService $evaluatorGradeService
    ) {}
    
    /**
     * Editar una evaluación existente
     */
    public function updateEvaluationByEvaluationId(int $evaluationId, array $data, int $evaluatorId): ?Evaluation
    {
        $evaluation = Evaluation::find($evaluationId);
        if (!$evaluation) {
            return null;
        }

        if (isset($data['score'])) {
            $evaluation->score = $data['score'];
        }

        if (isset($data['description'])) {
            $evaluation->description = $data['description'];
        }

        if (isset($data['status'])) {
            $evaluation->status = $data['status'];
        }

        $evaluation->evaluator_id = $evaluatorId;

        $evaluation->save();

        return $evaluation;
    }


    // public function getEvaluationsForEvaluator(int $evaluatorId, array $params)
    // {
    //     $phase = $params['phase'] ?? null;
    //     $grade = $params['grade'] ?? null;
    //     $area  = $params['area'] ?? null;
    //     $search = $params['search'] ?? null;
    //     $status = $params['status'] ?? null;
    //     $page = max(1, (int) ($params['page'] ?? 1));
    //     $perPage = min(100, max(1, (int) ($params['per_page'] ?? 9)));

    //     $assignedGradeIds = $this->evaluatorGradeService->findByUserId($evaluatorId)
    //         ->pluck('grade_id');

    //     $query = Evaluation::query()
    //         ->select([
    //             'evaluations.*',
    //             'inscriptions.id as inscription_id',
    //             'groups.id as group_id',
    //             'groups.name as group_name',
    //             'olympians.full_name as full_name',
    //             'olympians.identity_document as identity_document',
    //             'grades.name as grade_name',
    //         ])
    //         ->leftJoin('inscriptions', 'evaluations.inscription_id', '=', 'inscriptions.id')
    //         ->leftJoin('groups', 'evaluations.group_id', '=', 'groups.id')
    //         ->leftJoin('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
    //         ->leftJoin('grades', 'inscriptions.grade_id', '=', 'grades.id')
    //         ->leftJoin('areas as areas_ins', 'inscriptions.area_id', '=', 'areas_ins.id')
    //         ->leftJoin('areas as areas_grp', 'groups.area_id', '=', 'areas_grp.id')
    //         ->addSelect(DB::raw('COALESCE(areas_ins.name, areas_grp.name) as area_name'))
    //         ->addSelect(DB::raw('CASE WHEN evaluations.group_id IS NOT NULL THEN true ELSE false END as is_group'));

    //     if ($phase) $query->where('evaluations.phase', $phase);
    //     if ($status) $query->where('evaluations.status', $status);
    //     if ($grade) $query->where('grades.name', $grade);
    //     if ($area) {
    //         $query->where(function($q) use ($area) {
    //             $q->where('areas_ins.name', $area)
    //               ->orWhere('areas_grp.name', $area);
    //         });
    //     }
    //     if ($search) {
    //         $query->where(function($q) use ($search) {
    //             $q->whereRaw('olympians.full_name ILIKE ?', ["%{$search}%"])
    //               ->orWhereRaw('olympians.identity_document ILIKE ?', ["%{$search}%"]);
    //         });
    //     }

    //     if ($assignedGradeIds->isNotEmpty()) {
    //         $query->where(function($q) use ($assignedGradeIds) {
    //             $q->whereIn('inscriptions.grade_id', $assignedGradeIds)
    //               ->orWhereIn('groups.grade_id', $assignedGradeIds);
    //         });
    //     }

    //     return $query->orderBy('evaluations.id', 'desc')
    //                 ->paginate($perPage, ['*'], 'page', $page);
    // }


    public function getEvaluationsForEvaluator(int $evaluatorId, array $params)
{
    $phase = $params['phase'] ?? null;
    $grade = $params['grade'] ?? null;
    $areaId = $params['area'] ?? null;
    $search = $params['search'] ?? null;
    $status = $params['status'] ?? null;
    $page = max(1, (int)($params['page'] ?? 1));
    $perPage = min(100, max(1, (int)($params['per_page'] ?? 20)));

    $assignedGradeIds = $this->evaluatorGradeService->findByUserId($evaluatorId)
        ->pluck('grade_id');

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
            DB::raw('null as group_name')
        ])
        ->join('inscriptions', 'evaluations.inscription_id', '=', 'inscriptions.id')
        ->join('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
        ->join('grades', 'inscriptions.grade_id', '=', 'grades.id')
        ->join('areas', 'inscriptions.area_id', '=', 'areas.id')
        ->whereNull('evaluations.group_id');

    if ($areaId) $individualQuery->where('areas.id', $areaId);
    if ($phase) $individualQuery->where('evaluations.phase', $phase);
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
            'groups.name as group_name'
        ])
        ->join('groups', 'evaluations.group_id', '=', 'groups.id')
        ->join('grades', 'groups.grade_id', '=', 'grades.id')
        ->join('areas', 'groups.area_id', '=', 'areas.id');

    if ($areaId) $groupQuery->where('areas.id', $areaId);
    if ($phase) $groupQuery->where('evaluations.phase', $phase);
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



    public function getAllEvaluations(array $params)
    {
        $phase = $params['phase'] ?? null;
        $status = $params['status'] ?? null;
        $grade  = $params['grade'] ?? null;
        $area   = $params['area'] ?? null;
        $search = $params['search'] ?? null;
        $page = max(1, (int) ($params['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($params['per_page'] ?? 20)));

        $query = Evaluation::query()
            ->select([
                'evaluations.*',
                'inscriptions.id as inscription_id',
                'groups.id as group_id',
                'groups.name as group_name',
                'olympians.full_name as full_name',
                'olympians.identity_document as identity_document',
                'grades.name as grade_name',
            ])
            ->leftJoin('inscriptions', 'evaluations.inscription_id', '=', 'inscriptions.id')
            ->leftJoin('groups', 'evaluations.group_id', '=', 'groups.id')
            ->leftJoin('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
            ->leftJoin('grades', 'inscriptions.grade_id', '=', 'grades.id')
            ->leftJoin('areas as areas_ins', 'inscriptions.area_id', '=', 'areas_ins.id')
            ->leftJoin('areas as areas_grp', 'groups.area_id', '=', 'areas_grp.id')
            ->addSelect(DB::raw('COALESCE(areas_ins.name, areas_grp.name) as area_name'));

        if ($phase) $query->where('evaluations.phase', $phase);
        if ($status) $query->where('evaluations.status', $status);
        if ($grade) $query->where('grades.name', $grade);
        if ($area) {
            $query->where(function($q) use ($area) {
                $q->where('areas_ins.name', $area)
                  ->orWhere('areas_grp.name', $area);
            });
        }
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereRaw('olympians.full_name ILIKE ?', ["%{$search}%"])
                  ->orWhereRaw('olympians.identity_document ILIKE ?', ["%{$search}%"]);
            });
        }

        return $query->orderBy('evaluations.id', 'desc')
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
}