import { useState } from 'react';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Link, useForm } from '@inertiajs/inertia-react';

export default function ChangePassword() {
  const { data, setData, reset } = useForm({
    new_password: '',
    current_password: '',
    repeat_new_password: '',
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const changePassword = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.settings.changePassword'), data)
      .then((response) => {
        setProcessing(false);
        if (response.status == 200) {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
          reset();
        }

        if (response.status == 422) {
          Swal.fire({
            title: 'Error !',
            text: response.data,
            icon: 'error',
          });

          setErrors([]);
        }
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <form onSubmit={changePassword} className="mt-4 md:mt-8">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-4">
          <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
            <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
              <h6 className="text-black-600 text-lg font-semibold capitalize">Change Password</h6>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="" processing={processing}>
                Update
              </Button>
              <Link
                href={route('admin.dashboard')}
                className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
          <div className="flex flex-wrap mt-6">
            <div className="w-full px-3">
              <Label forInput="current_password" value="Current Password" required={true} />

              <Input
                type="password"
                name="current_password"
                value={data.current_password}
                className="mt-1 block w-full"
                handleChange={onHandleChange}
              />

              <div className="text-sm text-red-600">{errors.current_password}</div>
            </div>

            <div className="w-full lg:w-6/12 px-3 mt-4">
              <Label forInput="new_password" value="New Password" required={true} />

              <Input
                type="password"
                name="new_password"
                value={data.new_password}
                className="mt-1 block w-full"
                handleChange={onHandleChange}
              />

              <div className="text-sm text-red-600">{errors.new_password}</div>
            </div>

            <div className="w-full lg:w-6/12 px-3 mt-4">
              <Label forInput="repeat_new_password" value="Repeat New Password" required={true} />

              <Input
                type="password"
                name="repeat_new_password"
                value={data.repeat_new_password}
                className="mt-1 block w-full"
                handleChange={onHandleChange}
              />

              <div className="text-sm text-red-600">{errors.repeat_new_password}</div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
