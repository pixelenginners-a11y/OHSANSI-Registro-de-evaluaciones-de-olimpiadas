<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\Inscription;
use App\Models\CompetitionPhase;
use App\Models\Olimpiada;
use App\Services\CompetitionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

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

            // Mapear orden lógico de fases para evitar retrocesos.
            $orderMap = [
                strtolower('inscripcion') => 1,
                strtolower('clasificacion') => 2,
                strtolower('final') => 3,
            ];

            $phaseLower = strtolower($phase);
            $requestedOrder = $orderMap[$phaseLower] ?? null;

            // Determinar la fase ya iniciada más avanzada (por orden)
            $startedPhases = CompetitionPhase::whereNotNull('started_at')->get();
            $maxStartedOrder = null;
            foreach ($startedPhases as $p) {
                $o = $orderMap[strtolower($p->phase)] ?? null;
                if ($o !== null && ($maxStartedOrder === null || $o > $maxStartedOrder)) {
                    $maxStartedOrder = $o;
                }
            }

            // Impedir activar una fase anterior si ya se inició una posterior
            if ($requestedOrder !== null && $maxStartedOrder !== null && $requestedOrder < $maxStartedOrder) {
                return [
                    'success' => false,
                    'message' => "No se puede volver a una fase anterior (intentó activar '$phase')."
                ];
            }

            // Desactivar otras fases activas (si corresponde)
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

            if ($firstActivation) {
                if ($phaseLower === Evaluation::PHASE_CLASIFICACION) {
                    $this->competitionService->activateInitialPhase();
                }

                if ($phaseLower === Evaluation::PHASE_FINAL) {
                    $this->competitionService->activateFinalPhase();
                }
            }

            // Sincronizar la fase en la tabla `olimpiadas` (fuente secundaria de verdad)
            $this->syncOlimpiadaPhase($phaseLower);

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

            // Una vez que una fase fue iniciada (started_at != null), no permitimos desactivarla
            if (!is_null($competitionPhase->started_at)) {
                return [
                    'success' => false,
                    'message' => "No se puede desactivar la fase '$phase' porque ya fue iniciada."
                ];
            }

            $competitionPhase->active = false;
            $competitionPhase->save();

            // Si ya no hay fases activas, sincronizar la columna `fase` en Olimpiada
            $anyActive = CompetitionPhase::where('active', true)->exists();
            if (!$anyActive) {
                $this->syncOlimpiadaPhase(null);
            }

            return [
                'success' => true,
                'message' => "Fase '$phase' desactivada correctamente."
            ];
        });
    }

    /**
     * Sincroniza el campo `fase` del modelo Olimpiada con la fase activa.
     * Recibe la fase en minúsculas tal como está en `competition_phases` o null.
     */
    protected function syncOlimpiadaPhase(?string $phaseLower): void
    {
        try {
            $olimpiada = Olimpiada::latest()->first();
            if (!$olimpiada) return;

            // Mapear nombres de fase entre competition_phases y Olimpiada constants
            $map = [
                'inscripcion' => Olimpiada::FASE_INSCRIPCION,
                'clasificacion' => Olimpiada::FASE_CLASIFICATORIA,
                'final' => Olimpiada::FASE_FINAL,
            ];

            $new = null;
            if ($phaseLower !== null) {
                $new = $map[$phaseLower] ?? $phaseLower;
            }

            // Actualizar solo si cambia
            if ($olimpiada->fase !== $new) {
                $olimpiada->fase = $new;
                $olimpiada->save();
            }
        } catch (\Throwable $e) {
            // No hacemos fail la transacción por un error de sincronización, pero registramos
            // opcional: log::error('Error sincronizando Olimpiada.fase: '.$e->getMessage());
        }
    }

    /**
     * Obtener todas las fases registradas.
     */
    public function getPhases()
    {
        return CompetitionPhase::orderBy('id')->get();
    }

    /**
     * Reset all phases to inactive and clear started_at.
     * Only for administrative use (developer tool).
     */
    public function resetPhases(): array
    {
        return DB::transaction(function () {
            CompetitionPhase::query()->update([
                'active' => false,
                'started_at' => null,
            ]);

            return [
                'success' => true,
                'message' => 'Todas las fases han sido reiniciadas: inactive y sin started_at.'
            ];
        });
    }

}
