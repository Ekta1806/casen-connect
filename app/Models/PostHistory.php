<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class PostHistory extends BaseModel
{
    use HasFactory;
    protected $fillable = [
        'post_id', 'desc', 'notes', 'status'
    ];
}
