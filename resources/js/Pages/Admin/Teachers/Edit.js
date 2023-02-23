import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Checkbox from '@/Components/Checkbox';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import ChangePassword from './ChangePassword';

export default function Edit(props) {
  const { data, setData } = useForm({
    first_name: props.teacher.first_name,
    last_name: props.teacher.last_name,
    email: props.teacher.email,
    contact_number: props.teacher.contact_number,
    track_id: props.teacher.track_id,
    profilePicture: null,
    is_active: props.teacher.is_active,
    receive_promotional_email: props.emailPreferences.promotional,
    receive_newsletter_email: props.emailPreferences.newsletter,
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
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
    formPayLoad.set('track_id', data.track_id);
    if (data.profilePicture != null) {
      formPayLoad.append('profile_picture', data.profilePicture);
    }

    axios
      .post(route('admin.teachers.update', props.teacher.id), formPayLoad)
      .then((response) => {
        setProcessing(false);
        window.location.replace(route('admin.teachers'));
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          setErrors([]);
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  const deleteProfileImage = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete the profile picture of the teacher? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('admin.teachers.deleteAvatar', props.teacher.id)).then((response) => {
            Swal.fire({
              title: 'Success !',
              text: response.data,
              icon: 'success',
            });

            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
        });
      }
    });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Teachers'}>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="w-full xl:w-3/5">
            <form onSubmit={submit}>
              <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
                <div className="rounded-t bg-white mb-0 px-4 py-4">
                  <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                    <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                      <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Teacher</h6>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="" processing={processing}>
                        Update
                      </Button>
                      <Link
                        href={route('admin.teachers')}
                        className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>

                {props.profilePicture !== false && (
                  <div className="flex items-center justify-center py-6">
                    <img
                      src={props.profilePicture}
                      alt={`${props.teacher.first_name} ${props.teacher.last_name}`}
                      className="block w-36 rounded"
                    />

                    <Link
                      className="text-red-600 block ml-8"
                      href="#"
                      onClick={deleteProfileImage}
                      as="button"
                      method="delete"
                    >
                      {' '}
                      Delete Image
                    </Link>
                  </div>
                )}

                <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                  <div className="flex flex-wrap mt-4">
                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
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

                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
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

                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
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
                    </div>

                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
                        <Label forInput="track_id" value="Select Track" required={true} />

                        <Select
                          options={props.tracks}
                          name="track_id"
                          className="mt-1"
                          onChange={(e) => setData('track_id', e.value)}
                          defaultValue={props.tracks.filter((track) => track.value === props.teacher.track_id)}
                        />

                        <div className="text-sm text-red-600">{errors.track_id}</div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
                        <Label forInput="contact_number" value="Contact Number" />

                        <Input
                          type="text"
                          name="contact_number"
                          id="contact_number"
                          value={data.contact_number}
                          className="mt-1 block w-full"
                          handleChange={onHandleChange}
                        />

                        <div className="text-sm text-red-600">{errors.contact_number}</div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-3">
                      <div className="relative w-full mb-3">
                        <Label forInput="profile_picture" value="Profile Picture" />

                        <input
                          type="file"
                          name="profile_picture"
                          id="profile_picture"
                          className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0"
                          onChange={(e) => {
                            addProfilePicture(e.target.files[0]);
                          }}
                          accept="image/jpeg, image/jpg, image/png"
                        />

                        <div className="text-sm text-red-600">{errors.profile_picture}</div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-3 mt-2">
                      <div className="relative w-full mb-3">
                        <label htmlFor="is_active" className="flex items-center">
                          <Checkbox
                            name="is_active"
                            value={data.is_active}
                            handleChange={onHandleChange}
                            defaultChecked={data.is_active}
                          />

                          <span className="ml-2 text-sm text-gray-600">Is Active</span>
                        </label>

                        <div className="text-sm text-red-600">{errors.is_active}</div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-3 mt-2">
                      <div className="relative w-full mb-3">
                        <label htmlFor="receive_newsletter_email" className="flex items-center">
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

                    <div className="w-full lg:w-6/12 px-3 mt-2">
                      <div className="relative w-full mb-3">
                        <label htmlFor="receive_promotional_email" className="flex items-center">
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
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="w-full xl:w-2/5 pl-0 xl:pl-8">
            <ChangePassword teacher={props.teacher} />
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
