import Authenticated from '@/Layouts/Authenticated';
import React, { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function Edit(props) {
  const { data, setData } = useForm({
    name: props.track.name,
    short_description: props.track.short_description,
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.tracks.update', props.track.id), data)
      .then((response) => {
        window.location.replace(route('admin.tracks'));
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
          setProcessing(false);
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Tracks'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Track</h6>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button className="" processing={processing}>
                      Update
                    </Button>
                    <button
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                      onClick={back}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full px-3 mt-4">
                    <Label forInput="name" value="Name" required={true} />
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      className="mt-1 block w-full"
                      handleChange={onHandleChange}
                    />

                    {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                  </div>
                  <div className="w-full px-3">
                    <Label forInput="short_description" value="Short Description" required={true} />

                    <textarea
                      name="short_description"
                      id="short_description"
                      defaultValue={data.short_description}
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.short_description && <div className="text-sm text-red-600">{errors.short_description}</div>}
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
