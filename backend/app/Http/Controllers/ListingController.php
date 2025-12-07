<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use App\Services\ListingService;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;

class ListingController extends Controller
{
    protected ListingService $listingService;

    public function __construct(ListingService $listingService, \App\Services\PhaseEnforcerService $phaseEnforcer)
    {
        $this->listingService = $listingService;
        $this->phaseEnforcer = $phaseEnforcer;
    }

    /**
     * Display a paginated listing of the resource.
     */
    public function index()
    {
        $listings = $this->listingService->getAllListings();
        return response()->json($listings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreListingRequest $request)
    {
        $check = $this->phaseEnforcer->checkFunctionalityAllowed('generar_lista_inscritos');
        if (!$check['allowed']) {
            return response()->json(['message' => $check['message']], 403);
        }

        $listing = $this->listingService->createListing($request->validated());
        return response()->json($listing, 201);
    }



    /**
     * Display the specified resource.
     */
    public function show(int $listingId)
    {
        $listing = $this->listingService->getListingById($listingId);
        if (!$listing) {
            return response()->json(['message' => 'Lista no encontrada'], 404);
        }
        return response()->json($listing);
    }

    /**
     * Display the stats.
     */
    public function getStats(int $listingId)
    {
        $listing = $this->listingService->getListingById($listingId);
        if (!$listing) {
            return response()->json(['message' => 'Lista no encontrada'], 404);
        }
        $listing->load(['area', 'grade', 'items']);
        $stats = $this->listingService->getListingStats($listing);

        return response()->json([
            'listing' => $listing,
            'stats' => $stats
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateListingRequest $request, int $listing)
    {
        $listing = $this->listingService->getListingById($listing);
        if (!$listing) {
            return response()->json(['message' => 'Lista no encontrada'], 404);
        }
        $check = $this->phaseEnforcer->checkFunctionalityAllowed('generar_lista_inscritos');
        if (!$check['allowed']) {
            return response()->json(['message' => $check['message']], 403);
        }

        $listing = $this->listingService->updateListing($listing, $request->validated());
        return response()->json($listing);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $listingId)
    {
        $listing = $this->listingService->getListingById($listingId);
        if (!$listing) {
            return response()->json(['message' => 'Lista no encontrada'], 404);
        }
        $check = $this->phaseEnforcer->checkFunctionalityAllowed('generar_lista_inscritos');
        if (!$check['allowed']) {
            return response()->json(['message' => $check['message']], 403);
        }

        $deleted = $this->listingService->deleteListing($listing);
        return response()->json(['deleted' => $deleted]);
    }
}
