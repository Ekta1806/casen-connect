<?php

namespace App\Http\Requests\Student;

use App\Models\Student\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {

        if ($this->isMethod('patch')) {
            $post  = Post::find($request->post_id);
            $image = $post->getMedia('post')->count();

            if ($image > 0) {
                $image = '';
                $desc  = '';
            } else {
                $image = 'required_without:desc';
                $desc  = 'required_without:image';
            }
        } else {
            $image = 'required_without:desc';
            $desc  = 'required_without:image';
        }

        return [
            'image'   => $image,
            'image.*' => 'mimes:jpeg,png,jpg|max:8000',
            'desc'    => $desc,
        ];
    }
}
