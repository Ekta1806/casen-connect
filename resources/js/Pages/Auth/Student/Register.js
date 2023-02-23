import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, useForm } from '@inertiajs/inertia-react';
import React from 'react';
import Guest from '@/Layouts/Guest';


const Register = (props) => {
  const invite = props.invite;

  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: invite != null ? invite.email : props.email,
    password: '',
    password_confirmation: '',
    register_token: invite != null ? invite.token : '',
  });

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    post(route('student.register'));
  };

  return (


    <div className="flex items-strech flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <Guest>
          <div className="max-w-xs mb-4">
            <img alt = "logo" src="../images/casen-logo-img.png" className="logo-img" />
          </div>
          <Head title="Register" />

          {status ?
            <span className="text-red-600">{status}</span> : ''}

          <ValidationErrors errors={errors} />
          <form onSubmit={submit}>
            <div className='flex'>
              <div className='col-2'>
                <Label forInput="first_name" value="First Name" />

                <Input
                  name="first_name"
                  type="text"
                  value={data.first_name}
                  placeholder="First Name"
                  handleChange={onHandleChange}
                  className="w-48 p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" />
                {errors.first_name && <div className="pb-2 text-red-500">{errors.first_name}</div>}
              </div>
              <div className='ml-3 col-2'>
                <Label forInput="last_name" value="Last Name" />
                <Input
                  name="last_name"
                  type="text"
                  value={data.last_name}
                  placeholder="Last Name"
                  handleChange={onHandleChange}
                  className=" w-48 p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" />
                {errors.last_name && <div className="pb-2 text-red-500">{errors.last_name}</div>}
              </div>
            </div>
             
            <Label forInput="email" value="Email" />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={invite != null ? invite.email : data.email}
              handleChange={onHandleChange}
              className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" />
            {errors.email && <div className="pb-2 text-red-500">{errors.email}</div>}

            <Label forInput="password" value="Password" />
            <Input type="password" name="password" value={data.password} className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4" r autoComplete="new-password"
              handleChange={onHandleChange} />
            {errors.password && <div className="pb-2 text-red-500">{errors.password}</div>}

            <Label forInput="password_confirmation" value="Confirm Password" />
            <Input type="password" value={data.password_confirmation} name="password_confirmation" className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4"
              handleChange={onHandleChange} />

            <div className="mt-4 flex flex-col items-center justify-start">
              <Button className="mb-2 w-full justify-center" processing={processing} >Register</Button>
              <a href={route('google', 'student')} className="w-full block text-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500 focus:outline-none ease-linear transition-all">Sign in with google</a>
            </div>
          </form>
        </Guest>
      </div>

      <div className="w-full md:w-1/2 login-right-sec object-fit " >
        <div className="login-bg">
        </div>
      </div>
    </div>
  );
}
export default Register;
