<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Establecer todas las fases como inactivas y limpiar started_at
        DB::table('competition_phases')->update([
            'active' => false,
            'started_at' => null,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No se revierte automáticamente: dejar vacío o implementar según necesidad.
    }
};
