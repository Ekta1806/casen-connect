<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class CommentHistory extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'post_id', 'comment_id', 'comment', 'notes', 'status'
    ];
}
