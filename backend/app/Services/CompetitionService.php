<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\CompetitionPhase;
use App\Models\Area;
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
        $phaseId = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower(CompetitionPhase::PHASE_CLASSIFICATION)])
            ->value('id');

        $inscriptions = Inscription::with('area')->get();

        DB::transaction(function () use ($inscriptions, $phaseId) {
            foreach ($inscriptions as $inscription) {
                if (!$inscription->area) continue;

                if (!$inscription->area->is_group) {
                    Evaluation::firstOrCreate(
                        [
                            'inscription_id' => $inscription->id,
                            'competition_phase_id' => $phaseId,
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

            $groups = Group::with('area')->get();
            foreach ($groups as $group) {
                if (!$group->area || !$group->area->is_group) continue;

                Evaluation::firstOrCreate(
                    [
                        'group_id' => $group->id,
                        'competition_phase_id' => $phaseId,
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
            'message' => "Fase activada y evaluaciones creadas.",
        ];
    }


    public function deactivatePhase(string $phase): ?array
    {
        $phaseId = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower($phase)])
            ->value('id');

        Evaluation::where('competition_phase_id', $phaseId)->delete();

        return [
            'success' => true,
            'message' => "Fase desactivada y evaluaciones eliminadas.",
        ];
    }

    public function activateFinalPhase(): ?array
    {
        $phase = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower(CompetitionPhase::PHASE_FINAL)])
            ->firstOrFail();

        $classification = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower(CompetitionPhase::PHASE_CLASSIFICATION)])
            ->firstOrFail();
        
        $limit = $classification->classification_limit;

        $phaseId = $phase->id;

        $evaluations = Evaluation::where('competition_phase_id', $classification->id)
            ->where('status', Evaluation::STATUS_APPROVED)
            ->get();

        DB::transaction(function () use ($evaluations, $phaseId, $limit) {

            foreach ($evaluations as $evaluation) {

                if ($evaluation->disqualified) {

                    if ($evaluation->inscription_id) {
                        Inscription::where('id', $evaluation->inscription_id)
                            ->update(['status' => Inscription::STATUS_DISQUALIFIED]);
                    }

                    if ($evaluation->group_id) {
                        Group::where('id', $evaluation->group_id)
                            ->update(['status' => Group::STATUS_DISQUALIFIED]);
                    }

                    continue;
                }

                if ($evaluation->score >= $limit) {

                    Evaluation::create([
                        'inscription_id' => $evaluation->inscription_id,
                        'group_id'       => $evaluation->group_id,
                        'evaluator_id'   => null,
                        'score'          => 0,
                        'description'    => null,
                        'competition_phase_id' => $phaseId,
                        'status'         => Evaluation::STATUS_PENDING,
                    ]);

                    if ($evaluation->inscription_id) {
                        Inscription::where('id', $evaluation->inscription_id)
                            ->update(['status' => Inscription::STATUS_FINALIST]);
                    }

                    if ($evaluation->group_id) {
                        Group::where('id', $evaluation->group_id)
                            ->update(['status' => Group::STATUS_FINALIST]);
                    }

                } else {
                    if ($evaluation->inscription_id) {
                        Inscription::where('id', $evaluation->inscription_id)
                            ->update(['status' => Inscription::STATUS_NOT_CLASSIFIED]);
                    }

                    if ($evaluation->group_id) {
                        Group::where('id', $evaluation->group_id)
                            ->update(['status' => Group::STATUS_NOT_CLASSIFIED]);
                    }
                }
            }

        });

        return [
            'success' => true,
            'message' => "Fase final activada y evaluaciones procesadas correctamente.",
        ];
    }


    public function activateAwardingPhase(): ?array
    {   
        $finalPhase = CompetitionPhase::whereRaw('LOWER(phase) = ?', [strtolower(CompetitionPhase::PHASE_FINAL)])
            ->firstOrFail();

        $areas = Area::with('medalParameter')->get();

        $evaluations = Evaluation::where('competition_phase_id', $finalPhase->id)
            ->where('status', Evaluation::STATUS_APPROVED)
            ->with(['inscription.area', 'group.area'])
            ->get();

        DB::transaction(function () use ($finalPhase, $areas, $evaluations) {
            foreach ($areas as $area) {

                $golds = $area->medalParameter->gold;
                $silvers = $area->medalParameter->silver;
                $bronzes = $area->medalParameter->bronze;
                $honorMentions = $area->medalParameter->honor_mentions;

                $areaEvaluations = $evaluations->filter(function ($evaluation) use ($area) {
                    if ($evaluation->inscription_id) {
                        return $evaluation->inscription->area_id === $area->id;
                    }
                    if ($evaluation->group_id) {
                        return $evaluation->group->area_id === $area->id;
                    }
                    return false;
                })->sortByDesc('score')->values();

                $count = 0;

                foreach ($areaEvaluations as $evaluation) {

                    if ($count < $golds) {
                        $medalStatus = $evaluation->inscription_id ? Inscription::STATUS_GOLD_MEDALIST : Group::STATUS_GOLD_MEDALIST;
                    } elseif ($count < $golds + $silvers) {
                        $medalStatus = $evaluation->inscription_id ? Inscription::STATUS_SILVER_MEDALIST : Group::STATUS_SILVER_MEDALIST;
                    } elseif ($count < $golds + $silvers + $bronzes) {
                        $medalStatus = $evaluation->inscription_id ? Inscription::STATUS_BRONZE_MEDALIST : Group::STATUS_BRONZE_MEDALIST;
                    } elseif ($count < $golds + $silvers + $bronzes + $honorMentions) {
                        $medalStatus = $evaluation->inscription_id ? Inscription::STATUS_HONORABLE_MENTION : Group::STATUS_HONORABLE_MENTION;
                    } else {
                        break;
                    }
                    if ($evaluation->inscription_id) {
                        Inscription::where('id', $evaluation->inscription_id)
                            ->update(['status' => $medalStatus]);
                    }
                    if ($evaluation->group_id) {
                        Group::where('id', $evaluation->group_id)
                            ->update(['status' => $medalStatus]);
                    }
                    $count++;
                }
            }
        });

        return [
            'success' => true,
            'message' => "Fase de premiación activada y medallas asignadas.",
        ];
    }

}
