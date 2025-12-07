<?php

namespace App\Services;

use App\Models\Inscription;
use App\Models\GroupMember;
use App\Services\OlympianService;
use App\Services\LogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;
use \Illuminate\Pagination\LengthAwarePaginator;

class InscriptionService
{
    public function __construct(
        protected OlympianService $olympianService,
        protected LogService $logService
    )
    {}
    /**
     * Obtener todos los inscriptions.
     */
    public function getAll(): LengthAwarePaginator
    {
        return Inscription::with([
            'olympian:id,full_name,identity_document,educational_institution,department,academic_tutor',
            'area:id,name',
            'grade:id,name',
            'group:id,name'
        ])
        ->orderBy('id', 'desc')
        ->paginate(10);
    }

    /**
     * Obtener un inscription por su ID.
     */
    public function getById(int $id): ?Inscription
    {
        return Inscription::with([
            'olympian:id,full_name,identity_document,educational_institution',
            'area:id,name',
            'grade:id,name'
        ])
        ->find($id);
    }

    /**
     * Importar inscripciones desde un array de datos.
     */
    public function import(array $data)
    {
        return DB::transaction(function () use ($data) {
            $creados = collect($data)->map(function ($fila) {
                $olympian = $this->olympianService->store($fila['olympian']);

                if (!$olympian) {
                    return null;
                }

                if(isset($fila['group_name']) && $fila['group_name'] !== null){
                    $normalizedGroupName = $this->normalizeName($fila['group_name']);

                    $existingGroup = $this->groupService->findByNameAreaGrade(
                        $normalizedGroupName,
                        $fila['area_id'],
                        $fila['grade_id']
                    );

                    if($existingGroup){
                        $group = $existingGroup;
                    } else {
                        $group = $this->groupService->store(
                            $normalizedGroupName,
                            $fila['area_id'],
                            $fila['grade_id']
                        );
                    }
                } else {
                    $group = null;
                }


                $inscription = Inscription::create([
                    'olympian_id' => $olympian->id,
                    'area_id'     => $fila['area_id'],
                    'grade_id'    => $fila['grade_id'],
                    'status'      => $fila['status'] ?? 'pending',
                    'group_id'    => $group ? $group->id : null,
                ]);

                $this->logService->record(
                    'inscription.created',
                    'Inscription',
                    $inscription->id,
                    [
                        'area_id' => $inscription->area_id,
                        'grade_id' => $inscription->grade_id,
                        'metadata' => ['import' => true],
                    ]
                );

                return $inscription->load([
                    'olympian:id,full_name,identity_document,educational_institution,department',
                    'area:id,name',
                    'grade:id,name',
                    'group:id,name'
                ]);
            })->filter();

            return $creados;
        });
    }

    /**
     * Crear un nuevo inscription.
     */
    public function create(array $data): ?Inscription
    {
        return DB::transaction(function () use ($data) {

            $olympian = $this->olympianService->create($data['olympian']);

            if (!$olympian) {
                return null;
            }

            $inscription = Inscription::create([
                'olympian_id' => $olympian->id,
                'area_id'     => $data['area_id'],
                'grade_id'    => $data['grade_id'],
                'status'      => $data['status'] ?? 'pending',
                'group_id'    => $data['group_id'] ?? null,
            ]);
            $this->logService->record(
                'inscription.created',
                'Inscription',
                $inscription->id,
                [
                    'area_id' => $inscription->area_id,
                    'grade_id' => $inscription->grade_id,
                ]
            );
            return $inscription->load([
                'olympian:id,full_name,identity_document,educational_institution,department',
                'area:id,name',
                'grade:id,name',
                'group:id,name'
            ]);
        });
    }

