<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use App\Models\Teacher;
use App\Models\Admin;

class Comment extends BaseModel
{
    use HasFactory;

    protected $dates = [
        'status_updated_on',
    ];

    protected $fillable = [
        'comment', 'commented_by', 'post_id', 'status', 'status_updated_on', 'status_updated_by_teacher_id',
        'notes','admin_id'
    ];

    public function user()
    {
        return $this->belongsTo(Student::class, 'commented_by', 'id');
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }
}
