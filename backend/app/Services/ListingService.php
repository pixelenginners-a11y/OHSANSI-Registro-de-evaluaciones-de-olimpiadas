<?php

namespace App\Services;

use App\Models\Listing;
use App\Services\ListItemService;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Services\LogService;

class ListingService
{
    public function __construct(
      protected ListItemService $listItemService,
      protected LogService $logService
    ){}

    /**
     * Crear una nueva lista
     */
    public function createListing(array $data): Listing
    {
        return DB::transaction(function () use ($data) {
            $isPublished = isset($data['is_published']) ? (bool) $data['is_published'] : false;
            $publishedAt  = $isPublished ? ($data['published_at'] ?? now()) : null;
            $listing = Listing::create([
                'name'         => $data['name'],
                'area_id'      => $data['area_id'],
                'grade_id'     => $data['grade_id'],
                'type'         => $data['type'],
                'description'  => $data['description'] ?? null,
                'is_published' => $isPublished,
                'published_at' => $publishedAt,
                'visibility'   => $data['visibility'] ?? 'publico'
            ]);

            $this->listItemService->generateItems($listing->id, $data['area_id'], $data['grade_id']);

            $this->logService->record(
                'listing.created',
                'Listing',
                $listing->id,
                [
                    'area_id' => $listing->area_id,
                    'grade_id' => $listing->grade_id,
                    'metadata' => [
                        'type' => $listing->type,
                        'is_published' => $listing->is_published,
                    ],
                ]
            );

            return $listing->fresh();
        });
    }

    /**
     * Actualizar una lista existente
     */
    public function updateListing(Listing $listing, array $data): Listing
    {
        return DB::transaction(function () use ($listing, $data) {
            $originalAreaId = $listing->area_id;
            $originalGradeId = $listing->grade_id;

            if (isset($data['is_published']) && $data['is_published'] === true) {
                if (!isset($data['published_at']) && !$listing->is_published) {
                    $data['published_at'] = now();
                }
            }

            $listing->update($data);

            $areaChanged = isset($data['area_id']) && $data['area_id'] !== $originalAreaId;
            $gradeChanged = isset($data['grade_id']) && $data['grade_id'] !== $originalGradeId;

            if ($areaChanged || $gradeChanged) {
                $this->listItemService->deleteListItem($listing->id);
                $this->listItemService->generateItems($listing->id, $listing->area_id, $listing->grade_id);
            }

            $this->logService->record(
                'listing.updated',
                'Listing',
                $listing->id,
                [
                    'area_id' => $listing->area_id,
                    'grade_id' => $listing->grade_id,
                    'metadata' => [
                        'changes' => $data,
                    ],
                ]
            );

            return $listing->fresh();
        });
    }

    /**
     * Publicar una lista
     */
    public function publishListing(Listing $listing): Listing
    {
        return DB::transaction(function () use ($listing) {
            $listing->update([
                'is_published' => true,
                'published_at' => $listing->published_at ?? now(),
                'visibility' => $listing->visibility ?? 'publico'
            ]);

            $listing = $listing->fresh();
            $this->logService->record(
                'listing.published',
                'Listing',
                $listing->id,
                [
                    'area_id' => $listing->area_id,
                    'grade_id' => $listing->grade_id,
                ]
            );

            return $listing;
        });
    }

    /**
     * Despublicar una lista
     */
    public function unpublishListing(Listing $listing): Listing
    {
        return DB::transaction(function () use ($listing) {
            $listing->update([
                'is_published' => false
            ]);

            $listing = $listing->fresh();
            $this->logService->record(
                'listing.unpublished',
                'Listing',
                $listing->id,
                [
                    'area_id' => $listing->area_id,
                    'grade_id' => $listing->grade_id,
                ]
            );

            return $listing;
        });
    }

    /**
     * obtener una lista por su ID
     */
    public function getListingById(int $listingId): ?Listing
    {
        return Listing::with(['area', 'grade'])->find($listingId);
    }

    /**
     * Eliminar una lista y sus items
     */
    public function deleteListing(Listing $listing): bool
    {
        return DB::transaction(function () use ($listing) {

            $this->listItemService->deleteListItem($listing->id);
            $deleted = $listing->delete();
            $this->logService->record(
                'listing.deleted',
                'Listing',
                $listing->id,
                [
                    'area_id' => $listing->area_id,
                    'grade_id' => $listing->grade_id,
                ]
            );
            return $deleted;
        });
    }

    /**
     * Obtener todas las listas
     */
    public function getAllListings(): LengthAwarePaginator
    {
        return Listing::with(['area', 'grade'])->orderBy('created_at', 'desc')->paginate(10);
    }


    /**
     * Obtener estadísticas de una lista
     */
    public function getListingStats(Listing $listing): array
    {
        $totalItems = $listing->items()->count();
        $individualItems = $listing->items()->whereNotNull('inscription_id')->count();
        $groupItems = $listing->items()->whereNotNull('group_id')->count();

        return [
            'total_items' => $totalItems,
            'individual_items' => $individualItems,
            'group_items' => $groupItems,
            'last_updated' => $listing->updated_at,
            'published_status' => $listing->is_published ? 'Publicada' : 'No publicada',
            'visibility' => $listing->visibility,
        ];
    }
}
