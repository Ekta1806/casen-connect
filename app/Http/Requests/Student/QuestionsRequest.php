<?php

namespace App\Http\Requests\Student;
use Illuminate\Http\Request;

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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {

        if($request->type == "descriptive"){
     
            return [
                'desc_answer' =>  'required'
            ];
        }else{
            return[
                'option_answer' => 'required|same:answer',
                ];
            }
    }

    public function messages()
    {
        return [
         'desc_answer.required' => 'This field is required',
         'option_answer.same'   => 'Oops... you have chosen wrong option please select another answer',
         ];
    }
}
