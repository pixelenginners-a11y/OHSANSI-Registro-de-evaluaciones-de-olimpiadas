<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaGrade extends Model
{
    protected $fillable = ['area_id', 'grade_id'];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
}
