import React, { useState } from 'react';
import Index from '../Dashboard/Index';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import CardProfile from '@/Components/Timelines/CardProfile';
import { usePage, Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import ApiService from '@/services/ApiService';
import Checkbox from '@/Components/Checkbox';

export default function Settings(props) {
  React.useEffect(() => {
    document.title = props._pageTitle;
  }, []);

  const { auth } = usePage().props;

  const { data, setData, processing } = useForm({
    email: props.auth.user.email,
    first_name: props.auth.user.first_name,
    last_name: props.auth.user.last_name,
    new_password: '',
    current_password: '',
    repeat_new_password: '',
    profile_image: null,
    is_private: props.is_private,
    receive_newsletter_email: props.emailPreferences.newsletter,
    receive_promotional_email: props.emailPreferences.promotional,
  });

  const [errors, setErrors] = useState([]);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const submit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('first_name', data.first_name);
    formData.set('last_name', data.last_name);
    formData.set('current_password', data.current_password);
    formData.set('new_password', data.new_password);
    formData.set('repeat_new_password', data.repeat_new_password);
    formData.set('receive_newsletter_email', data.receive_newsletter_email);
    formData.set('receive_promotional_email', data.receive_promotional_email);
    formData.set('is_private', data.is_private == true ? 1 : 0);

    if (selectedFile != null) {
      formData.set('profile_image', selectedFile);
    }

    ApiService.post(route('student.setupdate'), formData)
      .then((response) => {
          Swal.fire({
            title: 'Success !',
            text: 'Account settings updated successfully.',
            icon: 'success',
          });
          setErrors([]);
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);

        if (response.data.status === 'failed') {
          Swal.fire({
            title: 'Error !',
            text: 'Incorrect current password.',
            icon: 'error',
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };
  return (
    <Index auth={props.auth} errors={props.errors} header={'Account Settings'}>
      <div className="flex flex-wrap mt-0 lg:mt-4">
        <div className="order-last lg:order-first w-full lg:w-8/12 px-0 md:px-2">
          <form onSubmit={submit} id="formSettings">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="flex items-center text-black-600 text-lg font-semibold capitalize">My Account</h6>
                  </div>
                  <Link
                    href={route('student.home')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>

              <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                <div className="flex flex-wrap mt-4">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="first_name" value="First Name" />

                      <Input
                        type="text"
                        name="first_name"
                        value={data.first_name}
                        className="border p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />
                      <div className="text-sm text-red-600">{errors.first_name}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="last_name" value="Last Name" />

                      <Input
                        type="text"
                        name="last_name"
                        value={data.last_name}
                        className="p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />
                      <div className="text-sm text-red-600">{errors.last_name}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4 lg:mt-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="email" value="Email" />

                      <Input
                        type="text"
                        name="email"
                        value={data.email}
                        className="p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />
                      <div className="text-sm text-red-600">{errors.email}</div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 lg:mt-4">
                    <div className="relative w-full mb-4">
                      <Label forInput="image" value="Profile edit" />

                      <input
                        type="file"
                        name="profile_image"
                        className="p-2 mt-1 block w-full bg-white"
                        onChange={changeHandler}
                        accept="image/jpeg, image/jpg, image/png"
                      />
                      <div className="text-sm text-red-600">{errors.profile_image}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-2 md:mt-4">
                    <div className="relative w-full mb-3">
                      <label className="flex items-center">
                        {data.receive_newsletter_email}
                        <Checkbox
                          name="receive_newsletter_email"
                          value={data.receive_newsletter_email}
                          handleChange={onHandleChange}
                          defaultChecked={data.receive_newsletter_email}
                        />
                        <span className="ml-2 text-sm text-gray-600">Receive Newsletter E-mail</span>
                      </label>

                      <div className="text-sm text-red-600">{errors.receive_newsletter_email}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-2 md:mt-4">
                    <div className="relative w-full mb-3">
                      <label className="flex items-center">
                        {data.receive_promotional_email}

                        <Checkbox
                          name="receive_promotional_email"
                          value={data.receive_promotional_email}
                          handleChange={onHandleChange}
                          defaultChecked={data.receive_promotional_email}
                        />

                        <span className="ml-2 text-sm text-gray-600">Receive Promotional E-mail</span>
                      </label>

                      <div className="text-sm text-red-600">{errors.receive_promotional_email}</div>
                    </div>
                  </div>
                  {auth.user.level_id == 5 && (
                    <div className="w-full lg:w-6/12 px-4 mt-2 md:mt-4">
                      <div className="relative w-full mb-3">
                        <label className="flex items-center">
                          {data.receive_promotional_email}

                          <Checkbox
                            name="is_private"
                            value={data.is_private}
                            handleChange={onHandleChange}
                            defaultChecked={data.is_private}
                          />

                          <span className="ml-2 text-sm text-gray-600">Make Profile private</span>
                        </label>

                        <div className="text-sm text-red-600">{errors.is_private}</div>
                      </div>
                    </div>
                  )}
                  <div className="w-full lg:w-6/12 px-4 lg:mt-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="current_password" value="Current Password" />

                      <Input
                        type="password"
                        name="current_password"
                        value={data.current_password}
                        className="p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />

                      <div className="text-sm text-red-600">{errors.current_password}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4 lg:mt-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="new_password" value="New Password" />

                      <Input
                        type="password"
                        name="new_password"
                        value={data.new_password}
                        className="p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />

                      <div className="text-sm text-red-600">{errors.new_password}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4 lg:mt-4">
                    <div className="relative w-full mb-3">
                      <Label forInput="repeat_new_password" value="Repeat New Password" />

                      <Input
                        type="password"
                        name="repeat_new_password"
                        value={data.repeat_new_password}
                        className="border-gray-300 p-2 mt-1 block w-full"
                        handleChange={onHandleChange}
                      />

                      <div className="text-sm text-red-600">{errors.repeat_new_password}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end m-2">
                  <>
                    <Button className="" processing={processing}>
                      Update
                    </Button>
                  </>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="order-first lg:order-last w-full lg:w-4/12 px-0 md:px-2 mb-0 md:mb-3">
          <CardProfile className="order-first" profilePicture={props.profilePicture} />
        </div>
      </div>
    </Index>
  );
}
