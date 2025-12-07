<?php

namespace App\Services;

use App\Services\MedallParameterService;
use App\Services\AreaGradeService;
use App\Services\LogService;
use App\Models\Area;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class AreaService
{
    public function __construct(
        protected MedalParameterService $medalParameterService,
        protected AreaGradeService $areaGradeService,
        protected LogService $logService
    )
    {}
    /**
     * Obtener un área con sus grados y parámetros de medallas.
     */
    public function getAllWithGradesAndMedals(): ?Collection
    {
        return Area::with([
            'medalParameter',
            'grades',
            'responsable'
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
                'is_group'       => $data['is_group'],
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
            $this->logService->record(
                'area.created',
                'Area',
                $area->id,
                [
                    'area_id' => $area->id,
                    'metadata' => [
                        'is_group' => $area->is_group,
                        'responsable_id' => $area->responsable_id,
                    ],
                ]
            );
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
                if (isset($data['area']['is_group']) && !$data['area']['is_group']) {
                  $data['area']['group_min_size'] = null;
                  $data['area']['group_max_size'] = null;
                }
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

            $this->logService->record(
                'area.updated',
                'Area',
                $area->id,
                [
                    'area_id' => $area->id,
                    'metadata' => $data,
                ]
            );

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

            $deleted = (bool) $area->delete();

            $this->logService->record(
                'area.deleted',
                'Area',
                $area->id,
                [
                    'area_id' => $area->id,
                ]
            );

            return $deleted;
        });
    }

    public function getAreaNameById(int $areaId): ?string
    {
        $area = Area::find($areaId);
        return $area ? $area->name : null;
    }

    public function assignResponsible(int $areaId, int $userId): ?Area
    {
        $area = Area::find($areaId);
        if (!$area) {
            return false;
        }
        // if ($area->responsable_id !== null) {
        //     return false;
        // }
        $area->responsable_id = $userId;
        $area->save();
        $this->logService->record(
            'area.responsable_assigned',
            'Area',
            $area->id,
            [
                'area_id' => $area->id,
                'metadata' => ['responsable_id' => $userId],
            ]
        );
        return $area;
    }

    public function unassignResponsible(int $userId): ?Area
    {
        $area = Area::where('responsable_id', $userId)->first();
        if (!$area) {
            return null;
        }
        $area->responsable_id = null;
        $area->save();
        $this->logService->record(
            'area.responsable_unassigned',
            'Area',
            $area->id,
            [
                'area_id' => $area->id,
                'metadata' => ['responsable_id' => $userId],
            ]
        );
        return $area;
    }
}
