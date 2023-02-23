import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';

export default function Edit(props) {
  const { data, setData } = useForm({
    content: props.question.content,
    option_1: props.question.option_1,
    option_2: props.question.option_2,
    option_3: props.question.option_3,
    option_4: props.question.option_4,
    correct_answer: props.correctAnswer,
  });

  const correctAnswerOptions = [
    { value: 'option_1', label: 'Answer Option 1' },
    { value: 'option_2', label: 'Answer Option 2' },
    { value: 'option_3', label: 'Answer Option 3' },
    { value: 'option_4', label: 'Answer Option 4' },
  ];

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.intakeQuestions.update', props.question.id), data)
      .then((response) => {
        setProcessing(false);
        window.location.replace(route('admin.intechQuestions'));
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          setErrors([]);
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Questions'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Question</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button className="" processing={processing}>
                      Update
                    </Button>
                    <Link
                      href={route('admin.intakeQuestions')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full px-3">
                    <Label forInput="content" value="Content" required={true} />
                    <textarea
                      name="content"
                      id="content"
                      defaultValue={props.question.content}
                      rows="5"
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>
                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>
                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <Label forInput="option_1" value="Answer Option 1" required={true} />
                    <Input
                      name="option_1"
                      className="w-full mt-1"
                      value={data.option_1}
                      handleChange={onHandleChange}
                    />
                    {errors.option_1 && <div className="text-sm text-red-600">{errors.option_1}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <Label forInput="option_2" value="Answer Option 2" required={true} />

                    <Input
                      name="option_2"
                      className="w-full mt-1"
                      value={data.option_2}
                      handleChange={onHandleChange}
                    />
                    {errors.option_2 && <div className="text-sm text-red-600">{errors.option_2}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <Label forInput="option_3" value="Answer Option 3" required={true} />

                    <Input
                      name="option_3"
                      className="w-full mt-1"
                      value={data.option_3}
                      handleChange={onHandleChange}
                    />
                    {errors.option_3 && <div className="text-sm text-red-600">{errors.option_3}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <Label forInput="option_4" value="Answer Option 4" required={true} />

                    <Input
                      name="option_4"
                      className="w-full mt-1"
                      value={data.option_4}
                      handleChange={onHandleChange}
                    />
                    {errors.option_4 && <div className="text-sm text-red-600">{errors.option_4}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <Label forInput="correct_answer_option" value="Correct Answer Option" required={true} />

                    <Select
                      name="correct_answer"
                      options={correctAnswerOptions}
                      defaultValue={correctAnswerOptions.filter((answer) => answer.value == props.correctAnswer)}
                      onChange={(e) => setData('correct_answer', e.value)}
                    ></Select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
