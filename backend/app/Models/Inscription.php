<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
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
