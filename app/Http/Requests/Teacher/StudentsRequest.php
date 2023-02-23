<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StudentsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $passwordRule = 'required';
        $confirmPasswordRule = 'required';
        if ($this->isMethod('patch') || $this->isMethod('put')) {
            $passwordRule = 'nullable';
            $confirmPasswordRule = 'nullable';
        }

        return [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'required|email:filter|unique:students,email,'. $this->studentId,
            'password' => $passwordRule,
            'confirm_password' => $confirmPasswordRule.'|same:password',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:1000',
            'is_active' => 'nullable',
            'level_id' => 'required|exists:levels,id',
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
            'level_id.required' => 'Please select a level.',
            'level_id.exists' => 'Invalid level selected.',
        ];
    }
}
