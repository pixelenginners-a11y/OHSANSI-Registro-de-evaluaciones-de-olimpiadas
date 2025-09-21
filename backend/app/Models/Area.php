<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'estado'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    
    public function scopeActivo($query)
    {
        return $query->where('estado', 'Activo');
    }

    public function scopeInactivo($query)
    {
        return $query->where('estado', 'Inactivo');
    }
}