<?php

namespace App\Models\Student;

use App\BaseModel;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Video extends BaseModel implements HasMedia
{
    use InteractsWithMedia, Notifiable;

    /**
     * The guard that will be used by the model to authenticate.
     *
     * @var string
     */
    protected $guard = 'student';

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'description', 'student_id',
    ];

    /**
     * Ignore the timestamps.
     *
     * @var boolean
     */
    public $timestamps = false;

    /**
     * A video uploaded belongs to a single student.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * A video has many comments.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(\App\Models\VideoComment::class);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('my-conversion')
            ->width(150)
            ->height(150)
            ->withResponsiveImages();
    }

}
