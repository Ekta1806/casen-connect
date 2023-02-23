<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student\Student;
use App\Models\Admin;
use App\Models\Teacher;

class AdminPostComment extends Model
{
    use HasFactory;
    protected $table = 'admin_posts_comments';
    protected $fillable = [
        'admin_post_id', 'content','commented_by','admin_id','student_id','teacher_id','status'
    ];
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
}
