<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluatorGrade extends Model
{
    protected $fillable = [
        'evaluator_id',
        'grade_id',
    ];

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}
