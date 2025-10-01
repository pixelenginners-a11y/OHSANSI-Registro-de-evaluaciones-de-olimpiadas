<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluatorArea extends Model
{
    protected $fillable = ['user_id', 'area_id'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
