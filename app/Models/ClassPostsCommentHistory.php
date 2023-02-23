<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class ClassPostsCommentHistory extends BaseModel
{
    use HasFactory;
    protected $fillable = [
        'class_post_id', 'class_post_comment_id', 'comment', 'notes', 'status'
    ];
}
