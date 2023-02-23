import { useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import ChangePassword from './ChangePassword';
import AvatarCard from './AvatarCard';

export default function Settings(props) {
  const { data, setData } = useForm({
    email: props.auth.user.email,
    first_name: props.auth.user.first_name,
    last_name: props.auth.user.last_name,
    profilePicture: null,
    contact_number: props.auth.user.contact_number,
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const addProfilePicture = (pic) => {
    setData('profilePicture', pic);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    const formPayLoad = new FormData(e.target);
    formPayLoad.set('_method', 'PATCH');
    formPayLoad.set('first_name', data.first_name);
    formPayLoad.set('last_name', data.last_name);
    formPayLoad.set('email', data.email);
    if (data.profilePicture != null) {
      formPayLoad.append('profile_picture', data.profilePicture);
    }

    axios
      .post(route('admin.settings.update'), formPayLoad)
      .then((response) => {
        setProcessing(false);
        if (response.status == 200) {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
          document.getElementById('formSettings').reset();

          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
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
    <Authenticated auth={props.auth} errors={props.errors} header={'Account Settings'}>
      <div className="flex flex-wrap">
        <div className="order-last lg:order-first w-full lg:w-8/12 px-2">
          <form onSubmit={submit} id="formSettings">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">My Account</h6>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button className="" processing={processing}>
                      Update
                    </Button>
                    <Link
                      href={route('admin.dashboard')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                <div className="flex flex-wrap mt-6">
                  <div className="w-full lg:w-6/12 px-3">
                    <div className="relative w-full">
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
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4 lg:mt-0">
                    <div className="relative w-full">
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
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <div className="relative w-full">
                      <Label forInput="email" value="Email" required={true} />

                      <Input
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        handleChange={onHandleChange}
                      />

                      <div className="text-sm text-red-600">{errors.email}</div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <div className="relative w-full">
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
                  </div>

                  <div className="w-full lg:w-6/12 px-3 mt-4">
                    <div className="relative w-full">
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
              </div>
            </div>
          </form>

          <ChangePassword />
        </div>

        <div className="order-first lg:order-last w-full lg:w-4/12 px-2 mb-2">
          <AvatarCard deleteAvatarRoute={route('admin.settings.deleteAvatar')} profilePicture={props.profilePicture} />
        </div>
      </div>
    </Authenticated>
  );
}
