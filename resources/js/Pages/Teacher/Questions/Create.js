import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';

export default function Create(props) {
  const { data, setData, reset } = useForm({
    content: '',
    track_id: '',
    type: '',
    level_id: '',
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'descriptive', label: 'Descriptive' },
  ];

  const correctAnswerOptions = [
    { value: 'Option 1', label: 'Answer Option 1' },
    { value: 'Option 2', label: 'Answer Option 2' },
    { value: 'Option 3', label: 'Answer Option 3' },
    { value: 'Option 4', label: 'Answer Option 4' },
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
      .post(route('teacher.questions.store'), data)
      .then((response) => {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
          setProcessing(false);
          reset();
          document.getElementById('formAddQuestion').reset();
          window.history.back();
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
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit} id="formAddQuestion">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Question</h6>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all   "
                      processing={processing}
                    >
                      Add
                    </Button>
                    <Link
                      href={route('teacher.questions')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-4 lg:px-6 py-10 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full lg:w-4/12 px-4 mt-4">
                    <Label forInput="track_id" value="Select Track" required={true} />

                    <Select
                      name="track_id"
                      options={props.tracks}
                      onChange={(e) => setData('track_id', e.value)}
                    ></Select>

                    {errors.track_id && <div className="text-sm text-red-600">{errors.track_id}</div>}
                  </div>

                  <div className="w-full lg:w-4/12 px-4 mt-4">
                    <Label forInput="type" value="Type" required={true} />

                    <Select name="type" options={questionTypes} onChange={(e) => setData('type', e.value)}></Select>

                    {errors.type && <div className="text-sm text-red-600">{errors.type}</div>}
                  </div>

                  <div className="w-full lg:w-4/12 px-3 mt-4">
                    <Label forInput="type" value="Select Level" required={true} />

                    <Select
                      name="level_id"
                      options={props.levels}
                      onChange={(e) => setData('level_id', e.value)}
                    ></Select>

                    {errors.level_id && <div className="text-sm text-red-600">{errors.level_id}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="content" value="Content" required={true} />

                    <textarea
                      name="content"
                      id="content"
                      defaultValue={data.content}
                      rows="5"
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>

                  {data.type === 'descriptive' && (
                    <>
                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="minimum_length" value="Minimum Length of the Answer (Words)" required={true} />

                        <Input handleChange={onHandleChange} name="minimum_length" className="w-full mt-1" />
                        {errors.minimum_length && <div className="text-sm text-red-600">{errors.minimum_length}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="maximum_length" value="Maximum Length of the Answer (Words)" required={true} />

                        <Input handleChange={onHandleChange} name="maximum_length" className="w-full mt-1" />
                        {errors.maximum_length && <div className="text-sm text-red-600">{errors.maximum_length}</div>}
                      </div>
                    </>
                  )}

                  {data.type === 'multiple-choice' && (
                    <>
                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_1" value="Answer Option 1" required={true} />

                        <Input handleChange={onHandleChange} name="answer_1" className="w-full mt-1" />
                        {errors.answer_1 && <div className="text-sm text-red-600">{errors.answer_1}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_2" value="Answer Option 2" required={true} />

                        <Input handleChange={onHandleChange} name="answer_2" className="w-full mt-1" />
                        {errors.answer_2 && <div className="text-sm text-red-600">{errors.answer_2}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_3" value="Answer Option 3" required={true} />

                        <Input handleChange={onHandleChange} name="answer_3" className="w-full mt-1" />
                        {errors.answer_3 && <div className="text-sm text-red-600">{errors.answer_3}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_4" value="Answer Option 4" required={true} />

                        <Input handleChange={onHandleChange} name="answer_4" className="w-full mt-1" />
                        {errors.answer_4 && <div className="text-sm text-red-600">{errors.answer_4}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="correct_answer_option" value="Correct Answer Option" required={true} />

                        <Select
                          name="correct_answer_option"
                          options={correctAnswerOptions}
                          onChange={(e) => setData('correct_answer_option', e.value)}
                        ></Select>
                        {errors.correct_answer_option && (
                          <div className="text-sm text-red-600">{errors.correct_answer_option}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
