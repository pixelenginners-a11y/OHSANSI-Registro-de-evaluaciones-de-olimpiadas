<?php

namespace App\Services;

use App\Models\Group;

class GroupService
{
    public function store($name, $areaId, $gradeId)
    {
        return Group::create([
            'name' => $name,
            'area_id' => $areaId,
            'grade_id' => $gradeId
        ]);
    }

    public function findByNameAreaGrade($name, $areaId, $gradeId)
    {
        return Group::where('name', $name)
            ->where('area_id', $areaId)
            ->where('grade_id', $gradeId)
            ->first();
    }
}