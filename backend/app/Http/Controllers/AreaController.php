<?php

namespace App\Http\Controllers;


use App\Http\Requests\StoreAreaRequest;
use App\Http\Requests\UpdateAreaRequest;
use App\Models\Area;
use Illuminate\Http\Request;
use App\Services\AreaService;

class AreaController extends Controller
{
    public function __construct(
        protected AreaService $areaService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areas = $this->areaService->getAllWithGradesAndMedals();
        return response()->json($areas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAreaRequest $request)
    {
        $area = $this->areaService->create($request->validated());
        return response()->json([
            'message' => 'Area creada correctamente',
            'data' => $area,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $area = $this->areaService->getById($id);

        if (!$area) {
            return response()->json(['message' => 'Area no encontrada'], 404);
        }

        return response()->json($area);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAreaRequest  $request, int $id)
    {
        $data = $request->validated();
        $area = $this->areaService->update($id, $data);

        if (!$area) {
            return response()->json(['message' => 'Area no encontrada'], 404);
        }

        return response()->json([
            'message' => 'Area actualizada correctamente',
            'data' => $area,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $deleted = $this->areaService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Area no encontrada'], 404);
        }

        return response()->json([
            'message' => 'Area eliminada correctamente',
        ]);
    }
}
