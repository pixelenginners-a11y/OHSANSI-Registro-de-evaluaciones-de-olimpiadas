<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('areas')->group(function () {
    Route::get('/', [App\Http\Controllers\AreaController::class, 'index']);
    Route::post('/', [App\Http\Controllers\AreaController::class, 'store']);
    Route::get('/{area}', [App\Http\Controllers\AreaController::class, 'show']);
    Route::put('/{area}', [App\Http\Controllers\AreaController::class, 'update']);
    Route::delete('/{area}', [App\Http\Controllers\AreaController::class, 'destroy']);
    Route::patch('/{area}/toggle-status', [App\Http\Controllers\AreaController::class, 'toggleStatus']);
});