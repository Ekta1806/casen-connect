<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Notifications\Notifiable;
use App\Models\Student\Like;
use App\Models\Student\Comment;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Teacher extends Authenticatable implements HasMedia
{
    use HasFactory, Notifiable, InteractsWithMedia, SoftDeletes;

    /**
     * The guard that will be used by this model.
     *
     * @var string
     */
    protected $guard = 'teacher';

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
        'first_name', 'last_name', 'email', 'password', 'remember_token', 'track_id', 'avatar_original',
        'is_active', 'email_preferences', 'contact_number', 'google_id',
    ];

    /**
     * The attributes that will be hidden.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the email preferences in array format.
     *
     * @return array
     */
    public function getEmailPreferencesAttribute()
    {
        return json_decode($this->attributes['email_preferences'], true);
    }

    /**
     * Set the email preferences in json object.
     *
     * @param array  $data
     */
    public function setEmailPreferencesAttribute($data)
    {
        $this->attributes['email_preferences'] = json_encode($data);
    }

    /**
     * A track belongs to a single teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function track()
    {
        return $this->belongsTo(Track::class);
    }

    /**
     * A teacher has many classes.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    // public function classes()
    // {
    //     return $this->hasMany(Classes::class)->where('teacher_id','!=',0);
    // }

    public function class()
    {
        return $this->belongsToMany(Classes::class,'class_teacher', 'teacher_id', 'class_id');
    }

    /**
     * A Teacher has many questions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    /**
     * A teacher has many class posts.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classPosts()
    {
        return $this->hasMany(ClassPost::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class,'teacher_id','id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class,'teacher_id','id');
    }

    public function classPostsLikes()
    {
        return $this->hasMany(ClassPostsLike::class,'teacher_id','id');
    }

    public function classPostsComment()
    {
        return $this->hasMany(ClassPostsComment::class,'commented_by','teacher');
    }
    /**
     * Get the profile picutre of the Teacher user.
     *
     * @return bool|string
     */
    public function getProfilePicture()
    {
        return cache('teacher_dp_'. $this->id) ?? false;
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($teacher) {
            $teacher->classes && $teacher->classes()->delete();
            $teacher->classPosts && $teacher->classPosts()->delete();
            $teacher->questions && $teacher->questions()->delete();
            $teacher->classPostcomments && $teacher->classPostcomments()->delete();
            $teacher->classPostsLikes && $teacher->classPostsLikes()->delete();
            $teacher->likes && $teacher->likes()->delete();
            $teacher->comments && $teacher->comments()->delete();
            $teacher->class && $teacher->class()->delete();

        });
    }

    public function getAvatarOriginalAttribute(){
        $mediaCollection = $this->getMedia('profile_pictures')->first();
        if (!$mediaCollection) {
            return false;
        }
        return $mediaCollection->getFullUrl();
    }
}
