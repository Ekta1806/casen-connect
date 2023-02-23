<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\BaseModel;
use Illuminate\Support\Facades\Http;

class Word extends BaseModel
{
    use HasFactory;

    /**
     * The attributes that are mass assigmable.
     *
     * @var [type]
     */
    public $fillable = [
        'created_by', 'content_word', 'description', 'admin_id', 'teacher_id',
    ];

    public function owner()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }

    public function webpurify($word)
    {
        $response = Http::asForm()->post('http://api1.webpurify.com/services/rest', [
            'api_key' => config('services.webpurify.license_key'),
            'method'  => 'webpurify.live.removefromblocklist',
            'word'    => $word,
            'format'  => 'json',
        ]);
        return $response;
    }
}
