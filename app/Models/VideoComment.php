<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoComment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'student_id', 'teacher_id', 'video_id', 'content',
    ];

    /**
     * A video comment belongs to a single video.
     *
     * @return \Illuminate\Database\Eloquent\Relation\BelongsTo
     */
    public function video()
    {
        return $this->belongsTo(Video::class);
    }

    /**
     * A video comment belongs to a single teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relation\BelongsTo
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
