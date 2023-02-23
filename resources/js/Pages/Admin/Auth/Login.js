import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Login({ status }) {
  const { data, setData, post, errors, reset } = useForm({
    email: '',
    password: '',
    remember: '',
  });

  useEffect(
    () => () => {
      reset('password');
    },
    [],
  );

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.login.store'));
  };

  return (
    <div className="flex items-center flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <Guest>
          <div className="max-w-xs mb-4">
            <img alt="logo" src="../images/casen-logo-img.png" className="logo-img" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <Link href={route('landingPage')} className="text-lg text-blue-600 hover:text-yellow-500 mb-3">
              Want to Login to Another Account?
            </Link>
          </div>
          <Head title="Log in" />
          <div className="text-xl mb-0 text-left text-black-800">
            <p className="text-2xl mb-10 text-left text-black-800">Admin Login</p>
          </div>

          {status && type && type == 'error' ? <span className="text-red-600">{status}</span> : ''}

          {status && type && type == 'success' ? <span className="text-green-600">{status}</span> : ''}

          <ValidationErrors errors={errors} />
          <form onSubmit={submit}>
            <div>
              <Label forInput="email" value="Email" />

              <Input
                type="text"
                name="email"
                value={data.email}
                className="mt-1 block w-full px-3"
                autoComplete="username"
                isFocused={true}
                handleChange={onHandleChange}
              />
            </div>

            <div className="mt-4">
              <Label forInput="password" value="Password" />

              <Input
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full px-3"
                autoComplete="current-password"
                handleChange={onHandleChange}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <Link
                href={route('password.request', ['admin'])}
                className="text-base text-blue-600 hover:text-yellow-500"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="mt-4 flex flex-col items-center justify-start">
              <Button className="mb-2 w-full justify-center">Log in</Button>
            </div>
          </form>
        </Guest>
      </div>

      <div className="w-full md:w-1/2 admin-login-right-sec">
        <div className="login-bg"></div>
      </div>
    </div>
  );
}
