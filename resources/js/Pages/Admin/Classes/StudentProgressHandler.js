import { useState } from 'react';
import Button from '@/Components/Button';
import { useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function StudentProgressHandler(props) {
  const { students } = props;
  const { division } = props;

  const { data, setData } = useForm({});

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const submitStudentProgressHandler = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.classes.updateStudentProgressHandler', division.id), data)
      .then((response) => {
        setProcessing(false);
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          window.history.back();

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
    <div className="w-full mt-4 md:mt-0">
      <form onSubmit={submitStudentProgressHandler}>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
          <div className="rounded-t bg-white mb-0 px-4 py-4">
            <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
              <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                <h6 className="text-black-600 text-lg font-semibold capitalize">Student Progress Handler</h6>
              </div>
              <div className="flex items-center space-x-2">
                {students.length > 0 && (
                  <Button className="" processing={processing}>
                    Update
                  </Button>
                )}
                <button
                  className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  onClick={back}
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          <div className="flex-auto px-2 lg:px-3 py-6 pt-0">
            <div className="flex flex-wrap">
              {students.length > 0 &&
                students.map((student) => (
                  <div className="w-full lg:w-6/12 px-3 pt-6" key={student.id}>
                    <div className="text-gray-700 font-semibold mb-2">
                      {`${student.first_name} ${student.last_name}`}
                    </div>

                    <div className="w-full">
                      <input
                        type="radio"
                        name={`progress_handler_${student.id}`}
                        id={`progress_handler_${student.id}_automatically`}
                        value="automatically"
                        onChange={onHandleChange}
                        defaultChecked={student.pivot.progress_handler === 'automatically'}
                      />
                      <label className="ml-1" htmlFor={`progress_handler_${student.id}_automatically`}>
                        Automatically
                      </label>
                    </div>
                    <div className="w-full">
                      <input
                        type="radio"
                        name={`progress_handler_${student.id}`}
                        id={`progress_handler_${student.id}_manually`}
                        value="manually"
                        className=""
                        onChange={onHandleChange}
                        defaultChecked={student.pivot.progress_handler === 'manually'}
                      />
                      <label className="ml-1" htmlFor={`progress_handler_${student.id}_manually`}>
                        Manually
                      </label>
                    </div>
                  </div>
                ))}

              {students.length == 0 && <p className="text-center w-full mt-4 pb-0">No records found.</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
