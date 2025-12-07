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
        'competition_phase_id',
        'description',
        'status',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_IN_REVIEW = 'in_review';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_IN_REVIEW,
            self::STATUS_APPROVED,
            self::STATUS_REJECTED,
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

    public function competitionPhase()
    {
        return $this->belongsTo(CompetitionPhase::class);
    }
}
