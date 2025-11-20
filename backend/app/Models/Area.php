<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Area extends Model
{
    protected $fillable = [
      'name', 
      'description', 
      'active',
      'responsable_id',
      'is_group',
      'group_min_size',
      'group_max_size',
    ];

    public function medalParameter()
    {
        return $this->hasOne(MedalParameter::class);
    }

    public function evaluatorAreas()
    {
        return $this->hasMany(EvaluatorArea::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    } 

    public function areaGrades()
    {
        return $this->hasMany(AreaGrade::class);
    }

    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'area_grades');
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}
