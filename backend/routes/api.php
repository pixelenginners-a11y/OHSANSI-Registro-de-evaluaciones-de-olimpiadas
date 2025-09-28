<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Roles\EvaluatorController;
use App\Http\Controllers\Roles\AcademicResponsibleController;
use App\Http\Controllers\OlympianController;

Route::prefix('evaluators')->group(function () {
    Route::get('/', [EvaluatorController::class, 'index']);
    Route::post('/', [EvaluatorController::class, 'store']);
    Route::get('{id}', [EvaluatorController::class, 'show']);
    Route::put('{id}', [EvaluatorController::class, 'update']);
    Route::patch('{id}', [EvaluatorController::class, 'update']);
    Route::delete('{id}', [EvaluatorController::class, 'destroy']);
});

Route::prefix('academics')->group(function () {
    Route::get('/', [AcademicResponsibleController::class, 'index']);
    Route::post('/', [AcademicResponsibleController::class, 'store']);
    Route::get('{id}', [AcademicResponsibleController::class, 'show']);
    Route::put('{id}', [AcademicResponsibleController::class, 'update']);
    Route::patch('{id}', [AcademicResponsibleController::class, 'update']);
    Route::delete('{id}', [AcademicResponsibleController::class, 'destroy']);
});

Route::prefix('olympians')->group(function () {
    Route::get('/', [OlympianController::class, 'all']);
    Route::post('/import', [OlympianController::class, 'import']);
});