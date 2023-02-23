<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class QuestionsRequest extends FormRequest
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
            'track_id' => 'required|exists:tracks,id',
            'content' => 'required',
            'level_id' => 'required|exists:levels,id',
            'type' => 'required|in:multiple-choice,descriptive',
            'minimum_length' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'descriptive')
                        ? 'required_if:type,descriptive|numeric|min:0' : 'nullable',
            'maximum_length' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'descriptive')
                        ? 'required_if:type,descriptive|numeric|min:0' : 'nullable',
            'answer_1' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_2' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_3' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_4' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'correct_answer_option' => (($this->isMethod('post') || $this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
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
            'track_id.required' => 'Please select the track.',
            'track_id.exists' => 'Invalid track selected.',
            'level_id.required' => 'Please select the level.',
            'minimum_length.required_if' => 'The minimum length of the answer is required if type is Descriptive.',
            'minimum_length.numeric' => 'The minimum length of the answer must be numeric value.',
            'minimum_length.min' => 'The minimum length of the answer must be greater than 0.',

            'maximum_length.required_if' => 'The maximum length of the answer is required if type is Descriptive.',
            'maximum_length.numeric' => 'The maximum length of the answer must be numeric value.',
            'maximum_length.max' => 'The maximum length of the answer must be greater than 0.',

            'answer_1.required_if' => 'The answer option 1 is required if type is Multiple Choice.',
            'answer_2.required_if' => 'The answer option 2 is required if type is Multiple Choice.',
            'answer_3.required_if' => 'The answer option 3 is required if type is Multiple Choice.',
            'answer_4.required_if' => 'The answer option 4 is required if type is Multiple Choice.',

            'correct_answer_option.required_if' => 'The correct answer option is required if type is Multiple Choice.',
        ];
    }
}
