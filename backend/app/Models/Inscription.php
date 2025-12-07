<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = [
        'olympian_id',
        'area_id',
        'grade_id',
        'group_id',
        'is_group',
        'status',
    ];

    const STATUS_INSCRIBED = 'inscribed';
    const STATUS_CLASSIFIED = 'classified';
    const STATUS_NOT_CLASSIFIED = 'not_classified';
    const STATUS_DISQUALIFIED = 'disqualified';
    const STATUS_FINALIST = 'finalist';
    const STATUS_GOLD_MEDALIST = 'gold_medalist';
    const STATUS_SILVER_MEDALIST = 'silver_medalist';
    const STATUS_BRONZE_MEDALIST = 'bronze_medalist';
    const STATUS_HONORABLE_MENTION = 'honorable_mention';

    public function olympian()
    {
        return $this->belongsTo(Olympian::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    } 

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
