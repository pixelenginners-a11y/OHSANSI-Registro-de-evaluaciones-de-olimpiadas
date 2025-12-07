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
        } else{
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
                'id'       => $phase->id,
                'phase'       => $phase->phase,
                'active'    => (bool) $phase->active,
                'startedAt' => $phase->started_at?->toDateTimeString(),
                'classificationLimit' => $phase->classification_limit,
                'description' => $phase->description,
            ]];
        });

        return response()->json(['phases' => $phases]);
    }

    public function setClassificationLimit(Request $request)
    {
      $request->validate([
          'phase' => 'required|numeric|exists:competition_phases,id',
          'classification_limit' => 'required|numeric|min:0|max:100',
      ]);

      $phase = $request->input('phase');
      $limit = (int) $request->input('classification_limit');

      $result = $this->competitionPhaseService->setClassificationLimit($limit, $phase);

      return response()->json($result);
    }
}
