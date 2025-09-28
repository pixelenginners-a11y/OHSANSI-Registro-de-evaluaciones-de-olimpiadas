<?php

namespace App\Services;

use App\Models\MedalParameter;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class MedalParameterService
{
    /**
     * Obtener todos los parámetros de medallas.
     */
    public function getAll(): Collection
    {
        return MedalParameter::with('area')
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Obtener un parámetro de medalla por ID.
     */
    public function getById(int $id): ?MedalParameter
    {
        return MedalParameter::with('area')->find($id);
    }

    /**
     * Crear un nuevo parámetro de medalla.
     */
    public function create(array $data): MedalParameter
    {
        return DB::transaction(function () use ($data) {
            return MedalParameter::create([
                'area_id'        => $data['area_id'],
                'gold'           => $data['gold'] ?? 1,
                'silver'         => $data['silver'] ?? 1,
                'bronze'         => $data['bronze'] ?? 1,
                'honor_mentions' => $data['honor_mentions'] ?? 0,
            ]);
        });
    }

    /**
     * Actualizar un parámetro de medalla existente.
     */
    public function update(int $id, array $data): ?MedalParameter
    {
        return DB::transaction(function () use ($id, $data) {
            $medalParam = MedalParameter::find($id);
            if (!$medalParam) {
                return null;
            }
            $medalParam->update($data);
            return $medalParam;
        });
    }

    /**
     * Eliminar un parámetro de medalla.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $medalParam = MedalParameter::find($id);
            if (!$medalParam) {
                return false;
            }
            return (bool) $medalParam->delete();
        });
    }

    public function getByAreaId(int $areaId): ?MedalParameter
    {
        return MedalParameter::where('area_id', $areaId)->first();
    }
}
