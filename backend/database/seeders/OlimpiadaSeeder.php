<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Olimpiada;
use Carbon\Carbon;

class OlimpiadaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear una olimpiada activa en fase de inscripción
        Olimpiada::create([
            'nombre' => 'Olimpiada en Ciencias y Tecnología San Simón – Oh! SanSi',
            'fecha_inicio' => Carbon::now()->startOfYear(),
            'fecha_fin' => Carbon::now()->endOfYear(),
            'fase' => Olimpiada::FASE_INSCRIPCION,
        ]);
    }
}
