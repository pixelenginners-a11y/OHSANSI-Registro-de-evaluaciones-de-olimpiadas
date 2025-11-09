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
}
