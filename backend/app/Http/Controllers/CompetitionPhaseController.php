<?php

namespace App\Http\Controllers;

use App\Services\CompetitionPhaseService;

class CompetitionPhaseController extends Controller
{
    public function __construct(
        protected CompetitionPhaseService $phaseService
    ) {}

    /**
     * Activar o desactivar una fase.
     * Espera request con 'phase' y 'action' ('activate' o 'deactivate')
     */
    public function togglePhase(string $phase, string $action)
    {
        $action = strtolower($action);
        if (!in_array($action, ['activate', 'deactivate'])) {
            return response()->json([
                'success' => false,
                'message' => "Accion '$action' no valida. Use 'activate' o 'deactivate'.",
            ], 400);
        }

        $result = $action === 'activate'
            ? $this->phaseService->activatePhase($phase)
            : $this->phaseService->deactivatePhase($phase);

        $status = $result['success'] ? 200 : 400;
        return response()->json($result, $status);
    }

    /**
     * Reiniciar todas las fases (solo administradores/developers).
     */
    public function reset()
    {
        $result = $this->phaseService->resetPhases();
        $status = $result['success'] ? 200 : 400;
        return response()->json($result, $status);
    }

    /**
     * Obtener el estado de todas las fases.
     */
    public function index()
    {
        $phases = \App\Models\CompetitionPhase::all()->mapWithKeys(function ($phase) {
            return [$phase->phase => [
                'phase' => $phase->phase,
                'active' => (bool) $phase->active,
                'startedAt' => $phase->started_at?->toDateTimeString(),
            ]];
        });

        return response()->json(['phases' => $phases]);
    }

    /**
     * Obtener la fase actualmente activa.
     * Devuelve { phase: string|null, name: string|null }
     */
    public function current()
    {
        $active = \App\Models\CompetitionPhase::where('active', true)->orderBy('phase')->first();

        if (!$active) {
            return response()->json([
                'phase' => null,
                'name' => null,
                'message' => 'No hay una fase activa en este momento.'
            ]);
        }

        $names = [
            'inscripcion' => 'Inscripcion',
            'clasificacion' => 'Clasificatoria',
            'final' => 'Final',
        ];

        $phaseKey = strtolower((string)$active->phase);

        return response()->json([
            'phase' => $active->phase,
            'name' => $names[$phaseKey] ?? $active->phase,
        ]);
    }
}
