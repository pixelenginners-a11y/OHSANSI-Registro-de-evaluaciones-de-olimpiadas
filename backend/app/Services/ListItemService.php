<?php

namespace App\Services;

use App\Models\ListItem;
use App\Models\Area;
use App\Models\Group;
use App\Models\Inscription;
use App\Services\AreaService;
use App\Services\GradeService;
use App\Services\InscriptionService;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ListItemService
{
    /**
     * Crear un nuevo ítem de lista
     */
    public function generateItems(int $listingId, int $areaId, int $gradeId): int
    {
        return DB::transaction(function () use ($listingId, $areaId, $gradeId) {
            $area = Area::find($areaId);
            if(!$area) {
                throw new ModelNotFoundException("Área no encontrada.");
            }

            $isGroupArea = $area->is_group ?? false;

            $itemsData = [];

            $now = now();

            if ($isGroupArea) {
                $groups = Group::where('area_id', $areaId)
                    ->where('grade_id', $gradeId)
                    ->orderBy('created_at', 'asc')
                    ->get();

                foreach ($groups as $group) {
                    $itemsData[] = [
                        'listing_id'    => $listingId,
                        'inscription_id'=> null,
                        'group_id'      => $group->id,
                        'created_at'    => $now,
                        'updated_at'    => $now,
                      ];
                }
            } else {
                $inscriptions = Inscription::where('area_id', $areaId)
                    ->where('grade_id', $gradeId)
                    ->whereNull('group_id')
                    ->orderBy('created_at', 'asc')
                    ->get();

                foreach ($inscriptions as $inscription) {
                    $itemsData[] = [
                        'listing_id'    => $listingId,
                        'inscription_id'=> $inscription->id,
                        'group_id'      => null,
                        'created_at'    => $now,
                        'updated_at'    => $now,
                    ];
                }
            }

            if (!empty($itemsData)) {
                ListItem::insert($itemsData);
            }

            return count($itemsData);
        });
    }

    /**
     * Obtener items de una lista
     */
    public function getListItems(int $listingId): LengthAwarePaginator
    {
        return ListItem::with(['inscription.olympian', 'group.members.olympian'])
            ->where('listing_id', $listingId)
            ->paginate(10);
    }


    /**
     * Eliminar todos los items de lista
     */
    public function deleteListItem(int $listingId): void
    {
        DB::transaction(function () use ($listingId) {
            ListItem::where('listing_id', $listingId)->delete();
        });
    }
}