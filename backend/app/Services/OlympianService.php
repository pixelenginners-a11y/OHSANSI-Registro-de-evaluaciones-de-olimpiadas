<?php

namespace App\Services;

use App\Models\Olympian;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class OlympianService
{
    /**
     * Obtener todos los olympians.
     */
    public function getAll(): Collection
    {
        return Olympian::orderBy('id', 'desc')->get();
    }

    /**
     * Obtener un olympian por su ID.
     */
    public function getById(int $id): ?Olympian
    {
        return Olympian::find($id);
    }

    /**
     * Crear un nuevo olympian.
     */
    public function create(array $data): Olympian
    {
        return DB::transaction(function () use ($data) {
            return Olympian::create([
                'full_name'             => $data['full_name'],
                'identity_document'     => $data['identity_document'],
                'educational_institution'=> $data['educational_institution'],
                'department'            => $data['department'],
                'academic_tutor'        => $data['academic_tutor'] ?? null,
            ]);
        });
    }

    /**
     * Actualizar un olympian existente.
     */
    public function update(int $id, array $data): ?Olympian
    {
        $olympian = Olympian::find($id);
        if (!$olympian) {
            return null;
        }
        $olympian->update($data);
        return $olympian;
    }

    /**
     * Eliminar un olympian.
     */
    public function delete(int $id): bool
    {
        $olympian = Olympian::find($id);
        if (!$olympian) {
            return false;
        }
        return (bool) $olympian->delete();
    }
}
