<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntakeQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'content', 'option_1', 'option_2', 'option_3', 'option_4'
    ];
}
