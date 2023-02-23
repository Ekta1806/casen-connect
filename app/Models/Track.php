<?php

namespace App\Models;

use App\Models\Classes;
use App\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Track extends BaseModel
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
     * The attributes that are mass assigmable.
     *
     * @var [type]
     */
    public $fillable = [
        'name', 'short_description',
    ];

    /**
     * A track can have multiple classes
     *
     * @return  \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function Classes()
    {
    	return $this->hasMany(Classes::class, 'track_id');
    }

    /**
     * A track can have multiple teachers.
     *
     * @return  \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }
}