    /**
     * Actualizar un inscription existente.
     */
    public function update(int $id, array $data): ?Inscription
    {
        return DB::transaction(function () use ($id, $data) {
            $inscription = Inscription::find($id);

            if (!$inscription) {
                return null;
            }
            $before = $inscription->only(['area_id', 'grade_id', 'status']);
            if(isset($data['olympian'])) {
                $olympian = $this->olympianService->update($inscription->olympian_id, $data['olympian']);
                if (!$olympian) {
                    return null;
                }
            }
            $inscription->update(
                [
                    'area_id'  => $data['area_id'] ?? $inscription->area_id,
                    'grade_id' => $data['grade_id'] ?? $inscription->grade_id,
                    'status'   => $data['status'] ?? $inscription->status,
                ]
            );
            $this->logService->record(
                'inscription.updated',
                'Inscription',
                $inscription->id,
                [
                    'area_id' => $inscription->area_id,
                    'grade_id' => $inscription->grade_id,
                    'metadata' => [
                        'before' => $before,
                        'after' => $inscription->only(['area_id', 'grade_id', 'status']),
                    ],
                ]
            );
            return $inscription->load('olympian', 'area', 'grade');
        });
    }

    /**
     * Eliminar un inscription.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $inscription = Inscription::find($id);

            if (!$inscription) {
                return false;
            }

            $deleted = (bool) $inscription->delete();

            $this->logService->record(
                'inscription.deleted',
                'Inscription',
                $inscription->id,
                [
                    'area_id' => $inscription->area_id,
                    'grade_id' => $inscription->grade_id,
                ]
            );

            return $deleted;
        });
    }

    public function searchInscriptions(
        string $search = '', 
        ?string $areaId = null, 
        ?string $gradeId = null,
        ?string $groupId = null,
        ?string $status = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        $searchLower = strtolower($search);
        
        $query = Inscription::select(
                'inscriptions.id',
                'inscriptions.status',
                'inscriptions.created_at',
                'inscriptions.updated_at',
                'olympians.full_name',
                'olympians.identity_document',
                'olympians.educational_institution',
                'olympians.department',
                'olympians.academic_tutor',
                'areas.id as area_id',
                'areas.name as area_name',
                'grades.id as grade_id', 
                'grades.name as grade_name',
                'groups.id as group_id',
                'groups.name as group_name'
            )
            ->join('olympians', 'inscriptions.olympian_id', '=', 'olympians.id')
            ->join('areas', 'inscriptions.area_id', '=', 'areas.id')
            ->join('grades', 'inscriptions.grade_id', '=', 'grades.id')
            ->leftJoin('groups', 'inscriptions.group_id', '=', 'groups.id')
            ->groupBy(
                'inscriptions.id',
                'inscriptions.status',
                'inscriptions.created_at', 
                'inscriptions.updated_at',
                'olympians.full_name',
                'olympians.identity_document',
                'olympians.educational_institution',
                'olympians.department',
                'olympians.academic_tutor',
                'areas.id',
                'areas.name',
                'grades.id',
                'grades.name',
                'groups.id',
                'groups.name'
            );

        if (!empty($areaId)) {
            $query->where('inscriptions.area_id', $areaId);
        }
        if (!empty($gradeId)) {
            $query->where('inscriptions.grade_id', $gradeId);
        }
        if (!empty($groupId)) {
            $query->where('inscriptions.group_id', $groupId);
        }
        if (!empty($status)) {
            $query->where('inscriptions.status', $status);
        }
        if (!empty($search)) {
            $query->where(function ($q) use ($searchLower) {
                $q->whereRaw('LOWER(olympians.full_name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(olympians.identity_document) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(olympians.educational_institution) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(olympians.department) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(groups.name) LIKE ?', ["%{$searchLower}%"]);
            });
        }
        
        return $query->orderBy('inscriptions.id', 'desc')
                    ->paginate($perPage);
    }


    private function normalizeName(string $name): string
    {
        return \Illuminate\Support\Str::of($name)
            ->lower()
            ->ascii()
            ->replaceMatches('/\s+/', ' ')
            ->trim();
    }
}