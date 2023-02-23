<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
    public function rules()
    {
        return [
            'first_name' => 'required',
            'last_name'  => 'required',
            'track_id' => 'required|exists:tracks,id',
            'email' => 'required|email|unique:teachers,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
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
            'track_id.required' => 'Please select track.',
            'track_id.exists' => 'Invalid track selected.',
        ];
    }
}
