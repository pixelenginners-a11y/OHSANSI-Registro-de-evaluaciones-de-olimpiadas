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
            ['phase' => 'Inscripcion', 'active' => false],
            ['phase' => 'Clasificacion', 'active' => false, 'description' => 'Fase de clasificación donde los participantes compiten para avanzar a la siguiente etapa.'],
            ['phase' => 'Final', 'active' => false, 'description' => 'Fase final donde los mejores participantes compiten por el título y los premios.'],
        ];

        foreach ($phases as $phase) {
            \App\Models\CompetitionPhase::create($phase);
        }
    }
}
