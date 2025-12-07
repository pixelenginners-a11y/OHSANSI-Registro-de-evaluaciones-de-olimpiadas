<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompetitionPhasesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phases = [
            ['phase' => 'inscripcion', 'active' => false, 'description' => 'Fase de inscripción donde los participantes se registran para la competencia.'],
            ['phase' => 'clasificacion', 'active' => false, 'description' => 'Fase de clasificación donde los participantes compiten para avanzar a la siguiente etapa.'],
            ['phase' => 'final', 'active' => false, 'description' => 'Fase final donde los mejores participantes compiten por el título y los premios.'],
            ['phase' => 'premiacion', 'active' => false, 'description' => 'Fase de premiación donde se anuncian los ganadores y se entregan los premios.'],
        ];

        foreach ($phases as $phase) {
            \App\Models\CompetitionPhase::create($phase);
        }
    }
}
