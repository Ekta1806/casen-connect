<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdminPostsRequest extends FormRequest
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
            'images.*' => 'mimes:jpeg,png,jpg|max:8000',
            'content' => $this->isMethod('put') || $this->isMethod('patch') ?'nullable':'required',
            'classes_id' => 'required',
        ];
    }
    public function messages()
    {
        return [
            'classes_id.required' => 'The select class field is required.',
        ];
    }
}
