<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GroupMember;
use App\Models\Inscription;

class GroupMemberSeeder extends Seeder
{
    public function run(): void
    {
        // Traemos todas las inscripciones que ya tienen grupo
        $inscriptionsWithGroup = Inscription::whereNotNull('group_id')->get();

        foreach ($inscriptionsWithGroup as $inscription) {
            // Creamos el miembro del grupo si no existe
            GroupMember::firstOrCreate([
                'group_id' => $inscription->group_id,
                'olympian_id' => $inscription->olympian_id,
            ]);
        }
    }
}
