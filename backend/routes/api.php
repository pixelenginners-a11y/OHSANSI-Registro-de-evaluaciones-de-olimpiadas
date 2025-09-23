<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::prefix('admin')->group(function () {
    Route::get('users', [UserController::class,'index']);
    Route::post('users', [UserController::class,'store']);
    Route::delete('users/{user}', [UserController::class,'destroy']);
    Route::put('users/{user}', [UserController::class,'update']);
    Route::patch('users/{user}', [UserController::class,'update']);
});