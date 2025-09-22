<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationChangeLog extends Model
{
    public function evaluator()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }
}
