<?php

namespace App\Models;

use App\Models\Post;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;


class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes,InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'first_name',
        'last_name',
        'status',
        'google_id',
        'track_id',
        'avatar_original',
        'track_id',
        'class_id',
        'teacher_id'
    ];

    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    /**
     * Get the user's full name.
     *
     * @param  string  $value
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->first . ' ' . $this->last;
    }
     public function track(){
        return $this->belongsTo(Track::class,'track_id','id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'created_by', 'id');
    }  
}
