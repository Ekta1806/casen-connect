<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends BaseModel
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
        'track_id', 'content', 'type', 'answers', 'correct_answer', 'descriptive_answer_length', 'teacher_id','level_id',
    ];

    protected $casts = [
        'answers' => 'array',
        'correct_answer' => 'array',
        'descriptive_answer_length' => 'array',
    ];

    /**
     * A question belongs to a single track.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function track()
    {
        return $this->belongsTo(Track::class);
    }

    /**
     * A question belongs to a single level.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * A Question belongs to a single teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
