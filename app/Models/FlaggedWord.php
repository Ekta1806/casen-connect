<?php

namespace App\Models;

use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Student\Student;


class FlaggedWord extends BaseModel
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'student_id', 'word_phrase','content'
    ];


    public function wordUsedBy()
    {
        return $this->hasOne(Student::class,'id','student_id');
    }

}
