<?php

namespace App\Services;

use App\Models\Inscription;
use App\Services\OlympianService;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class InscriptionService
{
    public function __construct(
        protected OlympianService $olympianService
    )
    {}
    /**
     * Obtener todos los inscriptions.
     */
    public function getAll(): Collection
    {
        return Inscription::with([
            'olympian:id,full_name,identity_document,educational_institution',
            'area:id,name',
            'grade:id,name'
        ])
        ->orderBy('id', 'desc')
        ->get();
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
            ]);
            return $inscription->load([
                'olympian:id,full_name,identity_document,educational_institution,department',
                'area:id,name',
                'grade:id,name'
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

            return (bool) $inscription->delete();
        });
    }
}
