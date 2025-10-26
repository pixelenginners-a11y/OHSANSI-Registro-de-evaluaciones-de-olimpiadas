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
