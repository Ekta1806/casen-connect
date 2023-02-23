import React from 'react';
import 'sweetalert2/src/sweetalert2.scss';
import Input from '@/Components/Input';
import { useForm } from '@inertiajs/inertia-react';

export default function List(props) {
  const { data, setData } = useForm({});
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    axios
      .post(route('intakeFormSubmit'), data)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <div className="relative flex flex-col min-w-0 break-words  mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-lg font-semibold text-black-500 capitalize">Past questions</h6>
            </div>
          </div>
          <div className="m-0 relative min-h-screen bg-gray-500">
            <form onSubmit={submit} id="intakeFormSubmit">
              <div className="item-center m-12 p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl">
                <div className="">
                  <div className="item-center rounded-lg flex mb-2 items-start w-full">
                    <p className="text-left text-lg font-bold text-black-600 mb-1">Name:</p>
                    <Input
                      handleChange={onHandleChange}
                      type="text"
                      id="name"
                      name="name"
                      class="item-center p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl"
                      placeholder="John"
                    />
                    {errors.name && <div className="text-red-500 text-sm w-96">{errors.name}</div>}
                  </div>
                  <div></div>
                  <div className="item-center rounded-lg flex mb-2 items-start w-full">
                    <p className="text-left text-lg font-bold text-black-600 mb-1">Email:</p>
                    <Input
                      handleChange={onHandleChange}
                      type="email"
                      id="email"
                      name="email"
                      class="item-center p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl"
                      placeholder="John@example.com"
                    />
                    {errors.email && <div className="text-red-500 text-sm w-96">{errors.email}</div>}
                  </div>
                </div>
              </div>

              {props.rows.map((answer, index) => (
                <div key={index} className="item-center m-12 p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl">
                  <p className="w-full text-left text-lg font-bold text-black-600 mb-1">Q. {answer.content}</p>
                  <div className="mt-6 mb-6 flex flex-wrap">
                    <div className={' rounded-lg mb-2 flex items-start w-1/2'}>
                      <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                      <span className="text-md text-dark-2">
                        <Input
                          type="radio"
                          id={answer.option_1}
                          name={`question_${answer.id}`}
                          value={answer.option_1}
                          className="mr-2"
                          handleChange={onHandleChange}
                        />
                        {answer.option_1}
                      </span>
                      {errors.email && <div className="text-red-500 text-sm w-96">{errors.email}</div>}
                    </div>
                    <div className={' rounded-lg mb-2 flex items-start w-1/2 '}>
                      <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                      <span className="text-md text-dark-2">
                        <Input
                          type="radio"
                          id={answer.option_2}
                          name={`question_${answer.id}`}
                          value={answer.option_2}
                          className="mr-2"
                          handleChange={onHandleChange}
                        />
                        {answer.option_2}
                      </span>
                      {errors.email && <div className="text-red-500 text-sm w-96">{errors.email}</div>}
                    </div>
                    <div className={'rounded-lg mb-2 flex items-start w-1/2 '}>
                      <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                      <span className="text-md text-dark-2">
                        <Input
                          type="radio"
                          id={answer.option_3}
                          name={`question_${answer.id}`}
                          value={answer.option_3}
                          className="mr-2"
                          handleChange={onHandleChange}
                        />
                        {answer.option_3}
                      </span>
                      {errors.email && <div className="text-red-500 text-sm w-96">{errors.email}</div>}
                    </div>
                    <div className={'rounded-lg mb-2 flex items-start w-1/2 '}>
                      <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                      <span className="text-md text-dark-2">
                        <Input
                          type="radio"
                          id={answer.option_4}
                          name={`question_${answer.id}`}
                          value={answer.option_4}
                          className="mr-2"
                          handleChange={onHandleChange}
                        />
                        {answer.option_4}
                      </span>
                      {errors.email && <div className="text-red-500 text-sm w-96">{errors.email}</div>}
                    </div>
                  </div>
                </div>
              ))}
              <Input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
