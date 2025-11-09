<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\User;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            [
                'name' => 'Astronomía y Astrofísica', 
                'description' => 'Estudio de cuerpos celestes, universo y fenómenos astrofísicos',
                'is_group' => false,
                'group_min_size' => null,
                'group_max_size' => null,
                'active' => true
            ],
            [
                'name' => 'Física', 
                'description' => 'Ciencias físicas, mecánica, termodinámica y física moderna',
                'is_group' => true,
                'group_min_size' => 2,
                'group_max_size' => 4,
                'active' => true
            ],
            [
                'name' => 'Informática', 
                'description' => 'Programación, algoritmos, desarrollo de software y tecnologías de la información',
                'is_group' => true,
                'group_min_size' => 1,
                'group_max_size' => 3,
                'active' => true
            ],
            [
                'name' => 'Matemática', 
                'description' => 'Matemáticas puras y aplicadas, álgebra, cálculo y estadística',
                'is_group' => false,
                'group_min_size' => null,
                'group_max_size' => null,
                'active' => true
            ],
            [
                'name' => 'Química', 
                'description' => 'Química orgánica, inorgánica, analítica y bioquímica',
                'is_group' => true,
                'group_min_size' => 2,
                'group_max_size' => 3,
                'active' => true
            ],
            [
                'name' => 'Biología', 
                'description' => 'Ciencias biológicas, biología molecular, ecología y genética',
                'is_group' => true,
                'group_min_size' => 2,
                'group_max_size' => 4,
                'active' => true
            ],
            [
                'name' => 'Robótica', 
                'description' => 'Diseño, construcción y programación de sistemas robóticos',
                'is_group' => true,
                'group_min_size' => 2,
                'group_max_size' => 5,
                'active' => true
            ],
            [
                'name' => 'Ingeniería', 
                'description' => 'Proyectos de ingeniería civil, mecánica, eléctrica y electrónica',
                'is_group' => true,
                'group_min_size' => 3,
                'group_max_size' => 6,
                'active' => true
            ],
            [
                'name' => 'Ciencias Ambientales', 
                'description' => 'Estudio del medio ambiente, sostenibilidad y conservación',
                'is_group' => true,
                'group_min_size' => 2,
                'group_max_size' => 4,
                'active' => true
            ],
            [
                'name' => 'Neurociencias', 
                'description' => 'Estudio del sistema nervioso y funciones cerebrales',
                'is_group' => false,
                'group_min_size' => null,
                'group_max_size' => null,
                'active' => true
            ]
        ];

        $evaluators = User::whereHas('role', function($query) {
            $query->where('name', 'Evaluador');
        })->get();

        foreach ($areas as $areaData) {
            $area = Area::updateOrCreate(
                ['name' => $areaData['name']],
                [
                    'description' => $areaData['description'],
                    'is_group' => $areaData['is_group'],
                    'group_min_size' => $areaData['group_min_size'],
                    'group_max_size' => $areaData['group_max_size'],
                    'active' => $areaData['active'],
                    'responsable_id' => $evaluators->random()->id
                ]
            );
        }
    }
}
