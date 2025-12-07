<?php

namespace App\Services;

use App\Models\CompetitionPhase;

class PhaseEnforcerService
{
    /**
     * Mapa de funcionalidades a fases (nombres en la DB: 'inscripcion','clasificacion','final')
     */
    protected array $map = [
        // Fase 1
        'registrar_inscrito' => 'inscripcion',
        'asignar_area_nivel' => 'inscripcion',
        'cargar_csv' => 'inscripcion',
        'registrar_evaluadores' => 'inscripcion',
        'registrar_responsables' => 'inscripcion',
        'generar_lista_inscritos' => 'inscripcion',

        // Fase 2
        'registrar_notas' => 'clasificacion',
        'clasificar' => 'clasificacion',
        'generar_listas_clasificatorias' => 'clasificacion',
        'preparar_entorno_final' => 'clasificacion',

        // Fase 3
        'registrar_notas_finales' => 'final',
        'generar_ganadores' => 'final',
        'generar_certificados' => 'final',
        'premiacion' => 'final',
        'medallero' => 'final',
    ];

    /**
     * Cache simple por instancia para evitar multiples consultas en una misma peticion.
     */
    protected ?string $cachedActive = null;

    protected function getActivePhase(): ?string
    {
        if ($this->cachedActive !== null) {
            return $this->cachedActive;
        }

        $this->cachedActive = CompetitionPhase::where('active', true)->value('phase');
        return $this->cachedActive;
    }

    /**
     * Devuelve ['allowed' => bool, 'message' => string|null, 'activePhase' => string|null, 'code' => int]
     */
    public function checkFunctionalityAllowed(string $funcionalidad): array
    {
        $activePhase = $this->getActivePhase();

        $requiredPhase = $this->map[$funcionalidad] ?? null;

        if (!$requiredPhase) {
            return [
                'allowed' => false,
                'message' => "Funcionalidad desconocida: {$funcionalidad}",
                'activePhase' => $activePhase,
                'code' => 400,
            ];
        }

        if (!$activePhase) {
            return [
                'allowed' => false,
                'message' => "La funcionalidad {$funcionalidad} no esta disponible en la fase actual (sin fase activa).",
                'activePhase' => null,
                'code' => 403,
            ];
        }

        if ($activePhase !== $requiredPhase) {
            $phaseName = match (strtolower($activePhase)) {
                'inscripcion' => 'Inscripcion',
                'clasificacion' => 'Clasificatoria',
                'final' => 'Final',
                default => $activePhase,
            };

            return [
                'allowed' => false,
                'message' => "La funcionalidad {$funcionalidad} no esta disponible en la fase actual ({$phaseName}).",
                'activePhase' => $activePhase,
                'code' => 403,
            ];
        }

        return ['allowed' => true, 'message' => null, 'activePhase' => $activePhase, 'code' => 200];
    }
}
