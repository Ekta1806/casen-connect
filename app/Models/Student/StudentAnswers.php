<?php

namespace App\Models\Student;

use App\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentAnswers extends BaseModel
{
    use HasFactory;

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'student_id', 'question_id', 'teacher_id', 'class_id', 'option_answer', 'attempt', 'desc_answer',
        'answer_approved', 'options', 'status', 'question_content',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    /**
     * A descriptive answer belongs to a student.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
