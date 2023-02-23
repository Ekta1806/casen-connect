<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class IntakeQuestionsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->guard('admin')->check();
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
            'option_1' => 'required',
            'option_2' => 'required',
            'option_3' => 'required',
            'option_4' => 'required',
            'correct_answer' => 'required',
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
            'content.required' => 'Please Enter Question here.',
            'option_1.required' => 'Please Fill Option 1',
            'option_2.required' => 'Please Fill Option 2',
            'option_3.required' => 'Please Fill Option 3',
            'option_4.required' => 'Please Fill Option 4',
            'correct_answer' => 'Please Select Correct Answer Option',
        ];
    }
}
