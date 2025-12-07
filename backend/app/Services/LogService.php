<?php

namespace App\Services;

use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Http\Request;

class LogService
{
    /**
     * Registrar un evento en los logs del sistema.
     *
     * @param string $action        Nombre del evento (ej. evaluation.updated).
     * @param string|null $entity   Nombre del modelo afectado.
     * @param int|null $entityId    ID del modelo afectado.
     * @param array $context        Datos adicionales (area_id, grade_id, phase, before/after, etc).
     * @param Request|null $request Para capturar IP y User-Agent cuando exista.
     * @param User|null $actor      Usuario que ejecuta la acción.
     */
    public function record(
        string $action,
        ?string $entity = null,
        ?int $entityId = null,
        array $context = [],
        ?Request $request = null,
        ?User $actor = null
    ): SystemLog {
        $actor ??= auth()->user();

        $payload = [
            'actor_id'    => $actor?->id,
            'actor_role'  => $actor?->role?->name,
            'action'      => $action,
            'entity_type' => $entity,
            'entity_id'   => $entityId,
            'area_id'     => $context['area_id'] ?? null,
            'grade_id'    => $context['grade_id'] ?? null,
            'phase'       => $context['phase'] ?? null,
            'metadata'    => $context['metadata'] ?? null,
            'ip_address'  => $request?->ip(),
            'user_agent'  => $request?->userAgent(),
        ];

        return SystemLog::create($payload);
    }
}
