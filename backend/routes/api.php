<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Roles\EvaluatorController;
use App\Http\Controllers\Roles\AcademicResponsibleController;
use App\Http\Controllers\OlympianController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\InscriptionController;

// Rutas públicas de autenticación
Route::post('login', [AuthController::class, 'login']);

// Rutas protegidas con JWT
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    // Evaluators routes (Solo Administradores)
    Route::prefix('evaluators')->middleware('role:Administrador')->group(function () {
        Route::get('/', [EvaluatorController::class, 'index']);
        Route::post('/', [EvaluatorController::class, 'store']);
        Route::get('{id}', [EvaluatorController::class, 'show']);
        Route::put('{id}', [EvaluatorController::class, 'update']);
        Route::patch('{id}', [EvaluatorController::class, 'update']);
        Route::delete('{id}', [EvaluatorController::class, 'destroy']);
    });

    // Academics routes (Solo Administradores)
    Route::prefix('academics')->middleware('role:Administrador')->group(function () {
        Route::get('/', [AcademicResponsibleController::class, 'index']);
        Route::post('/', [AcademicResponsibleController::class, 'store']);
        Route::get('{id}', [AcademicResponsibleController::class, 'show']);
        Route::put('{id}', [AcademicResponsibleController::class, 'update']);
        Route::patch('{id}', [AcademicResponsibleController::class, 'update']);
        Route::delete('{id}', [AcademicResponsibleController::class, 'destroy']);
    });

    // Olympians routes (Administrador y Responsable Academico)
    Route::prefix('olympians')->middleware('role:Administrador,Responsable Academico')->group(function () {
        Route::get('/', [OlympianController::class, 'all']);
        Route::post('/import', [OlympianController::class, 'import']);
    });

    // Areas routes (Solo Administradores)
    Route::prefix('areas')->middleware('role:Administrador')->group(function () {
        Route::get('/', [AreaController::class, 'index']);
        Route::post('/', [AreaController::class, 'store']);
        Route::get('{id}', [AreaController::class, 'show']);
        Route::put('{id}', [AreaController::class, 'update']);
        Route::patch('{id}', [AreaController::class, 'update']);
        Route::delete('{id}', [AreaController::class, 'destroy']);
    });

    // Grades routes (Solo Administradores)
    Route::prefix('grades')->middleware('role:Administrador')->group(function () {
        Route::get('/', [GradeController::class, 'index']);
        Route::post('/', [GradeController::class, 'store']);
        Route::get('{id}', [GradeController::class, 'show']);
        Route::put('{id}', [GradeController::class, 'update']);
        Route::patch('{id}', [GradeController::class, 'update']);
        Route::delete('{id}', [GradeController::class, 'destroy']);
    });

    // Inscriptions routes (Administrador, Evaluador y Responsable Academico)
    Route::prefix('inscriptions')->middleware('role:Administrador,Evaluador,Responsable Academico')->group(function () {
        Route::get('/', [InscriptionController::class, 'index']);
        Route::post('/', [InscriptionController::class, 'store']);
        Route::get('{id}', [InscriptionController::class, 'show']);
        Route::put('{id}', [InscriptionController::class, 'update']);
        Route::patch('{id}', [InscriptionController::class, 'update']);
        Route::delete('{id}', [InscriptionController::class, 'destroy']);
    });
});