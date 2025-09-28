<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Roles\EvaluatorController;
use App\Http\Controllers\Roles\AcademicResponsibleController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\GradeController;

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

Route::prefix('areas')->group(function () {
    Route::get('/', [AreaController::class, 'index']);
    Route::post('/', [AreaController::class, 'store']);
    Route::get('{id}', [AreaController::class, 'show']);
    Route::put('{id}', [AreaController::class, 'update']);
    Route::patch('{id}', [AreaController::class, 'update']);
    Route::delete('{id}', [AreaController::class, 'destroy']);
});

Route::prefix('grades')->group(function () {
    Route::get('/', [GradeController::class, 'index']);
    Route::post('/', [GradeController::class, 'store']);
    Route::get('{id}', [GradeController::class, 'show']);
    Route::put('{id}', [GradeController::class, 'update']);
    Route::patch('{id}', [GradeController::class, 'update']);
    Route::delete('{id}', [GradeController::class, 'destroy']);
});
