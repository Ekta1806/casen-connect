<?php

namespace App\Http\Requests\Student;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SettingRequest extends FormRequest
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
            'last_name' => 'required',
            'email' => 'required|email:filter|unique:students,email,' . auth()->id(),
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,JPG,JPEG,PNG|max:8000',
            'current_password' => 'sometimes|required_with:new_password',
            'new_password' => '',
            'repeat_new_password' => 'same:new_password'
        ];
    }
}
