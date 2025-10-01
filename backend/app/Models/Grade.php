<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Grade extends Model
{
    use SoftDeletes;

    protected $fillable = [
      'name', 
      'description', 
      'active'
    ];

    public function areaGrades()
    {
        return $this->hasMany(AreaGrade::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
