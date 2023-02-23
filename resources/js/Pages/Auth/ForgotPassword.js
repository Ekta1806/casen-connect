import React from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import Input from '@/Components/Input';
import { Head, useForm } from '@inertiajs/inertia-react';
import ValidationErrors from '@/Components/ValidationErrors';


export default function ForgotPassword({ status, user_type }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        user_type: user_type,
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };


    const back = (e) => {
        e.preventDefault();
        window.history.back();
    }


    return (
    
        <div className="flex items-center flex-col md:flex-row">
            <div className="w-full md:w-1/2">
                <Guest>
                    <div className="max-w-xs mb-8">
                        <img alt='logo' src="../images/casen-logo-img.png" className="logo-img" />
                    </div>
                    <Head title="Forgot Password" />
                    <div className="mb-4 text-md  text-left text-black-800">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password
                        reset link that will allow you to choose a new one.
                    </div>

                    {status ?
                        <span className="text-red-600">{status}</span> : ''}

                    <ValidationErrors errors={errors} />
                    <form onSubmit={submit}>
                        <Input
                            type="text"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            handleChange={onHandleChange}
                        />

                        <Input type="hidden" value={user_type} name="user_type" />

                        <div className="mt-4 flex flex-col items-center justify-start">
                            <Button className="mb-2 w-full justify-center" processing={processing}>
                                Email Password Reset Link
                            </Button>
                            <button href="#" className="justify-center w-full px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all" onClick={back}>Back</button>
                        </div>
                    </form>
                </Guest>
            </div>
             {user_type == 'teacher' && <div className="w-full md:w-1/2 teacher-login-right-sec" >
                <div className="login-bg">
                </div>
            </div>}
            {user_type == 'student' && <div className="w-full md:w-1/2 login-right-sec">
                <div className="login-bg">
                </div>
            </div>}
            {user_type == 'admin' && <div className="w-full md:w-1/2 admin-login-right-sec">
                <div className="login-bg">
                </div>
            </div>}
            
        </div>
    );
}
