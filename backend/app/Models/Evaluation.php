<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    public function changeLogs()
    {
        return $this->hasMany(EvaluationChangeLog::class);
    }
}
