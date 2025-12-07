<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\Inscription;
use App\Models\CompetitionPhase;
use App\Services\CompetitionService;
use Illuminate\Support\Facades\DB;
use App\Services\LogService;

class CompetitionPhaseService
{

    public function __construct(
      protected CompetitionService $competitionService,
      protected LogService $logService,
    ) {}

    public function activatePhase(string $phase): array
    {
        return DB::transaction(function () use ($phase) {
            $competitionPhase = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower($phase)])->first();

            if (!$competitionPhase) {
                return [
                    'success' => false,
                    'message' => "La fase '$phase' no existe en la base de datos."
                ];
            }

            // Regla de negocio: una fase cerrada no puede reabrirse
            if (!$competitionPhase->active && $competitionPhase->started_at && $competitionPhase->active === false) {
                return [
                    'success' => false,
                    'message' => "La fase '$phase' ya fue cerrada y no puede reactivarse.",
                ];
            }

            CompetitionPhase::where('active', true)
                ->where('phase', '!=', $phase)
                ->update(['active' => false]);

            if ($competitionPhase->active) {
                return [
                    'success' => true,
                    'message' => "La fase '$phase' ya estaba activa."
                ];
            }

            $firstActivation = is_null($competitionPhase->started_at);

            if ($firstActivation) {
                $competitionPhase->started_at = now();
            }

            $competitionPhase->active = true;
            $competitionPhase->save();

            $phaseLower = strtolower($phase);

            if ($firstActivation) {
                if ($phaseLower === Evaluation::PHASE_CLASIFICACION) {
                    $this->competitionService->activateInitialPhase();
                }

                if ($phaseLower === Evaluation::PHASE_FINAL) {
                    $this->competitionService->activateFinalPhase();
                }
            }

            $this->logService->record(
                'phase.activated',
                'CompetitionPhase',
                $competitionPhase->id,
                [
                    'phase' => $competitionPhase->phase,
                    'metadata' => [
                        'first_activation' => $firstActivation,
                    ],
                ]
            );

            return [
                'success' => true,
                'message' => "Fase '$phase' activada correctamente."
            ];
        });
    }

    public function deactivatePhase(string $phase): array
    {
        return DB::transaction(function () use ($phase) {
            $competitionPhase = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower($phase)])->first();

            if (!$competitionPhase) {
                return [
                    'success' => false,
                    'message' => "La fase '$phase' no existe en la base de datos."
                ];
            }

            $competitionPhase->active = false;
            $competitionPhase->save();

            // $this->competitionService->deactivatePhase($phase);

            $response = [
                'success' => true,
                'message' => "Fase '$phase' desactivada correctamente."
            ];
            $this->logService->record(
                'phase.deactivated',
                'CompetitionPhase',
                $competitionPhase->id,
                [
                    'phase' => $competitionPhase->phase,
                    'metadata' => [
                        'active' => false,
                    ],
                ]
            );
            return $response;
        });
    }

}
