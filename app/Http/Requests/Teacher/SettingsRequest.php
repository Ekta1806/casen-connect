<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class SettingsRequest extends FormRequest
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
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email:filter|unique:teachers,email,' . auth()->id(),
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:8000',
            'contact_number' => 'nullable|numeric',
        ];
    }
}
