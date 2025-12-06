<?php

namespace App\Services;

use App\Models\Ranked;
use App\Models\Evaluation;
use App\Models\MedalParameter;
use App\Models\Olimpiada;
use App\Models\Area;
use App\Models\Grade;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class RankedService
{
    /**
     * Generar ranking para la olimpiada actualmente vigente
     */
    public function generateRanking(?int $areaId = null): array
    {
        DB::beginTransaction();

        try {
            // Obtener la olimpiada vigente
            $olimpiada = Olimpiada::where('fecha_inicio', '<=', Carbon::now())
                ->where('fecha_fin', '>=', Carbon::now())
                ->first();

            if (!$olimpiada) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'No hay ninguna olimpiada vigente actualmente',
                ];
            }

            $phase = $olimpiada->fase;

            // Validar que no esté en fase de inscripción
            if ($phase === Olimpiada::FASE_INSCRIPCION) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'No se puede generar ranking en fase de inscripción',
                ];
            }

            // Limpiar ranking existente de esta olimpiada
            $deleteQuery = Ranked::where('olimpiada_id', $olimpiada->id);

            if ($areaId) {
                $deleteQuery->where('area_id', $areaId);
            }

            $deleteQuery->delete();

            // Obtener todas las áreas a procesar
            $areas = $areaId
                ? Area::where('id', $areaId)->get()
                : Area::where('active', true)->get();

            $totalCreated = 0;

            foreach ($areas as $area) {
                // Obtener todos los grados
                $grades = Grade::where('active', true)->get();

                foreach ($grades as $grade) {
                    // Calcular ranking para esta combinación área-grado
                    $created = $this->generateRankingForAreaAndGrade(
                        $olimpiada->id,
                        $area->id,
                        $grade->id,
                        $phase
                    );

                    $totalCreated += $created;
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Ranking generado exitosamente para la olimpiada {$olimpiada->nombre}",
                'records_created' => $totalCreated,
                'olimpiada_id' => $olimpiada->id,
                'olimpiada_nombre' => $olimpiada->nombre,
                'phase' => $phase,
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Error al generar el ranking',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Generar ranking para un área y grado específicos
     */
    protected function generateRankingForAreaAndGrade(
        int $olimpiadaId,
        int $areaId,
        int $gradeId,
        string $phase
    ): int {
        // Obtener todas las evaluaciones de esta área, grado y fase
        // Agrupadas por inscription_id o group_id y calculando el promedio
        $evaluationsQuery = Evaluation::select(
                'inscription_id',
                'group_id',
                DB::raw('AVG(score) as avg_score'),
                DB::raw('COUNT(*) as evaluation_count')
            )
            ->where('phase', $phase)
            ->where(function($query) use ($areaId, $gradeId) {
                $query->whereHas('inscription', function($q) use ($areaId, $gradeId) {
                    $q->where('area_id', $areaId)
                      ->where('grade_id', $gradeId);
                })
                ->orWhereHas('group', function($q) use ($areaId, $gradeId) {
                    $q->where('area_id', $areaId)
                      ->where('grade_id', $gradeId);
                });
            })
            ->groupBy('inscription_id', 'group_id')
            ->orderBy('avg_score', 'desc')
            ->get();

        // Insertar los resultados en la tabla ranked con su posición
        $position = 1;
        $created = 0;

        foreach ($evaluationsQuery as $evaluation) {
            Ranked::create([
                'olimpiada_id' => $olimpiadaId,
                'inscription_id' => $evaluation->inscription_id,
                'group_id' => $evaluation->group_id,
                'area_id' => $areaId,
                'grade_id' => $gradeId,
                'position' => $position,
                'final_score' => round($evaluation->avg_score, 2),
            ]);

            $position++;
            $created++;
        }

        return $created;
    }

    /**
     * Obtener premiados de un área específica
     */
    public function getAwardedByArea(int $olimpiadaId, int $areaId): array
    {
        $ranked = Ranked::where('olimpiada_id', $olimpiadaId)
            ->where('area_id', $areaId)
            ->orderBy('position')
            ->with(['inscription.olympian', 'group', 'area', 'grade'])
            ->get();

        $medalParameter = MedalParameter::where('area_id', $areaId)->first();

        if (!$medalParameter || $ranked->isEmpty()) {
            return [];
        }

        $awarded = [];

        foreach ($ranked as $rank) {
            $awardType = null;

            if ($rank->position <= $medalParameter->gold) {
                $awardType = 'gold';
            } elseif ($rank->position <= $medalParameter->gold + $medalParameter->silver) {
                $awardType = 'silver';
            } elseif ($rank->position <= $medalParameter->gold + $medalParameter->silver + $medalParameter->bronze) {
                $awardType = 'bronze';
            } elseif ($rank->position <= $medalParameter->gold + $medalParameter->silver + $medalParameter->bronze + $medalParameter->honor_mentions) {
                $awardType = 'honor_mention';
            }

            if ($awardType) {
                $awarded[] = [
                    'ranked' => $rank,
                    'award_type' => $awardType,
                ];
            }
        }

        return $awarded;
    }

    /**
     * Obtener todos los premiados de una olimpiada
     */
    public function getAllAwarded(int $olimpiadaId): array
    {
        $areas = Area::where('active', true)->get();
        $result = [];

        foreach ($areas as $area) {
            $awarded = $this->getAwardedByArea($olimpiadaId, $area->id);

            if (!empty($awarded)) {
                $result[$area->name] = $awarded;
            }
        }

        return $result;
    }
}
