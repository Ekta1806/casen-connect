<?php

namespace App\Models\Student;

use App\Models\Classes;
use App\Models\ClassPostsComment;
use App\Models\ClassPostsLike;
use App\Models\Student\ClassStudent;
use App\Models\Level;
use App\Models\Student\Like;
use App\Models\Student\Post;
use App\Models\Student\Video;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use App\Models\Teacher;

class Student extends Authenticatable implements HasMedia
{
    use HasFactory, Notifiable, InteractsWithMedia, SoftDeletes;

    /**
     * The guard that will be used by the model to authenticate.
     *
     * @var string
     */
    protected $guard = 'student';

    /**
     * The dates that will be mutated to Carbon instance.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at',
    ];

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'google_id', 'avatar_original', 'class_id', 'is_active',
        'email_preferences', 'is_private', 'level_id',
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
     * The attributes that will be hidden while fetching data.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that will be casted to different type at run time.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the full name of the user.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return ucfirst($this->first_name) . ' ' . ucfirst($this->last_name);
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'created_by', 'id');
    }

    public function comments()
    {

        return $this->hasMany(Comment::class, 'commented_by', 'id');

    }
    public function classPostcomments()
    {
        return $this->hasMany(ClassPostsComment::class, 'commentor_id', 'id');
    }

    public function pendingPosts()
    {
        return $this->posts()->where('status', '=', 'pending');
    }

    public function pendingComments()
    {
        return $this->comments()->where('status', '=', 'pending');
    }

    public function pendingClassPostComments()
    {
        return $this->classPostcomments()->where('status', '=', 'pending');
    }

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'class_student', 'student_id', 'class_id')->withPivot('progress_handler');
    }

    public function videos()
    {
        return $this->hasMany(Video::class, 'student_id', 'id');
    }

    /**
     * A student belongs to a single level.
     *
     * @return \Illuminate\Database\Eloquent\Reslations\BelongsTo
     */
    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    /**
     * Check if the student is a member of given class.
     *
     * @param  \App\Models\Classes  $class
     * @return boolean
     */
    public function isMemberOfClass($class)
    {
        if ($class == null) {
            return false;
        }
        return $class->students()->where('id', $this->id)->exists();
    }

    /**
     * Check if the student is a member of any classes of the given track id.
     *
     * @param  integer  $trackId
     * @return boolean
     */
    public function isMemberOfClassInSameTrack($trackId)
    {
        if ($trackId == null) {
            return false;
        }

        return $this->classes()->where('track_id', $trackId)->exists();
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    /**
     * A student answers many daily questions.
     *
     * @return \Illuminate\Database\Eloquent\Reslations\HasMany
     */
    public function dailyQuestionAnswers()
    {
        return $this->hasMany(StudentAnswers::class);
    }

    public function getProfilePicture()
    {
        $mediaCollection = $this->getMedia('profile_pictures')->first();
        if (!$mediaCollection) {
            return false;
        }
        return $mediaCollection->getFullUrl();
    }
   
    public function getAvatarOriginalAttribute(){
        $mediaCollection = $this->getMedia('profile_pictures')->first();
        if (!$mediaCollection) {
            return false;
        }
        return $mediaCollection->getFullUrl();
    }
    public function classStudent()
    {
        return $this->belongsTo(ClassStudent::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class,'liked_by', 'id');
    }

    public function classPostslikes()
    {
        return $this->hasMany(ClassPostsLike::class,'liked_id', 'id');
    }

    public static function boot() {
        parent::boot();

        static::deleting(function($student) {
            $student->dailyQuestionAnswers && $student->dailyQuestionAnswers()->delete();
            $student->comments && $student->comments()->delete();
            $student->posts && $student->posts()->delete();
            $student->classPostcomments && $student->classPostcomments()->delete();
            $student->classStudent && $student->classStudent()->delete();
            $student->likes && $student->likes()->delete();
            $student->classPostslikes && $student->classPostslikes()->delete();
        });
    }
}
