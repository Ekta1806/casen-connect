<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\AdminPostLike;
use App\Models\AdminPostComment;
use App\BaseModel;
use App\Models\Classes;
use App\Models\Admin;

class AdminPost extends BaseModel implements HasMedia
{
    use InteractsWithMedia;
    protected $fillable = [
        'classes_id', 'content','media_id', 'admin_id'
    ];

    protected $appends = ['thumb_url'];
    public function comments()
    {
        return $this->hasMany(AdminPostComment::class, 'admin_post_id', 'id');
    }

    public function likes()
    {
        return $this->hasMany(AdminPostLike::class, 'admin_post_id', 'id');
    }
    public function getThumbUrlAttribute()
    {
        $thumbUrl = [];
        foreach($this->getMedia('admin_posts') as $imageUrl){
            if($imageUrl->hasGeneratedConversion('adminpost_thumb')){
                $conversationUrl = ($imageUrl->getUrl('adminpost_thumb') ? $imageUrl->getUrl('adminpost_thumb') : $imageUrl->getUrl());
                $thumbUrl[] = $conversationUrl;
            } else {
                $conversationUrl = $imageUrl->getUrl();
                $thumbUrl[] = $conversationUrl;
            }
        }
        return $thumbUrl;
    }
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('adminpost_thumb') 
            ->quality(50)
            ->sharpen(10)
            ->performOnCollections('admin_posts');
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'classes_id', 'id');
    }
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }

}
