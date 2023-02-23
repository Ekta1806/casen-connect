import { useState } from 'react';
import Select from 'react-select';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, useForm } from '@inertiajs/inertia-react';

const Register = (props) => {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    track_id: '',
  });

  const options = [];
  options.push({ value: '', label: 'Select Track' });
  props.tracks.map((track) => {
    options.push({ value: track.id, label: track.name });
  });
  const [selected] = useState([{ value: 0 }]);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const onSelectChange = (optionSelected) => {
    data.track_id = optionSelected.value;
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('teacher.register.store'));
  };

  return (
    <div className="flex items-strech flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <Guest>
          <div className="max-w-xs mb-4">
            <img alt="logo" src="../images/casen-logo-img.png" className="logo-img" />
          </div>
          <Head title="Teacher Registration" />

          {status ? <span className="text-red-600">{status}</span> : ''}

          <ValidationErrors errors={errors} />
          <form onSubmit={submit}>
            <div className="flex">
              <div className="col-2">
                <Label forInput="first_name" value="First Name" />
                <Input
                  name="first_name"
                  type="text"
                  value={data.first_name}
                  placeholder="First Name"
                  handleChange={onHandleChange}
                  className="w-48 p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
                />
              </div>
              <div className="ml-3 col-2">
                <Label forInput="last_name" value="Last Name" />
                <Input
                  name="last_name"
                  type="text"
                  value={data.last_name}
                  placeholder="Last Name"
                  handleChange={onHandleChange}
                  className=" w-48 p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
                />
              </div>
            </div>
            <div>
              <Label forInput="Track" value="Select Track" />
              <Select options={options} name="track_id" value={selected.value} onChange={onSelectChange} />
            </div>
            <div className="mt-2">
              <Label forInput="email" value="Email" />
              <Input
                type="text"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                handleChange={onHandleChange}
              />
            </div>
            <div className="mt-2">
              <Label forInput="password" value="Password" />
              <Input
                type="password"
                name="password"
                value={data.password}
                className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
                autoComplete="new-password"
                handleChange={onHandleChange}
              />
            </div>
            <div className="">
              <Label forInput="confirm_password" value="Confirm Password" />
              <Input
                type="password"
                name="confirm_password"
                value={data.confirm_password}
                className="mt-1 block w-full"
                autoComplete="confirm_password"
                handleChange={onHandleChange}
              />
            </div>
            <div className="mt-4 flex flex-col items-center justify-start">
              <Button className="mb-2 w-full justify-center" processing={processing}>
                Register
              </Button>
              <a
                href={route('google', 'teacher')}
                className="w-full block text-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500 focus:outline-none ease-linear transition-all"
              >
                Sign in with google
              </a>
            </div>
          </form>
        </Guest>
      </div>
      <div className="w-full md:w-1/2 teacher-login-right-sec object-fit">
        <div className="login-bg"></div>
      </div>
    </div>
  );
};

export default Register;
