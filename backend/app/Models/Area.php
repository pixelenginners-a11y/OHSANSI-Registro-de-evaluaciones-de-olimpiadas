<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Area extends Model
{
    use SoftDeletes;

    protected $fillable = [
      'name', 
      'description', 
      'active'
    ];

    public function medalParameters()
    {
        return $this->hasOne(MedalParameter::class);
    }

    public function evaluatorAreas()
    {
        return $this->hasMany(EvaluatorArea::class);
    }

    public function inscriptions()
    {
        return $this->belongsTo(Inscription::class);
    } 

    public function areaGrades()
    {
        return $this->hasMany(AreaGrade::class);
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }
}
