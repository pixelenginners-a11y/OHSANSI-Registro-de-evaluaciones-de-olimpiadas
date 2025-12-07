<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;
use App\Models\CompetitionPhase;
use App\Services\EvaluationService;
use App\Models\Evaluation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class EvaluationController extends Controller
{
    public function __construct(private EvaluationService $evaluationService) {}

    /**
     * Listar evaluaciones con filtros opcionales
     * filtros posibles: evaluator_id, phase, status, grade, area, search
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $evaluator_id = $request->user()->id;

            $filters = $request->only([
                'phase',
                'status',
                'grade',
                'area',
                'search',
                'page',
                'per_page',
            ]);

            if (empty($evaluator_id)) {
                return response()->json([
                    'message' => 'Necesita ser un evaluador válido para obtener las evaluaciones.'
                ], 400);
            }

            $evaluations = $this->evaluationService->getEvaluationsForEvaluator(
                $evaluator_id,
                $filters
            );

            return response()->json([
                'message' => 'Evaluaciones obtenidas correctamente',
                'data' => $evaluations
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las evaluaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function indexResponsible(Request $request): JsonResponse
    {
        $responsibleId = $request->user()->id;
        try {
            $filters = $request->only([
                'phase',
                'status',
                'grade',
                'search',
                'page',
                'per_page',
            ]);

            $evaluations = $this->evaluationService->getEvaluationsForResponsible(
                $responsibleId,
                $filters
            );

            return response()->json([
                'message' => 'Evaluaciones obtenidas correctamente',
                'data' => $evaluations
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las evaluaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar una evaluación específica
     */
    public function show(int $id): JsonResponse
    {
        try {
            $evaluation = Evaluation::with([
                'inscription.olympian',
                'group.members.olympian',
                'evaluator'
            ])->find($id);

            if (!$evaluation) {
                return response()->json(['message' => 'Evaluación no encontrada'], 404);
            }

            return response()->json([
                'message' => 'Evaluación obtenida correctamente',
                'data' => $evaluation
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la evaluación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar una evaluación
     */
    public function update(UpdateEvaluationRequest $request, int $id): JsonResponse
    {
        try {
            $evaluatorId = auth()->id();
            $evaluation = $this->evaluationService->updateEvaluationByEvaluationId(
                $id,
                $request->validated(),
                $evaluatorId
            );

            if (!$evaluation) {
                return response()->json(['message' => 'Evaluación no encontrada'], 404);
            }

            return response()->json([
                'message' => 'Evaluación actualizada correctamente',
                'data' => $evaluation
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la evaluación',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Eliminar una evaluación
     */
    public function destroy(int $id): JsonResponse
    {
    }

    /**
     * Obtener estadísticas de evaluaciones
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $phase = $request->query('phase');
            $stats = $this->evaluationService->getEvaluationStats($phase);

            return response()->json([
                'message' => 'Estadísticas obtenidas correctamente',
                'data' => $stats
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveAllInReviewByPhase(): JsonResponse
    {
        try {
            $phaseId = CompetitionPhase::where('active', true)->value('id');
            $updatedCount = $this->evaluationService->updateAllStatusToApproved($phaseId);

            return response()->json([
                'message' => 'Evaluaciones actualizadas correctamente',
                'data' => ['updated_count' => $updatedCount]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar las evaluaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
