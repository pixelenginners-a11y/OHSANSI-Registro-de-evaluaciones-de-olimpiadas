<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    /** @use HasFactory<\Database\Factories\ListingFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'area_id',
        'grade_id',
        'type',
        'description',
        'is_published',
        'published_at',
        'visibility',
    ];

    public function listItems()
    {
        return $this->hasMany(ListItem::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }


}
