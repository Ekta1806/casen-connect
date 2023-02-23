<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyQuestion extends BaseModel
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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'track_id', 'track_details', 'teacher_id','teacher_details', 'classes_id', 'student_id','classes_details', 'question_id', 'question_details', 'ask_on_date', 'level_id', 'priority', 'added_by',
    ];

    protected $casts = [
        'track_details' => 'array',
        'classes_details' => 'array',
        'teacher_details' => 'array',
        'question_details' => 'array',
        'student_id' =>'array',
    ];

    /**
     * A daily question belongs to a single class.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function track()
    {
        return $this->belongsTo(Track::class);
    }

    /**
     * A daily question belongs to a single class.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classes()
    {
        return $this->belongsTo(Classes::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }
    

    
}
