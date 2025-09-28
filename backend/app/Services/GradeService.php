<?php

namespace App\Services;

use App\Models\Grade;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class GradeService
{
    /**
     * Obtener todos los grados.
     */
    public function getAll(): Collection
    {
        return Grade::orderBy('id', 'desc')->get();
    }

    /**
     * Obtener un grado por ID.
     */
    public function getById(int $id): ?Grade
    {
        return Grade::find($id);
    }

    /**
     * Crear un nuevo grado.
     */
    public function create(array $data): Grade
    {
        return DB::transaction(function () use ($data) {
            return Grade::create([
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
                'active'      => $data['active'] ?? true,
            ]);
        });
    }

    /**
     * Actualizar un grado existente.
     */
    public function update(int $id, array $data): ?Grade
    {
        return DB::transaction(function () use ($id, $data) {
            $grade = Grade::find($id);
            if (!$grade) {
                return null;
            }
            $grade->update($data);
            return $grade;
        });
    }

    /**
     * Eliminar un grado.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $grade = Grade::find($id);
            if (!$grade) {
                return false;
            }
            return (bool) $grade->delete();
        });
    }
}
