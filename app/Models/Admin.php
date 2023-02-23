<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable implements HasMedia
{
    use HasFactory, Notifiable, InteractsWithMedia, SoftDeletes;

    /**
     * The guard that will be used by this model.
     *
     * @var string
     */
    protected $guard = 'admin';

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
        'first_name', 'last_name', 'email', 'password', 'remember_token', 'contact_number',
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
     * Get the profile picutre of the admin user.
     *
     * @return array|bool
     */
    public function getProfilePicture()
    {
        return cache('admin_dp_'. $this->id) ?? false;
    }

    public function getFullNameAttribute()
    {
        return ucfirst($this->first_name) . ' ' . ucfirst($this->last_name);
    }
}
