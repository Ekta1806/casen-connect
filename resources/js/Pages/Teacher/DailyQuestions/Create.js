import Authenticated from '@/Layouts/Authenticated';
import { useState, useRef, useEffect } from 'react';
import Label from '@/Components/Label';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ApiService from '@/services/ApiService';

export default function Create(props) {
  const [data, setData] = useState([]);
  const [studentdata, setStudentData] = useState([]);
  const [value, setValue] = useState([]);
  const [studentvalue, setStudentValue] = useState([]);
  const [class_id, setClassId] = useState([]);
  const [level_id, setLevelId] = useState([]);
  const [processing, setProcessing] = useState(false);

  const formRef = useRef([0]);

  const priorityList = [
    { label: 'Normal', value: 'normal' },
    { label: 'Immediately', value: 'immediately' },
  ];

  const [selectDate, setSelectDate] = useState(null);
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState([]);
  const [studentsoptions, setStudentsOptions] = useState([]);
  const [maxDate, setMaxDate] = useState();
  const [disabledDate, setDisabledDate] = useState();
  const [extraErrors, setExtraErrors] = useState([]);
  const [studentError, setStudentError] = useState([]);


  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const changeDate = (event) => {
    setSelectDate(event);
    setData('ask_on_date', event);
  };

  const onHandleChange = (selected) => {
    setValue(selected);
  };
  const onStudentsHandleChange = (selected) => {
    setStudentValue(selected);
  };

  const fetchQuestion = async (e) => {
    setValue('');
    setData('question_id', e.value);
    setData('level_id', e.value);
    setLevelId(e.value);
    return await axios.get(route('teacher.dailyQuestions.fetch',[`${e.value}`,`${class_id}`])).then((res) => {
      setOptions(res.data.data);
      setStudentsOptions(res.data.studentData);
      return res.data.data;
    });
  };

  const immediateDate = async (e) => {
    if (e.value === 'immediately') {
      setSelectDate(new Date());
      setMaxDate(new Date());
      setDisabledDate('readOnly');
    } else {
      setSelectDate(null);
      setMaxDate();
      setDisabledDate();
    }
  };

  const fetchStudents = async (e) => {
    setStudentValue('');
    setStudentData('students_id', e.value);
    setStudentData('classes_id', e.value);
    setClassId(e.value);
    return await axios.get(route('teacher.dailyQuestions.getStudents', [`${e.value}`,`${level_id}`]))
      .then((res) => {
        setStudentsOptions(res.data.students);
        return res.data.students;
      });
  };
  function show1(){
    document.getElementById('div1').style.display ='none';
  }
  function show2(){
    document.getElementById('div1').style.display = 'block';
  }


  const submit = (e) => {
    e.preventDefault();

    const data = new FormData(formRef.current);

    axios
      .post(route('teacher.dailyQuestions.store'), data)
      .then((response) => {
        setErrors([]);
        if(response.data.status == "error"){
          setExtraErrors(response.data.message);
        }else{
          setProcessing(false);
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          window.history.back();
          setErrors([]);
          reset();
        }
      })
      .catch((err) => {
        setProcessing(false);
        if (err.response.status === 422) {
          Object.entries(err.response.data.errors).forEach(entry => {
            const [key, value] = entry;
            if(key == "students_id.0"){
              setStudentError("Please select atleast one student");
            }
          });
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Daily Questions'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          {extraErrors.length ?
            <>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">
              {extraErrors}
              </span>
            </div>
            </>
          :null}
          <form onSubmit={submit} id="formAddQuestion">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Question</h6>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 text-sm text-white  bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                    >
                      Add{' '}
                    </button>
                    <Link
                      href={route('teacher.dailyQuestions')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
              <form onSubmit={submit} ref={formRef}>
                <div className="flex-auto px-4 lg:px-6 py-10 pt-0">
                  <div className="flex flex-wrap space-y-4">
                    <div className="w-full lg:w-4/12 px-4 mt-4">
                      <Label forInput="classes_id" value="Select Class" required={true} />

                      <Select
                        name="classes_id"
                        options={props.classes}
                        onChange={fetchStudents}
                      ></Select>

                      {errors.classes_id && <div className="text-sm text-red-600">{errors.classes_id}</div>}
                    </div>

                    <div className="w-full lg:w-4/12 px-3 mt-4">
                      <Label forInput="type" value="Select Level" required={true} />

                      <Select name="level_id" options={props.levels} onChange={fetchQuestion}></Select>

                      {errors.level_id && <div className="text-sm text-red-600">{errors.level_id}</div>}
                    </div>
                    <div className="w-full px-4 mt-4">
                      <Label forInput="select_students" value="Select Students" required={true}/>
                      <label
                        htmlFor="all_students"
                        className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                      >
                        <input type="radio" name="students" value="all_students" onChange={show1} id="all_students"/>
                        <p className="ml-2">
                          All Students
                        </p>
                      </label>
                      <label
                        htmlFor="per_student"
                        className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                      >
                        <input type="radio" name="students" value="per_student" onChange={show2} id="per_student"/>
                        <p className="ml-2">
                          Particular Students
                        </p>
                      </label>
                      {errors.students && <div className="text-sm text-red-600">{errors.students}</div>}
                    </div>
                    <div className="w-full px-4 mt-4" id="div1" style={{display: "none"}} >
                      <Label forInput="students_id" value="Select Particular Students" />

                      <Select
                        name="students_id[]"
                        isMulti
                        value={studentvalue}
                        onChange={(e) => {
                          onStudentsHandleChange(e);
                          setStudentData('students_id', e.value);
                        }}
                        options={studentsoptions}
                      ></Select>

                      {studentError && <div className="text-sm text-red-600">{studentError}</div>}
                    </div>

                    <div className="w-full lg:w-4/12 px-4 mt-4">
                      <Label forInput="priority" value="Select Priority" required={true} />

                      <Select name="priority" options={priorityList} onChange={immediateDate}></Select>

                      {errors.priority && <div className="text-sm text-red-600">{errors.priority}</div>}
                    </div>

                    <div className="w-full lg:w-4/12 px-4 mt-4 custom-datepicker">
                      <Label forInput="ask_on_date" value="Ask On Date" required={true} />

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="yyyy-MM-dd"
                          value={selectDate}
                          onChange={changeDate}
                          renderInput={(params) => (
                            <TextField onKeyDown={onKeyDown} name="ask_on_date" {...params} autoComplete="off" />
                          )}
                          disablePast
                          maxDate={maxDate}
                          readOnly={disabledDate}
                        />
                      </LocalizationProvider>
                      {errors.ask_on_date && <div className="text-sm text-red-600">{errors.ask_on_date}</div>}
                    </div>

                    <div className="w-full px-4 mt-4">
                      <Label forInput="question_content" value="Select Question" required={true} />

                      <Select
                        name="question_id"
                        value={value}
                        onChange={(e) => {
                          onHandleChange(e);
                          setData('question_id', e.value);
                        }}
                        options={options}
                      ></Select>
                      {errors.question_id && <div className="text-sm text-red-600">{errors.question_id}</div>}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
