<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminPostLike extends Model
{
    use HasFactory;
    protected $table = 'admin_posts_likes';
    protected $fillable = [
        'admin_post_id', 'liked_by','admin_id','teacher_id','student_id'
    ];
}
