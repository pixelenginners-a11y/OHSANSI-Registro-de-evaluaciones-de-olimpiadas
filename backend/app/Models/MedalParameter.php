<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedalParameter extends Model
{
    protected $fillable = [
        'area_id',
        'gold',
        'silver',
        'bronze',
        'honor_mentions',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }
}
