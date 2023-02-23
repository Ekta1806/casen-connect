<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use App\Models\Classes;


class SendInvite extends BaseModel
{
    use HasFactory;
     public $fillable = [
        'email',
        'token',
        'teacher_id',
        'class_id',
        'track_id'
        
    ];
    
}
