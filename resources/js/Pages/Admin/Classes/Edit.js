import Authenticated from '@/Layouts/Authenticated';
import { useState } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import StudentProgressHandler from './StudentProgressHandler';

export default function Edit(props) {
  const division = props.class;
  const teachers = props.teachers;
  const [teacher,setTeacher] = useState([]);

  const { data, setData } = useForm({
    name: division.name,
    track_id: division.track_id,
    teacher_id: division.teacher_id,
    description: division.description,
    teacher_ids:props.id,
  });

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const onTeachersHandleChange = (selected) => {

    setData('teacher_ids',selected);
  };
  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    axios
      .patch(route('admin.classes.update', division.id), data)
      .then((response) => {
        setProcessing(false);
        window.location.replace(route('admin.classes'));
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
    <Authenticated auth={props.auth} errors={props.errors} header={'Classes'}>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="w-full xl:w-3/5">
            <form onSubmit={submit}>
              <div className="relative flex flex-col min-w-0 break-words w-full mb-0 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
                <div className="rounded-t bg-white mb-0 px-4 py-4">
                  <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                    <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                      <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Class</h6>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="" processing={processing}>
                        Update
                      </Button>
                      <button
                        href="#"
                        className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                        onClick={back}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-auto px-4 lg:px-6 py-10 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="name" value="Name" required={true} />

                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={data.name}
                      defaultValue={division.name}
                      className="mt-1 block w-full"
                      handleChange={onHandleChange}
                    />

                    {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <Label forInput="track_id" value="Select Track" required={true} />

                    <Select
                      options={props.tracks}
                      id="track_id"
                      name="track_id"
                      className="mt-1"
                      onChange={(e) => setData('track_id', e.value)}
                      defaultValue={props.tracks.filter((track) => track.value == division.track_id)}
                    />

                    {errors.track_id && <div className="text-sm text-red-600">{errors.track_id}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="description" value="Description" required={true} />

                    <textarea
                      name="description"
                      id="description"
                      defaultValue={division.description}
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.description && <div className="text-sm text-red-600">{errors.description}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="Select teachers" value="Select Teachers" required={true} />
                    <Select
                      name="teacher_ids[]"
                      isMulti
                      options={teachers}
                      defaultValue={props.id}
                      id="teacher_ids"
                      onChange={(e) => {
                        onTeachersHandleChange(e);
                      }}
                    />
                    {errors.teacher_ids && <div className="text-sm text-red-600">{errors.teacher_ids}</div>}
                  </div>
                </div>
              </div>
              </div>
            </form>
          </div>
          <div className="w-full xl:w-2/5 pl-0 xl:pl-8">
            <StudentProgressHandler students={division.students} division={division} />
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
