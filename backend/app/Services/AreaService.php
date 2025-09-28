<?php

namespace App\Services;

use App\Services\MedallParameterService;
use App\Services\AreaGradeService;
use App\Models\Area;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class AreaService
{
    public function __construct(
        protected MedalParameterService $medalParameterService,
        protected AreaGradeService $areaGradeService
    )
    {}
    /**
     * Obtener un área con sus grados y parámetros de medallas.
     */
    public function getAllWithGradesAndMedals(): ?Collection
    {
        return Area::with([
            'medalParameter',
            'grades'
        ])->orderBy('id', 'desc')
          ->get();
    }

    /**
     * Obtener todos las areas.
     */
    public function getAll(): Collection
    {
        return Area::orderBy('id', 'desc')->get();
    }

    /**
     * Obtener un area por su ID.
     */
    public function getById(int $id): ?Area
    {
        return Area::find($id);
    }

    /**
     * Crear un nuevo area.
     */
    public function create(array $data): Area
    {
        return DB::transaction(function () use ($data) {
            $area = Area::create([
                'name'           => $data['name'],
                'description'    => $data['description'] ?? null,
                'active'         => $data['active'] ?? true,
                'responsable_id' => $data['responsable_id'] ?? null,
            ]);

            $this->medalParameterService->create([
                'area_id'        => $area->id,
                'gold'           => $data['gold'] ?? 0,
                'silver'         => $data['silver'] ?? 0,
                'bronze'         => $data['bronze'] ?? 0,
                'honor_mentions' => $data['honor_mentions'] ?? 0,
            ]);

            if (!empty($data['grades']) && is_array($data['grades'])) {
                $area->grades()->sync($data['grades']);
            }
            return $area->load(['medalParameter', 'grades']);
        });
    }

    /**
     * Actualizar un area existente.
     */
    public function update(int $id, array $data): ?Area
    {
        return DB::transaction(function () use ($id, $data) {
            $area = Area::find($id);
            if (!$area) return null;

            if (!empty($data['area'])) {
                $area->update($data['area']);
            }

            if (!empty($data['medalParameter'])) {
                $medalParam = $this->medalParameterService->getByAreaId($area->id);
                if ($medalParam) {
                    $this->medalParameterService->update($medalParam->id, $data['medalParameter']);
                }
            }

            if (!empty($data['grades']) && is_array($data['grades'])) {
                $area->grades()->sync($data['grades']);
            }

            return $area->load(['medalParameter', 'grades']);
        });
    }

    /**
     * Eliminar un area.
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $area = Area::find($id);

            if (!$area) {
                return false;
            }

            $this->medalParameterService->delete($area->id);
            $this->areaGradeService->delete($area->id);

            return (bool) $area->delete();
        });
    }

    public function getAreaNameById(int $areaId): ?string
    {
        $area = Area::find($areaId);
        return $area ? $area->name : null;
    }
}
