<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class AreaController extends Controller
{

    public function index(): JsonResponse
    {
        try {
            $areas = Area::orderBy('nombre')->get();
            
            return response()->json([
                'success' => true,
                'data' => $areas,
                'message' => 'Áreas obtenidas correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las áreas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255|unique:areas,nombre',
                'estado' => ['required', Rule::in(['Activo', 'Inactivo'])]
            ]);

            $area = Area::create($validated);

            return response()->json([
                'success' => true,
                'data' => $area,
                'message' => 'Área creada correctamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el área',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show(Area $area): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $area,
                'message' => 'Área obtenida correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el área',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function update(Request $request, Area $area): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255|unique:areas,nombre,' . $area->id,
                'estado' => ['required', Rule::in(['Activo', 'Inactivo'])]
            ]);

            $area->update($validated);

            return response()->json([
                'success' => true,
                'data' => $area->fresh(),
                'message' => 'Área actualizada correctamente'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el área',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function destroy(Area $area): JsonResponse
    {
        try {
            $area->delete();

            return response()->json([
                'success' => true,
                'message' => 'Área eliminada correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el área',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function toggleStatus(Area $area): JsonResponse
    {
        try {
            $nuevoEstado = $area->estado === 'Activo' ? 'Inactivo' : 'Activo';
            $area->update(['estado' => $nuevoEstado]);

            return response()->json([
                'success' => true,
                'data' => $area->fresh(),
                'message' => "Estado cambiado a {$nuevoEstado} correctamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}