<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CompetitionPhaseService;

class CompetitionPhaseController extends Controller
{
    protected CompetitionPhaseService $phaseService;

    public function __construct(
      protected CompetitionPhaseService $competitionPhaseService
    )
    {}

    /**
     * Activar o desactivar una fase.
     * Espera request con 'phase' y 'action' ('activate' o 'deactivate')
     */
    public function togglePhase(string $phase, string $action)
    {
        if ($action === 'activate') {
            $result = $this->competitionPhaseService->activatePhase($phase);
        } else {
            $result = $this->competitionPhaseService->deactivatePhase($phase);
        }

        return response()->json($result);
    }

    /**
     * Obtener el estado de todas las fases.
     */
    public function index()
    {
        $phases = \App\Models\CompetitionPhase::all()->mapWithKeys(function ($phase) {
            return [$phase->phase => [
                'phase'       => $phase->phase,
                'active'    => (bool) $phase->active,
                'startedAt' => $phase->started_at?->toDateTimeString(),
            ]];
        });

        return response()->json(['phases' => $phases]);
    }
}
