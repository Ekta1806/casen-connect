import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function Create(props) {
  const { data, setData, reset } = useForm({
    name: '',
    short_description: '',
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
      .post(route('admin.levels.store'), data)
      .then((response) => {
        setProcessing(false);
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          window.history.back();

          setErrors([]);
          reset();
          document.getElementById('formAddLevel').reset();
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Levels'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit} id="formAddLevel">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Level</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button processing={processing}>Add</Button>
                    <Link
                      href={route('admin.levels')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto my-4 px-4 md:px-6 pb-4">
                <div className="w-full">
                  <Label forInput="name" value="Name" required={true} />

                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    className="mt-1 block w-full border-gray-300 rounded-md focus:outline-none focus:shadow-none focus:ring-0"
                    handleChange={onHandleChange}
                  />

                  {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                </div>

                <div className="w-full mt-4">
                  <Label forInput="short_description" value="Short Description" />

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
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
