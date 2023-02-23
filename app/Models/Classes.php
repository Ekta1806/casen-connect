<?php

namespace App\Models;

use App\Models\Track;
use App\BaseModel;
use App\Models\Student\Student;
use App\Models\DailyQuestion;
use App\Models\Student\StudentAnswers;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ClassTeacher;


use Illuminate\Database\Eloquent\Factories\HasFactory;

class Classes extends BaseModel
{
    use HasFactory, SoftDeletes;

    /**
     * The dates that will be mutated to Carbon instance.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at',
    ];

    /**
     * The attributes that are mass assignabe.
     *
     * @var array
     */
    public $fillable = [
        'name', 'description', 'track_id', 'teacher_id',
    ];

    /**
     * A class belongs to a single track.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function track()
    {
    	return $this->belongsTo(Track::class);
    }

    /**
     * A class belongs to a single teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    // public function teacher()
    // {
    //     return $this->belongsTo(Teacher::class);
    // }

    public function students()
    {
        return $this->belongsToMany(Student::class,'class_student','class_id','student_id')->withPivot('progress_handler');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class,'class_teacher','class_id','teacher_id');
    }
    public function classTeachers()
    {
        return $this->hasMany(ClassTeacher::class,'class_id');
    }

    public function questions()
    {
        return $this->hasOne(DailyQuestion::class, 'classes_id', 'id');
    }

    public function answered()
    {
        return $this->hasMany(StudentAnswers::class, 'class_id', 'id');
    }

    /**
     * A class has many class posts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function posts()
    {
        return $this->hasMany(ClassPost::class);
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($classes) {
            $classes->questions()->delete();
            $classes->answered()->delete();
            $classes->posts()->delete();
            $classes->students()->delete();
            $classes->classTeachers()->delete();
        });
    }
}
