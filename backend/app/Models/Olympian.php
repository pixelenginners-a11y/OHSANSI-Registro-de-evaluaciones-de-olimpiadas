<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Olympian extends Model
{
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
