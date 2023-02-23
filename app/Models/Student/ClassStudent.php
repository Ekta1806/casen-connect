<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;

class ClassStudent extends BaseModel
{
    use HasFactory;
    protected $table = 'class_student';
}
