<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Olimpiada extends Model
{
    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'fase',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    const FASE_INSCRIPCION = 'inscripcion';
    const FASE_CLASIFICATORIA = 'clasificatoria';
    const FASE_FINAL = 'final';
}
