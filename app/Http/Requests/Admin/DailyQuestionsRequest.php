<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DailyQuestionsRequest extends FormRequest
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
    public function rules(Request $request)
    {   
        
        if($request->priority === 'immediately'){
            $request->merge([
                'ask_on_date' => Carbon::now()->format('Y-m-d')
            ]);
        }
        
        $rule =  [
            'classes_id' => 'required|exists:classes,id',
            'question_id' => 'required|exists:questions,id',
            'priority' => 'required|in:normal,immediately',
            'students' => $this->isMethod('put') || $this->isMethod('patch') ? 'nullable': 'required',
            'level_id' => $this->isMethod('put') || $this->isMethod('patch')
            ? 'nullable' : 'required|exists:levels,id',

            'type' => $this->isMethod('put') || $this->isMethod('patch')
                        ? 'required|in:multiple-choice,descriptive' : 'nullable',

                        
            'content' => $this->isMethod('put') || $this->isMethod('patch')
                        ? 'required' : 'nullable',

            'minimum_length' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'descriptive')
                        ? 'required_if:type,descriptive|numeric|min:0' : 'nullable',
            'maximum_length' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'descriptive')
                        ? 'required_if:type,descriptive|numeric|min:0' : 'nullable',

            'answer_1' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_2' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_3' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'answer_4' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
            'correct_answer_option' => (($this->isMethod('put') || $this->isMethod('patch')) && $this->type === 'multiple-choice')
                        ? 'required_if:type,multiple-choice' : 'nullable',
        ];
        if($this->isMethod('put') || $this->isMethod('patch')){
            if($request->students == "per_student") {
                $rule['students_id'] = 'required';
            }
        }else{
            if($request->students == "per_student") {
                $rule['students_id.*'] = 'required';
            }
        }
        if($this->isMethod('patch')){
           
            $rule['ask_on_date'] = 'required';
        }
        else{
            $rule['ask_on_date'] = 'required';
        }
        return $rule;

    }

    /**
     * Custom validation error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'classes_id.required' => 'Please select the class.',
            'classes_id.exist' => 'Invalid class selected.',
            'question_id.required' => 'Please select a question.',
            'question_id.exist' => 'Invalid question selected.',
            'level_id.required' => 'Please select the level.',
            'priority.required' => 'Please select a priority of this question.',
            'priority.in' => 'Priority must be in normal or immediately.',

            'type.in' => 'The type field must be either Multiple Choice or Descriptive.',

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
