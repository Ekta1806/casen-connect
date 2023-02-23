<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\ClassPost;
use Illuminate\Http\Request;

class ClassPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->guard('teacher')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {
        return [
            'images.*' => 'mimes:jpeg,png,jpg|max:8000',
            'content' => 'required',
            'classes_id' => 'required|exists:classes,id',
        ];
    }

    /**
     * Custom validation error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'classes_id.required' => 'The select class field is required.',
            'classes_id.exists' => 'The selected class does not exists.',
        ];
    }
}
