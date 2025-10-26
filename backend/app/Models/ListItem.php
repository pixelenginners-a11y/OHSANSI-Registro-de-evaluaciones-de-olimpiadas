<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListItem extends Model
{
    /** @use HasFactory<\Database\Factories\ListItemFactory> */
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'inscription_id',
        'group_id',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
