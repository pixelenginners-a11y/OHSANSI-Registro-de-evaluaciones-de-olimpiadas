<?php

namespace App\Services;

use App\Models\Listing;
use App\Services\ListItemService;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ListingService
{
    public function __construct(
      protected ListItemService $listItemService
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

            return $listing->fresh();
        });
    }

    /**
     * Actualizar una lista existente
     */
    public function updateListing(Listing $listing, array $data): Listing
    {
        return DB::transaction(function () use ($listing, $data) {

            if (isset($data['is_published']) && $data['is_published'] === true) {
                if (!isset($data['published_at']) && !$listing->is_published) {
                    $data['published_at'] = now();
                }
            }

            $listing->update($data);

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

            return $listing->fresh();
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

            return $listing->fresh();
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
            return $listing->delete();
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