<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            ['name' => 'Astronomía y Astrofísica', 'description' => 'Área de Astronomía y Astrofísica'],
            ['name' => 'Física', 'description' => 'Área de Física'],
            ['name' => 'Informática', 'description' => 'Área de Informática'],
            ['name' => 'Matemática', 'description' => 'Área de Matemáticas'],
            ['name' => 'Química', 'description' => 'Área de Química'],
            ['name' => 'Biología', 'description' => 'Área de Biología'],
        ];

        foreach ($areas as $areaData) {
            Area::updateOrCreate(
                ['name' => $areaData['name']],
                ['description' => $areaData['description']]
            );
        }
    }
}
