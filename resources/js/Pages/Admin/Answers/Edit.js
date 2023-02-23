import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function Edit(props) {
  const { data, setData } = useForm({
    content: props.answer.content,
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.answers.update', props.answer.id), data)
      .then((response) => {
        window.location.replace(route('admin.answers'));
        
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setErrors([]);
          setProcessing(false)
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Notes'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <form onSubmit={submit}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-800 text-xl font-bold">Edit Notes</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button className="" processing={processing}>
                      Update
                    </Button>
                    <Link
                      href={route('admin.answers')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full px-3 mt-4">
                    <Label forInput="content" value="Content" required={true} />

                    <textarea
                      name="content"
                      id="content"
                      defaultValue={props.answer.content}
                      rows="5"
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
