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
use App\Http\Controllers\ListingController;
use App\Http\Controllers\ListItemController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\CompetitionPhaseController;


// Rutas públicas de autenticación
Route::post('login', [AuthController::class, 'login']);

// Rutas protegidas con JWT
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    
    // Endpoint para obtener la fase actual (para frontend)
    Route::get('fase-actual', [CompetitionPhaseController::class, 'current']);

    // Evaluators routes (Solo Administradores)
    Route::prefix('evaluators')->middleware('role:Administrador')->group(function () {
        Route::get('/', [EvaluatorController::class, 'index']);
        Route::post('/', [EvaluatorController::class, 'store'])->middleware('phase.guard:registrar_evaluadores');
        Route::get('/search', [EvaluatorController::class, 'search']);
        Route::get('{id}', [EvaluatorController::class, 'show']);
        Route::put('{id}', [EvaluatorController::class, 'update'])->middleware('phase.guard:registrar_evaluadores');
        Route::patch('{id}', [EvaluatorController::class, 'update'])->middleware('phase.guard:registrar_evaluadores');
        Route::delete('{id}', [EvaluatorController::class, 'destroy'])->middleware('phase.guard:registrar_evaluadores');
    });

    // Academics routes (Solo Administradores)
    Route::prefix('academics')->middleware('role:Administrador')->group(function () {
        Route::get('/', [AcademicResponsibleController::class, 'index']);
        Route::post('/', [AcademicResponsibleController::class, 'store'])->middleware('phase.guard:registrar_responsables');
        Route::get('{id}', [AcademicResponsibleController::class, 'show']);
        Route::put('{id}', [AcademicResponsibleController::class, 'update'])->middleware('phase.guard:registrar_responsables');
        Route::patch('{id}', [AcademicResponsibleController::class, 'update'])->middleware('phase.guard:registrar_responsables');
        Route::delete('{id}', [AcademicResponsibleController::class, 'destroy'])->middleware('phase.guard:registrar_responsables');
    });

    // Olympians routes (Administrador y Responsable Academico)
    Route::prefix('olympians')->middleware('role:Administrador,Responsable Academico')->group(function () {
        Route::get('/', [OlympianController::class, 'index']);
        Route::post('/', [OlympianController::class, 'store']);
        Route::get('{id}', [OlympianController::class, 'show']);
        Route::put('{id}', [OlympianController::class, 'update']);
        Route::patch('{id}', [OlympianController::class, 'update']);
        Route::delete('{id}', [OlympianController::class, 'destroy']);
    });

    // Areas routes (Solo Administradores)
    Route::prefix('areas')->middleware('role:Administrador,Evaluador,Responsable Academico')->group(function () {
        Route::get('/', [AreaController::class, 'index']);
        Route::post('/', [AreaController::class, 'store'])->middleware('phase.guard:asignar_area_nivel');
        Route::get('{id}', [AreaController::class, 'show']);
        Route::put('{id}', [AreaController::class, 'update'])->middleware('phase.guard:asignar_area_nivel');
        Route::patch('{id}', [AreaController::class, 'update'])->middleware('phase.guard:asignar_area_nivel');
        Route::delete('{id}', [AreaController::class, 'destroy'])->middleware('phase.guard:asignar_area_nivel');
    });

    // Grades routes (Solo Administradores)
    Route::prefix('grades')->middleware('role:Administrador,Evaluador,Responsable Academico')->group(function () {
        Route::get('/', [GradeController::class, 'index']);
        Route::post('/', [GradeController::class, 'store'])->middleware('phase.guard:asignar_area_nivel');
        Route::get('{id}', [GradeController::class, 'show']);
        Route::put('{id}', [GradeController::class, 'update'])->middleware('phase.guard:asignar_area_nivel');
        Route::patch('{id}', [GradeController::class, 'update'])->middleware('phase.guard:asignar_area_nivel');
        Route::delete('{id}', [GradeController::class, 'destroy'])->middleware('phase.guard:asignar_area_nivel');
    });

    // Inscriptions routes (Administrador, Evaluador y Responsable Academico)
    Route::prefix('inscriptions')->middleware('role:Administrador,Evaluador,Responsable Academico')->group(function () {
        Route::get('/', [InscriptionController::class, 'index']);
        Route::get('{id}', [InscriptionController::class, 'show']);
        Route::get('/search', [InscriptionController::class, 'search']);
        Route::post('/import', [InscriptionController::class, 'import'])->middleware('phase.guard:cargar_csv');
        // Solo permitir crear inscripciones en fase de Inscripciones
        Route::post('/', [InscriptionController::class, 'store'])->middleware('phase.guard:registrar_inscrito');

        // Solo permitir actualizar y eliminar en fase de Inscripciones
        Route::put('{id}', [InscriptionController::class, 'update'])->middleware('phase.guard:registrar_inscrito');
        Route::patch('{id}', [InscriptionController::class, 'update'])->middleware('phase.guard:registrar_inscrito');
        Route::delete('{id}', [InscriptionController::class, 'destroy'])->middleware('phase.guard:registrar_inscrito');
    });

    Route::prefix('listings')->middleware('role:Administrador,Evaluador, Responsable Academico')->group(function () {
        Route::get('/', [ListingController::class, 'index']);
        Route::post('/', [ListingController::class, 'store'])->middleware('phase.guard:generar_lista_inscritos');
        Route::get('{id}', [ListingController::class, 'show']);
        Route::put('{id}', [ListingController::class, 'update'])->middleware('phase.guard:generar_lista_inscritos');
        Route::patch('{id}', [ListingController::class, 'update'])->middleware('phase.guard:generar_lista_inscritos');
        Route::delete('{id}', [ListingController::class, 'destroy'])->middleware('phase.guard:generar_lista_inscritos');
    });

    Route::prefix('list-items')->middleware('role:Administrador,Evaluador, Responsable Academico')->group(function () {
        Route::get('{id}', [ListItemController::class, 'index']);
    });

    Route::prefix('evaluations')->middleware(['auth:api', 'role:Administrador,Evaluador,Responsable Academico'])->group(function () {
        Route::get('/', [EvaluationController::class, 'index']);
        Route::get('/stats', [EvaluationController::class, 'stats']);
        Route::patch('{id}', [EvaluationController::class, 'update']);
    });

    Route::prefix('admin/competition/phases')->middleware('auth:api')->group(function () {
        Route::get('/', [CompetitionPhaseController::class, 'index']);
        Route::post('{phase}/{action}', [CompetitionPhaseController::class, 'togglePhase']);
        Route::post('reset', [CompetitionPhaseController::class, 'reset']);
    });
});
