<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class SiteSetting extends BaseModel
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'name', 'value',
    ];
}
