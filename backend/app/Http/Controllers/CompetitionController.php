<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CompetitionService;
use App\Models\CompetitionPhase;

class CompetitionController extends Controller
{
    protected CompetitionService $competitionService;

    public function __construct(
        CompetitionService $competitionService
    )
    {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getPhases()
    {
        $phases = $this->competitionService->getPhases();
        return response()->json($phases);
    }

    public function activatePhase(Request $request)
    {
        $phase = $request->validate([
            'phase' => 'required|string',
        ])['phase'];

        if ($phase === CompetitionPhase::PHASE_CLASSIFICATION) {
            $result = $this->competitionService->activateInitialPhase();
        } elseif ($phase === CompetitionPhase::PHASE_FINAL) {
            $result = $this->competitionService->activateFinalPhase();
        } else if ($phase === CompetitionPhase::PHASE_AWARDING) {
            $result = $this->competitionService->activateAwardingPhase();
        } else {
            return response()->json([
                'success' => false,
                'message' => "Fase '$phase' no reconocida.",
            ], 400);
        }

        return response()->json($result);
    }

    public function deactivatePhase(Request $request)
    {
        $phase = $request->validate([
            'phase' => 'required|string',
        ])['phase'];

        $result = $this->competitionService->deactivatePhase($phase);

        return response()->json($result);
    }
}
