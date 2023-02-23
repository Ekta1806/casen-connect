import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';

export default function Index(props) {
  const { data, setData } = useForm({
    view_posts_on: props.settings.view_posts_on,
    daily_question_timing: props.settings.daily_question_timing,
  });

  const selectDays = [
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ];

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.siteSettings.update'), data)
      .then((response) => {
        setProcessing(false);
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Site Settings'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit} id="formAddSiteSetting">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Site Settings</h6>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 my-4 px-4 md:px-6 pb-4 gap-4">
                <div className="w-full">
                  <Label forInput="daily_question_timing" value="Daily Question Timing" required={true} />

                  <Input
                    type="time"
                    name="daily_question_timing"
                    value={data.daily_question_timing}
                    className="mt-1 block w-full"
                    handleChange={onHandleChange}
                  />

                  <div className="text-sm text-red-600">{errors.daily_question_timing}</div>
                </div>

                <div className="w-full">
                  <Label forInput="view_posts_on" value="View Other Student's Posts On" required={true} />

                  <Select
                    options={selectDays}
                    className="mt-1"
                    defaultValue={selectDays.filter((day) => day.value === props.settings.view_posts_on)}
                    onChange={(e) => setData('view_posts_on', e.value)}
                  />

                  <div className="text-sm text-red-600">{errors.view_posts_on}</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
