<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\User;
use App\Models\Inscription;
use App\Models\Group;
use App\Services\EvaluatorGradeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class CompetitionService
{
    public function __construct(
      protected EvaluatorGradeService $evaluatorGradeService,
    ) {}
    /**
     * Obtener todas las competiciones.
     */
    public function getAll()
    {
    }

    /**
     * Obtener una competicion por su ID.
     */
    public function getById(int $id)
    {
    }

    /**
     * Crear una nueva competicion.
     */
    public function create(array $data)
    {
    }

    /**
     * Actualizar una competicion existente.
     */
    public function update(int $id, array $data)
    {
    }

    /**
     * Eliminar una competicion.
     */
    public function delete(int $id): bool
    {
    }

    public function activateInitialPhase(): ?array
    {
        $phase = Evaluation::PHASE_CLASIFICACION;

        $inscriptions = Inscription::with('area')->get();

        DB::transaction(function () use ($inscriptions, $phase) {
            // 1️⃣ Evaluaciones individuales
            foreach ($inscriptions as $inscription) {
                if (!$inscription->area) continue;

                if (!$inscription->area->is_group) {
                    Evaluation::firstOrCreate(
                        [
                            'inscription_id' => $inscription->id,
                            'phase' => $phase,
                        ],
                        [
                            'group_id' => null,
                            'evaluator_id' => null,
                            'score' => 0,
                            'description' => null,
                            'status' => Evaluation::STATUS_PENDING,
                        ]
                    );
                }
            }

            // 2️⃣ Evaluaciones por grupo
            $groups = Group::with('area')->get();
            foreach ($groups as $group) {
                if (!$group->area || !$group->area->is_group) continue;

                Evaluation::firstOrCreate(
                    [
                        'group_id' => $group->id,
                        'phase' => $phase,
                    ],
                    [
                        'inscription_id' => null,
                        'evaluator_id' => null,
                        'score' => 0,
                        'description' => null,
                        'status' => Evaluation::STATUS_PENDING,
                    ]
                );
            }
        });

        return [
            'success' => true,
            'message' => "Fase '$phase' activada y evaluaciones creadas.",
        ];
    }


    public function deactivatePhase(string $phase): ?array
    {
        Evaluation::where('phase', $phase)->delete();

        return [
            'success' => true,
            'message' => "Fase '$phase' desactivada y evaluaciones eliminadas.",
        ];
    }

    public function activateFinalPhase(): ?array
    {
        $phase = Evaluation::PHASE_FINAL;

        $evaluations = Evaluation::where('phase', Evaluation::PHASE_CLASIFICACION)
            ->where('status', Evaluation::STATUS_CLASIFICADOS)
            ->get();

        DB::transaction(function () use ($evaluations, $phase) {
            foreach ($evaluations as $evaluation) {
                Evaluation::create([
                    'inscription_id' => $evaluation->inscription_id,
                    'group_id'       => $evaluation->group_id,
                    'evaluator_id'   => null,
                    'score'          => 0,
                    'description'    => null,
                    'phase'          => $phase,
                    'status'         => Evaluation::STATUS_PENDING,
                ]);
            }
        });

        return [
            'success' => true,
            'message' => "Fase '$phase' activada y evaluaciones creadas.",
        ];
    }
}
