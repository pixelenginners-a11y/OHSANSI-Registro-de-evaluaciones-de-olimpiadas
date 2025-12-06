<?php

namespace App\Http\Controllers;

use App\Models\Ranked;
use App\Models\MedalParameter;
use App\Models\Area;
use App\Services\RankedService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RankedController extends Controller
{
    public function __construct(private RankedService $rankedService) {}

    /**
     * Obtener todos los premiados agrupados por área
     */
    public function getAwarded(Request $request): JsonResponse
    {
        try {
            $olimpiadaId = $request->query('olimpiada_id');

            if (!$olimpiadaId) {
                return response()->json([
                    'message' => 'olimpiada_id es requerido'
                ], 400);
            }

            $awarded = $this->rankedService->getAllAwarded($olimpiadaId);

            return response()->json([
                'message' => 'Premiados obtenidos correctamente',
                'data' => $awarded
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener premiados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener premiados de un área específica
     */
    public function getAwardedByArea(Request $request, int $areaId): JsonResponse
    {
        try {
            $olimpiadaId = $request->query('olimpiada_id');

            if (!$olimpiadaId) {
                return response()->json([
                    'message' => 'olimpiada_id es requerido'
                ], 400);
            }

            $awarded = $this->rankedService->getAwardedByArea($olimpiadaId, $areaId);

            return response()->json([
                'message' => 'Premiados del área obtenidos correctamente',
                'data' => $awarded
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener premiados del área',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener ranking completo (sin filtrar por medallas)
     */
    public function getRanking(Request $request): JsonResponse
    {
        try {
            $olimpiadaId = $request->query('olimpiada_id');
            $areaId = $request->query('area_id');
            $gradeId = $request->query('grade_id');

            $query = Ranked::with([
                'inscription.olympian',
                'group',
                'area',
                'grade',
                'olimpiada'
            ]);

            if ($olimpiadaId) {
                $query->where('olimpiada_id', $olimpiadaId);
            }

            if ($areaId) {
                $query->where('area_id', $areaId);
            }

            if ($gradeId) {
                $query->where('grade_id', $gradeId);
            }

            $ranking = $query->orderBy('area_id')
                ->orderBy('grade_id')
                ->orderBy('position')
                ->get();

            return response()->json([
                'message' => 'Ranking obtenido correctamente',
                'data' => $ranking
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener ranking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar ranking (ejecutar el proceso)
     */
    public function generateRanking(Request $request): JsonResponse
    {
        try {
            $areaId = $request->input('area_id');

            $result = $this->rankedService->generateRanking($areaId);

            return response()->json($result, $result['success'] ? 200 : 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar ranking',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
