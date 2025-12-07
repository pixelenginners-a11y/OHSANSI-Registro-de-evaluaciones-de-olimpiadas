<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitionPhase extends Model
{
    protected $fillable = [
        'phase',
        'active',
        'started_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'active' => 'boolean',
    ];

    const PHASE_INSCRIPTION = 'inscripcion';
    const PHASE_CLASSIFICATION = 'clasificacion';
    const PHASE_FINAL = 'final';
    const PHASE_AWARDING = 'premiacion';

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
