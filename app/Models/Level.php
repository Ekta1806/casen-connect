<?php

namespace App\Models;

use App\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Level extends BaseModel
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'short_description',
    ];
}
