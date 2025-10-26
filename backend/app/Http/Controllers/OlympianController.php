<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\OlympianService;
use App\Http\Requests\StoreOlympianRequest;
use App\Http\Requests\UpdateOlympianRequest;
use App\Http\Requests\ImportOlympianRequest;

class OlympianController extends Controller
{
    private OlympianService $olympianService;

    public function __construct(OlympianService $olympianService)
    {
        $this->olympianService = $olympianService;
    }

    public function index(): JsonResponse
    {
        $olympians = $this->olympianService->getAll();
        return response()->json([
            'data' => $olympians,
        ]);
    }

    public function store(StoreOlympianRequest $request): JsonResponse
    {
        $olympian = $this->olympianService->store($request->validated());

        return response()->json([
            'message' => 'Olimpista creado con éxito',
            'data' => $olympian,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $olympian = $this->olympianService->findById($id);

        if (!$olympian) {
            return response()->json([
                'message' => 'Olimpista no encontrado',
            ], 404);
        }

        return response()->json([
            'data' => $olympian,
        ]);
    }

    public function update(UpdateOlympianRequest $request, string $id): JsonResponse
    {
        $olympian = $this->olympianService->update($id, $request->validated());

        if (!$olympian) {
            return response()->json([
                'message' => 'Olimpista no encontrado',
            ], 404);
        }

        return response()->json([
            'message' => 'Olimpista actualizado con éxito',
            'data' => $olympian,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->olympianService->delete($id);

        if (!$deleted) {
            return response()->json([
                'message' => 'Olimpista no encontrado',
            ], 404);
        }

        return response()->json([
            'message' => 'Olimpista eliminado con éxito',
        ]);
    }
}
