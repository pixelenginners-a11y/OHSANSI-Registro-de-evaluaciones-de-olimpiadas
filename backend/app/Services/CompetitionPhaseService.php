<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\Inscription;
use App\Models\CompetitionPhase;
use App\Services\CompetitionService;
use Illuminate\Support\Facades\DB;

class CompetitionPhaseService
{

    public function __construct(
      protected CompetitionService $competitionService,
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

            return [
                'success' => true,
                'message' => "Fase '$phase' desactivada correctamente."
            ];
        });
    }

}
