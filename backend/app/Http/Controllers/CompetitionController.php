<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CompetitionService;
use App\Services\CompetitionPhaseService;

class CompetitionController extends Controller
{
    protected CompetitionPhaseService $competitionPhaseService;

    public function __construct(
        CompetitionPhaseService $competitionPhaseService
    )
    {
        $this->competitionPhaseService = $competitionPhaseService;
    }
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
        $phases = $this->competitionPhaseService->getPhases();
        return response()->json($phases);
    }

    public function activatePhase(Request $request)
    {
        $phase = $request->validate([
            'phase' => 'required|string',
        ])['phase'];
        // Delegar la activación al servicio de fases (que a su vez puede disparar
        // las acciones necesarias en CompetitionService en la primera activación).
        $result = $this->competitionPhaseService->activatePhase($phase);

        $status = $result['success'] ? 200 : 400;
        return response()->json($result, $status);
    }

    public function deactivatePhase(Request $request)
    {
        $phase = $request->validate([
            'phase' => 'required|string',
        ])['phase'];
        $result = $this->competitionPhaseService->deactivatePhase($phase);

        $status = $result['success'] ? 200 : 400;
        return response()->json($result, $status);
    }
}
