<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'inscription_id',
        'group_id',
        'evaluator_id',
        'score',
        'description',
        'phase',
        'status',
    ];

    const STATUS_PENDING = 'pendiente';
    const STATUS_CLASIFICADOS = 'clasificado';
    const STATUS_NO_CLASIFICADOS = 'no_clasificado';
    const STATUS_DESCLASIFICADOS = 'desclasificado';

    const PHASE_CLASIFICACION = 'clasificacion';
    const PHASE_FINAL = 'final';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_CLASIFICADOS,
            self::STATUS_NO_CLASIFICADOS,
            self::STATUS_DESCLASIFICADOS,
        ];
    }

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

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
