<?php

namespace App\Http\Controllers\Roles;

use App\Services\AcademicResponsibleService;
use App\Http\Requests\StoreAcademicRequest;
use App\Http\Requests\UpdateAcademicRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AcademicResponsibleController extends Controller
{
    public function __construct(
      protected AcademicResponsibleService $academicResponsibleService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->academicResponsibleService->getAll();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicRequest $request)
    {
        $academic = $this->academicResponsibleService->create($request->validated());
        return response()->json([
            'message' => 'Responsable Academico creado correctamente',
            'data' => $academic,
        ], 201);   
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $academic = $this->academicResponsibleService->getById((int)$id);
        return response()->json($academic);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicRequest $request, string $id)
    {
        $academic = $this->academicResponsibleService->update((int)$id, $request->validated());
        return response()->json([
            'message' => 'Responsable Academico actualizado correctamente',
            'data' => $academic,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->academicResponsibleService->delete((int)$id);
        return response()->json(['message' => 'Responsable Academico eliminado correctamente']);
    }
}
