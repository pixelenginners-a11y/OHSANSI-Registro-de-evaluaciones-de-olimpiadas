<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Olympian;
use App\Models\Area;
use App\Models\Grade;
use App\Models\Group;
use App\Models\Inscription;
use Faker\Factory as Faker;

class InscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $olympians = Olympian::all();
        $areas = Area::where('active', true)->get();
        $grades = Grade::where('active', true)->get();

        if ($olympians->isEmpty() || $areas->isEmpty() || $grades->isEmpty()) {
            $this->command->warn('No hay olympians, areas o grades disponibles para crear inscripciones.');
            return;
        }

        $groupCounter = 0;

        foreach ($olympians as $olympian) {
            $grade = $grades->random();

            if (Inscription::where('olympian_id', $olympian->id)
                ->where('grade_id', $grade->id)
                ->exists()) {
                continue;
            }

            $maxAreas = max(1, intdiv($areas->count(), 2));
            $numAreas = rand(1, $maxAreas);

            $areaIds = $areas->pluck('id')->shuffle()->take($numAreas);

            foreach ($areaIds as $areaId) {
                $area = $areas->firstWhere('id', $areaId);
                if (!$area) continue;

                $groupId = null;

                if ($area->is_group) {
                    $areaMax = $area->group_max_size ?? 10;

                    $group = Group::withTrashed()
                        ->where('area_id', $area->id)
                        ->where('grade_id', $grade->id)
                        ->whereNull('deleted_at')
                        ->get()
                        ->filter(fn($g) => $g->inscriptions()->count() < $areaMax)
                        ->sortBy(fn($g) => $g->inscriptions()->count())
                        ->first();

                    if (!$group) {
                        $groupCounter++;
                        $groupName = "Grupo {$area->name} #{$groupCounter}";

                        $group = Group::create([
                            'name' => $groupName,
                            'area_id' => $area->id,
                            'grade_id' => $grade->id,
                        ]);
                    }

                    $groupId = $group->id;
                }

                if ($area->is_group && !$groupId) {
                    $this->command->error(
                        "No se pudo asignar grupo para área grupal '{$area->name}' (olympian_id {$olympian->id})"
                    );
                    continue;
                }

                Inscription::create([
                    'olympian_id' => $olympian->id,
                    'area_id'     => $area->id,
                    'grade_id'    => $grade->id,
                    'status'      => 'inscribed',
                    'group_id'    => $groupId,
                ]);
            }
        }
    }
}
