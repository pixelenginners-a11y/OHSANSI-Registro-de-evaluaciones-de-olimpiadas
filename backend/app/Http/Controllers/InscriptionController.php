<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInscriptionRequest;
use App\Http\Requests\UpdateInscriptionRequest;
use App\Http\Requests\ImportInscriptionRequest;
use App\Services\InscriptionService;
use App\Models\Inscription;
use Illuminate\Http\Request;

class InscriptionController extends Controller
{
    public function __construct(
        protected InscriptionService $inscriptionService
    ){}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inscriptions = $this->inscriptionService->getAll();
        if($inscriptions->isEmpty()){
          return response()->json([
            'message' => 'Aun no se tienen inscritos'
          ],404);
        }
        return response()->json($inscriptions,200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInscriptionRequest $request)
    {
        $validated = $request->validated();
        $inscription = $this->inscriptionService->create($validated);
        if(!$inscription){
          return response()->json([
            'message' => 'El inscrito no se pudo crear'
          ],404);
        }
        return response()->json($inscription,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $inscription = $this->inscriptionService->getById($id);
        if(!$inscription){
          return response()->json([
            'message' => 'El inscrito no existe'
          ],404);
        }
        return response()->json($inscription,200);        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInscriptionRequest $request, int $id)
    {
        $validated = $request->validated();
        $updatedInscription = $this->inscriptionService->update($id, $validated);
        if(!$updatedInscription){
          return response()->json([
            'message' => 'El inscrito no se pudo actualizar'
          ],404);
        }
        return response()->json($updatedInscription,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $deleted = $this->inscriptionService->delete($id);
        if(!$deleted){
          return response()->json([
            'message' => 'El inscrito no se pudo eliminar'
          ],404);
        }
        return response()->noContent();
    }

    public function search(Request $request): JsonResponse
    {
        $inscriptions = $this->inscriptionService->searchInscriptions(
            search: $request->input('query', ''),
            areaId: $request->input('areaId'),
            gradeId: $request->input('gradeId'),
            groupId: $request->input('groupId'),
            status: $request->input('status'),
            perPage: $request->input('perPage', 10)
        );

        return response()->json($inscriptions);
    }
    

    /**
     * Import multiple inscriptions from an array of data.
     */
    public function import(ImportInscriptionRequest $request)
    {
        $validated = $request->validated();
        $inscriptions = $this->inscriptionService->import($validated['data']);

        if($inscriptions->isEmpty()){
          return response()->json([
            'message' => 'No se pudieron importar las inscripciones'
          ], 400);
        }

        return response()->json([
            'message' => 'Inscripciones importadas con éxito',
            'data' => $inscriptions,
            'count' => $inscriptions->count()
        ], 201);
    }
}
