<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Services\GradeService;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function __construct(
        protected GradeService $gradeService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grades = $this->gradeService->getAll();
        return response()->json($grades);
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(StoreGradeRequest $request)
    {
        $grade = $this->gradeService->create($request->validated());
        return response()->json([
            'message' => 'Grado creado correctamente',
            'data' => $grade,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $grade = $this->gradeService->getById($id);
        return response()->json($grade);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeRequest $request, int $id)
    {
        $data = $request->validated();
        $grade = $this->gradeService->update($id, $data);

        if (!$grade) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->json([
            'message' => 'Grado actualizado correctamente',
            'data' => $grade,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $deleted = $this->gradeService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        return response()->noContent();
    }
}
