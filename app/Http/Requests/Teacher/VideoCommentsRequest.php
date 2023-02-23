<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class VideoCommentsRequest extends FormRequest
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
    public function rules()
    {
        return [
            'content' => 'required',
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
            'content.required' => 'The add comment field is required.',
        ];
    }
}
