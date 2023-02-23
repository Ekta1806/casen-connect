<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use App\Models\Student\Student;
use App\Models\ClassPost;
use App\Models\Admin;


class ClassPostsComment extends BaseModel
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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'class_post_id', 'content','commented_by','commentor_id', 'status'
    ];

    public function creator()
    {
        return $this->belongsTo(Student::class, 'commentor_id', 'id');
    }

    public function classPost(){
        return $this->hasOne(ClassPost::class, 'id', 'class_post_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'commentor_id', 'id');
    }

}
