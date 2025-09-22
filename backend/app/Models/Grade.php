<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    public function area()
    {
        return $this->belongsTo(Area::class);
    } 

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
