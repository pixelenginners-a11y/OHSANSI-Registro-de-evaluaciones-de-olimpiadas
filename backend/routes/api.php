<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Roles\EvaluatorController;

Route::prefix('evaluators')->group(function () {
    Route::get('/', [EvaluatorController::class, 'index']);
    Route::post('/', [EvaluatorController::class, 'store']);
    Route::get('{id}', [EvaluatorController::class, 'show']);
    Route::put('{id}', [EvaluatorController::class, 'update']);
    Route::patch('{id}', [EvaluatorController::class, 'update']);
    Route::delete('{id}', [EvaluatorController::class, 'destroy']);
});

Route::get('/test', function() {
    return response()->json([
        'message' => 'Ruta de prueba funcionando'
    ]);
});
