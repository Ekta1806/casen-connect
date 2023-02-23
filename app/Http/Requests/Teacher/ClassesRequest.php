<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class ClassesRequest extends FormRequest
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
            'name' => 'required|unique:classes,name,'.$this->id.'|max:255',
            'description' => 'required|max:255',
            'track_id' => 'required|exists:tracks,id',
            'teacher_ids' => 'required',
            'teacher_ids.*' => 'required'
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
            'track_id.required' => 'The select track field is required.',
            'track_id.exists' => 'The selected track does not exists.',
            'teacher_ids.*' => 'The select teachers field is required.'
        ];
    }
}
