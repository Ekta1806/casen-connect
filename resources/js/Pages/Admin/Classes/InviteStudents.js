import { useState } from 'react';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { Link, useForm } from '@inertiajs/inertia-react';

export default function InviteStudents(props) {
  const { data, setData, reset } = useForm({
    email: '',
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);

  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const sendInvite = (e) => {
    e.preventDefault();
    setProcessing(true);

    if (data.email.length <= 0) {
      Swal.fire({
        title: 'Error !',
        text: 'Please enter E-Mail address.',
        icon: 'error',
      });
      window.history.back();

      setProcessing(false);
      return false;
    }

    let emailList = data.email.split(',');
    emailList = emailList.map((email) => email.trim());

    let emailIsValid = true;
    for (let i = 0; i < emailList.length; i++) {
      if (!new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(emailList[i])) {
        emailIsValid = false;

        Swal.fire({
          title: 'Error !',
          text: 'Invalid E-Mail address added',
          icon: 'error',
        });

        setProcessing(false);

        break;
      }
    }

    if (emailIsValid == true) {
      axios
        .post(route('admin.classes.sendInvites', props.division.id), { email: emailList })
        .then((response) => {
            Swal.fire({
              title: 'Success !',
              text: response.data,
              icon: 'success',
            });

            setErrors([]);
            reset();
            setProcessing(false);
        })
        .catch((err) => {
          setProcessing(false);

          if (err.response.status === 422) {
            setErrors(err.response.data.errors);
          }
        });
    }
  };

  return (
    <form onSubmit={sendInvite} className="mt-6">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-4">
          <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
            <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
              <h6 className="text-black-600 text-lg font-semibold capitalize">Invite Students</h6>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="" processing={processing}>
                Send Invite
              </Button>
              <Link
                href={route('admin.classes')}
                className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
          <div className="flex flex-wrap mt-6">
            <div className="w-full px-3">
              <div className="relative w-full mb-3">
                <Label forInput="email" value="E-Mail of Students (Comma Separated)" />

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
          </div>
        </div>
      </div>
    </form>
  );
}
