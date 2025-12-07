<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'area_id',
        'grade_id',
    ];

    const STATUS_INSCRIBED = 'inscribed';
    const STATUS_CLASIFICADOS = 'classified';
    const STATUS_NOT_CLASSIFIED = 'not_classified';
    const STATUS_DISQUALIFIED = 'disqualified';
    const STATUS_FINALIST = 'finalist';
    const STATUS_GOLD_MEDALIST = 'gold_medalist';
    const STATUS_SILVER_MEDALIST = 'silver_medalist';
    const STATUS_BRONZE_MEDALIST = 'bronze_medalist';
    const STATUS_HONORABLE_MENTION = 'honorable_mention';

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function members()
    {
        return $this->hasMany(GroupMember::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function listItem()
    {
        return $this->hasMany(listItem::class);
    }
}
