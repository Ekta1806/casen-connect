<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use App\BaseModel;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ClassPostsComment;
use App\Models\ClassPostsLike;
use App\Models\DailyQuestion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ClassPost extends BaseModel implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    /**
     * The dates that will be mutated to Carbon instance.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at',
    ];

    protected $appends = ['thumb_url'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'classes_id', 'teacher_id', 'content', 'is_pinpost'
    ];

    public function getThumbUrlAttribute()
    {
        $thumbUrl = [];
        foreach($this->getMedia('class_posts') as $imageUrl){
            if($imageUrl->hasGeneratedConversion('classpost_thumb')){
                $conversationUrl = $imageUrl->getUrl('classpost_thumb') ? $imageUrl->getUrl('classpost_thumb') : $imageUrl->getUrl();
                $thumbUrl[] = $conversationUrl;
            } else {
                $conversationUrl = $imageUrl->getUrl();
                $thumbUrl[] = $conversationUrl;
            }
        }
        return $thumbUrl;
    }

    /**
     * A class post belongs to a single class.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function class()
    {
        return $this->belongsTo(Classes::class, 'classes_id', 'id');
    }

    /**
     * A class post belongs to a single teacher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }


    public function comments()
    {
        return $this->hasMany(ClassPostsComment::class, 'class_post_id', 'id');
    }


    public function likes()
    {
        return $this->hasMany(ClassPostsLike::class, 'class_post_id', 'id');
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('classpost_thumb') 
            ->quality(50)
            ->sharpen(10)
            ->performOnCollections('class_posts');
    }
}
