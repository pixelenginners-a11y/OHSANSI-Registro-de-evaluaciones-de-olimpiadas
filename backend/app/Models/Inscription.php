<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    protected $fillable = [
        'olympian_id',
        'area_id',
        'grade_id',
        'status',
    ];
    
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
}
