<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationChangeLog extends Model
{
    protected $fillable = [
        'evaluation_id',
        'user_id',
        'previous_score',
        'new_score',
        'description',
    ];

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }
}
