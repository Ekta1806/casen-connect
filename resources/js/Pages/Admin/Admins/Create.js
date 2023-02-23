import Authenticated from '@/Layouts/Authenticated';
import React, { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function Create(props) {
  const { data, setData, reset } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    profilePicture: null,
    contact_number: '',
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const addProfilePicture = (pic) => {
    setData('profilePicture', pic);
  };

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    const formPayLoad = new FormData(e.target);
    formPayLoad.set('first_name', data.first_name);
    formPayLoad.set('last_name', data.last_name);
    formPayLoad.set('email', data.email);
    formPayLoad.set('password', data.password);
    formPayLoad.set('confirm_password', data.confirm_password);
    formPayLoad.set('contact_number', data.contact_number);
    if (data.profilePicture != null) {
      formPayLoad.append('profile_picture', data.profilePicture);
    }

    axios
      .post(route('admin.admins.store'), formPayLoad)
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
          document.getElementById('formAddAdmin').reset();
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Admins'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit} id="formAddAdmin">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Admin</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button className="" processing={processing}>
                      Add
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

              <div className="grid grid-cols-1 sm:grid-cols-2 my-4 px-4 md:px-6 pb-4 gap-4">
                <div className="w-full">
                  <Label forInput="first_name" value="First Name" required={true} />

                  <Input
                    type="text"
                    name="first_name"
                    value={data.first_name}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.first_name}</div>
                </div>

                <div className="w-full">
                  <Label forInput="last_name" value="Last Name" required={true} />

                  <Input
                    type="text"
                    name="last_name"
                    value={data.last_name}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.last_name}</div>
                </div>

                <div className="w-full">
                  <Label forInput="email" value="E-Mail" required={true} />

                  <Input
                    type="text"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.email}</div>
                </div>

                <div className="w-full">
                  <Label forInput="contact_number" value="Contact Number" />

                  <Input
                    type="text"
                    name="contact_number"
                    value={data.contact_number}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.contact_number}</div>
                </div>

                <div className="w-full">
                  <Label forInput="password" value="Password" required={true} />

                  <Input
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.password}</div>
                </div>

                <div className="w-full">
                  <Label forInput="confirm_password" value="Confirm Password" required={true} />

                  <Input
                    type="password"
                    name="confirm_password"
                    value={data.confirm_password}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.confirm_password}</div>
                </div>

                <div className="w-full">
                  <Label forInput="profile_picture" value="Profile Picture" />

                  <input
                    type="file"
                    name="profile_picture"
                    id="profile_picture"
                    className="mt-1 block w-full py-2 px-2 bg-white border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    onChange={(e) => {
                      addProfilePicture(e.target.files[0]);
                    }}
                    accept="image/jpeg, image/jpg, image/png"
                  />

                  <div className="text-sm text-red-600">{errors.profile_picture}</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
