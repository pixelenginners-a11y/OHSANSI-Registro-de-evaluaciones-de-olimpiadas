<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEvaluatorRequest;
use App\Http\Requests\UpdateEvaluatorRequest;
use App\Services\EvaluatorService;

class EvaluatorController extends Controller
{
    public function __construct(
      protected EvaluatorService $evaluatorService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $evaluators = $this->evaluatorService->getAll();
        return response()->json($evaluators);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluatorRequest $request)
    {
        $evaluator = $this->evaluatorService->createEvaluator($request->validated());
        return response()->json([
            'message' => 'Evaluador creado correctamente',
            'data' => $evaluator,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $evaluator = $this->evaluatorService->getEvaluatorById((int)$id);
        if (!$evaluator) {
            return response()->json(['message' => 'Evaluador no encontrado'], 404);
        }
        return response()->json($evaluator);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluatorRequest $request, string $id)
    {
        $evaluator = $this->evaluatorService->updateEvaluator((int)$id, $request->validated());
        if (!$evaluator) {
            return response()->json(['message' => 'Evaluador no encontrado'], 404);
        }
        return response()->json([
            'message' => 'Evaluador actualizado correctamente',
            'data' => $evaluator,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->evaluatorService->deleteEvaluator((int)$id);
        return response()->noContent();
    }
}
