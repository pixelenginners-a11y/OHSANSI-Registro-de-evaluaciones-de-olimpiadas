<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
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

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }
}
