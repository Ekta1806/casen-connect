<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class ClassPostsLike extends BaseModel
{
    use HasFactory;
    
      /**
     * The dates that will be mutated to Carbon instance.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at',
    ];

     /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'class_post_id', 'liked_by','liked_id','teacher_id','admin_id'
    ];

}
