<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    protected $fillable = [
        'group_id',
        'olympian_id',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function olympian()
    {
        return $this->belongsTo(Olympian::class);
    }
}
