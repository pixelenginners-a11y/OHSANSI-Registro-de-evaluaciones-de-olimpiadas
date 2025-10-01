<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Olympian extends Model
{
    protected $fillable = [
        'full_name',
        'identity_document',
        'educational_institution',
        'department',
        'academic_tutor',
    ];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function areas()
    {
        return $this->belongsToMany(Area::class, 'inscriptions');
    }

    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'inscriptions');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
