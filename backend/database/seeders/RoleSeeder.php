<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
          ['name' => 'Administrador', 'description' => 'Usuario con todos los permisos'],
          ['name' => 'Evaluador', 'description' => 'Usuario que puede evaluar inscripciones'],
          ['name' => 'Responsable Academico', 'description' => 'Usuario que gestiona un área específica'],
        ];
        
        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']], 
                ['description' => $roleData['description']]
            );
        }
    }
}
