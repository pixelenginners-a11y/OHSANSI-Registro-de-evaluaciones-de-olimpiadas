<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    public function areaGrades()
    {
        return $this->hasMany(AreaGrade::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
