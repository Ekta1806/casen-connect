<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class Like extends BaseModel
{
    use HasFactory;

    /**
     * The guard that will be used by the model to authenticate.
     *
     * @var string
     */
    protected $guard = 'student';

    protected $table = 'likes';

    public $timestamps = false;

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'post_id', 'liked_by','teacher_id','admin_id'
    ];

}
