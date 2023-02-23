<?php

namespace App\Models\Student;

use App\Models\Student\Comment;
use App\Models\Student\Like;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\PostHistory;
use App\BaseModel;

class Post extends BaseModel implements HasMedia
{
    use InteractsWithMedia;

    /**
     * The dates that will be mutated to Carbon instance.
     *
     * @var array
     */
    protected $dates = [
        'status_updated_on',
    ];

    protected $appends = ['thumb_url'];

    /**
     * The attributes that are mass assigmable.
     *
     * @var array
     */
    protected $fillable = [
        'desc', 'image', 'created_by', 'media_id', 'status', 'status_updated_on', 'status_updated_by_teacher_id',
        'notes',
    ];

    public function getThumbUrlAttribute()
    {
        $thumbUrl = [];
        foreach($this->getMedia('post') as $imageUrl){
            if($imageUrl->hasGeneratedConversion('post_thumb')){
                $conversationUrl = ($imageUrl->getUrl('post_thumb') ? $imageUrl->getUrl('post_thumb') : $imageUrl->getUrl());
                $thumbUrl[] = $conversationUrl;
            } else {
                $conversationUrl = $imageUrl->getUrl();
                $thumbUrl[] = $conversationUrl;
            }
        }
        return $thumbUrl;
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id', 'id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'post_id', 'id');
    }

    public function post_notes()
    {
        return $this->hasMany(PostHistory::class, 'post_id', 'id');
    }

    /**
     * Get the user that owns the Post
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function user()
    {
        return $this->belongsTo(Student::class, 'created_by', 'id');
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('post_thumb') 
            ->quality(50)
            ->sharpen(10)
            ->performOnCollections('post');
    }
}
