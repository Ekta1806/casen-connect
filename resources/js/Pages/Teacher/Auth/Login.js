import { Head, useForm, Link } from '@inertiajs/inertia-react';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';

const Login = ({ status, type }) => {
  const { data, setData, post, errors } = useForm({
    email: '',
    password: '',
  });

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('teacher.login.check'));
  };

  return (
    <div className="flex items-center flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <Guest>
          <div className="max-w-xs mb-8">
            <img alt="logo" src="../images/casen-logo-img.png" className="logo-img" />
          </div>
          <div className="flex items-center justify-between mt-3">
            <Link href={route('landingPage')} className="text-lg text-blue-600 hover:text-yellow-500 mb-3">
              Want to Login to Another Account?
            </Link>
          </div>
          <Head title="Log in" />
          <div className="text-xl mb-0 text-left text-black-800">
            Teacher Login
            <br />
            <p className="text-2xl mb-10 text-left text-black-800">Login to your account</p>
          </div>

          {status && type && type == 'error' ? <span className="text-red-600">{status}</span> : ''}

          {status && status[0] == 'error' ? <span className="text-red-600">{status[1]}</span> : ''}

          {status && type && type == 'success' ? <span className="text-green-600">{status}</span> : ''}

          <ValidationErrors errors={errors} />
          <form onSubmit={submit}>
            <div>
              <Label forInput="email" value="Email" />

              <Input
                type="text"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
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
                className="mt-1 block w-full"
                autoComplete="current-password"
                handleChange={onHandleChange}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <Link
                href={route('password.request', ['teacher'])}
                className="text-base text-blue-600 hover:text-yellow-500"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="mt-4 flex flex-col items-center justify-start">
              <Button className="mb-2 w-full justify-center">Log in</Button>
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
      <div className="w-full md:w-1/2 teacher-login-right-sec">
        <div className="login-bg"></div>
      </div>
    </div>
  );
};
export default Login;
