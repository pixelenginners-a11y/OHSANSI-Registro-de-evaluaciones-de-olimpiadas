<?php

namespace App\Services;

use App\Models\AreaGrade;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class AreaGradeService
{
    /**
     * Obtener todas las relaciones área-grado.
     */
    public function getAll(): Collection
    {
        return AreaGrade::with(['area', 'grade'])
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Obtener una relación área-grado por su ID.
     */
    public function getById(int $id): ?AreaGrade
    {
        return AreaGrade::with(['area', 'grade'])->find($id);
    }

    /**
     * Crear una nueva relación área-grado.
     */
    public function create(array $data): AreaGrade
    {
        return DB::transaction(function () use ($data) {
            return AreaGrade::create([
                'area_id'  => $data['area_id'],
                'grade_id' => $data['grade_id'],
            ]);
        });
    }

    /**
     * Actualizar una relación área-grado existente.
     */
    public function update(int $id, array $data): ?AreaGrade
    {
        return DB::transaction(function () use ($id, $data) {
            $areaGrade = AreaGrade::find($id);

            if (!$areaGrade) {
                return null;
            }

            $areaGrade->update($data);

            return $areaGrade;
        });
    }

    /**
     * Eliminar una relación área-grado.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $areaGrade = AreaGrade::find($id);

            if (!$areaGrade) {
                return false;
            }

            return (bool) $areaGrade->delete();
        });
    }
}
