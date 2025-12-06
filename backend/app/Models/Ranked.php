<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ranked extends Model
{
    protected $table = 'ranked';

    protected $fillable = [
        'olimpiada_id',
        'inscription_id',
        'group_id',
        'area_id',
        'grade_id',
        'position',
        'final_score',
    ];

    protected $casts = [
        'final_score' => 'decimal:2',
    ];

    // Relación con Olimpiada
    public function olimpiada()
    {
        return $this->belongsTo(Olimpiada::class);
    }

    // Relación con Inscription (para individuales)
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    // Relación con Group (para grupos)
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Relación con Area
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    // Relación con Grade
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}
