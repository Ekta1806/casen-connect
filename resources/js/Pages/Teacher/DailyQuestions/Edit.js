import Authenticated from '@/Layouts/Authenticated';
import { useState,useEffect } from 'react';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import { useForm } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO, format } from 'date-fns';
import { convertToLocalTime } from 'date-fns-timezone';

export default function Edit(props) {
  const [selectDate, setSelectDate] = useState(props.question.ask_on_date);
  const [studentsoptions, setStudentsOptions] = useState([]);
  const [studentdata, setStudentData] = useState([]);
  const [class_id, setClassId] = useState([]);
  const [level_id, setLevelId] = useState([]);
  const [student,setStudent] = useState([]);
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [studentvalue, setStudentValue] = useState([]);
  var [selectRef, setselectRef] = useState([]);
  const [errors, setErrors] = useState([]);
  const [extraErrors, setExtraErrors] = useState([]);

  const { data, setData } = useForm({
    daily_question_id: props.question.id,
    track_id: props.question.track_id,
    classes_id: props.question.classes_id,
    level_id: props.question.level_id,
    question_id: props.question.question_id,
    content: props.questionDetails.content,
    ask_on_date: props.question.ask_on_date,
    priority: props.question.priority,
    type: props.questionDetails.type,
    students_id: props.students,
    students: '',
    answer_1: props.questionDetails.type == 'multiple-choice' ? props.answers.option_1 : '',
    answer_2: props.questionDetails.type == 'multiple-choice' ? props.answers.option_2 : '',
    answer_3: props.questionDetails.type == 'multiple-choice' ? props.answers.option_3 : '',
    answer_4: props.questionDetails.type == 'multiple-choice' ? props.answers.option_4 : '',
    minimum_length: props.questionDetails.type == 'descriptive' ? props.answersLength.minimum : '',
    maximum_length: props.questionDetails.type == 'descriptive' ? props.answersLength.maximum : '',
    correct_answer_option: props.questionDetails.type == 'multiple-choice' ? props.correctAnswer.option : '',
  });

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleString();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateTmp = new Date(date).toISOString();
    const localDate = convertToLocalTime(dateTmp, {
      timeZone: timezone,
    });

    return format(localDate, 'yyyy-MM-dd');
  };
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'descriptive', label: 'Descriptive' },
  ];

  const priorityList = [
    { label: 'Normal', value: 'normal' },
    { label: 'Immediately', value: 'immediately' },
  ];

  const [maxDate, setMaxDate] = useState();
  const [disabledDate, setDisabledDate] = useState(data.priority === 'immediately' ? 'readOnly' : '');
  const changeDate = (event) => {
    setSelectDate(formatDate(event));
    setData('ask_on_date', formatDate(event));
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const fetchStudents = async (e) => {
    data.students_id  = '';
    setStudentData('students_id', e.value);
    setData('classes_id', e.value);
    setClassId(e.value);
    return await axios.get(route('teacher.dailyQuestions.getStudents', [`${e.value}`,`${level_id}`]))
      .then((res) => {
        setStudentsOptions(res.data.students);
        return res.data.students;
      });
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

  function show1(){
    document.getElementById('div1').style.display ='none';
    data.students_id=[];
    setStudent(data.students_id);
    data.students = "all_students";
  }
  function show2(){
    document.getElementById('div1').style.display = 'block';
    data.students = "per_student";
  }


  const correctAnswerOptions = [
    { value: 'Option 1', label: 'Answer Option 1' },
    { value: 'Option 2', label: 'Answer Option 2' },
    { value: 'Option 3', label: 'Answer Option 3' },
    { value: 'Option 4', label: 'Answer Option 4' },
  ];

  
  const [processing, setProcessing] = useState(false);
  const onHandleChange = (event, selected) => {
    setValue(selected);
    setData(event.target.name, event.target.value);
  };

  const onStudentsHandleChange = (selected) => {
    setData('students_id',selected);
    setStudentValue(selected);
  };

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);

    if(data.priority === 'immediately'){
      data.ask_on_date = formatDate(new Date());
    } 
    else {
      data.ask_on_date = selectDate;
    } 
    axios
      .patch(route('teacher.dailyQuestions.update', props.question.id), data)
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
          setErrors(err.response.data.errors);
        }
      });
  };

  const priority = async (e) => {
    setData('priority', e);
  };

  const immediateDate = async (e) => {
    if (e.value === 'immediately') {
      setSelectDate(formatDate(new Date()));
      setMaxDate(new Date());
      setData('ask_on_date', new Date());

      setDisabledDate('readOnly');
    } else {
      setSelectDate(props.question.ask_on_date);
      setMaxDate();
      setData('ask_on_date', props.question.ask_on_date);
      setDisabledDate();
    }
    priority(e.value);
  };

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };
  useEffect(() => {
    if(props.question.student_id!=0){
      document.getElementById("per_student").checked = true;
      document.getElementById('div1').style.display = 'block';
      data.students = "per_student";
    }else{
      document.getElementById("all_students").checked = true;
      data.students = "all_students";
    }
  }, []);

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Daily Questions'}>
      
      <div className="flex flex-wrap">
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
          <form onSubmit={submit}>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Daily Question</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600  border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all   "
                      processing={processing}
                    >
                      Update
                    </Button>
                    <button
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
                    <Label forInput="type" value="Type" required={true} />

                    <Select
                      options={questionTypes}
                      defaultValue={questionTypes.filter((type) => type.value == props.questionDetails.type)}
                      onChange={(e) => setData('type', e.value)}
                    ></Select>

                    {errors.type && <div className="text-sm text-red-600">{errors.type}</div>}
                  </div>

                  <div className="w-full lg:w-4/12 px-4 mt-4">
                    <Label forInput="classes_id" value="Select Class" required={true} />

                    <Select
                     defaultValue={props.classes.filter((classes) => classes.value == props.question.classes_id)}
                      name="classes_id"
                      options={props.classes}
                      onChange={fetchStudents}
                    ></Select>

                    {errors.classes_id && <div className="text-sm text-red-600">{errors.classes_id}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="level_id" value="Select Level" required={true} />

                    <Select
                      defaultValue={props.levels.filter((level) => level.value == props.question.level_id)}
                      name="level_id"
                      options={props.levels}
                      onChange={fetchQuestion}
                    ></Select>

                    {errors.level_id && <div className="text-sm text-red-600">{errors.level_id}</div>}
                  </div>
                  <div className="w-full px-4 mt-4">
                    <Label forInput="select_students" value="Select Students" required={true}/>
                    <label
                      htmlFor="all_students"
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                    >
                      <input type="radio" name="students" id="all_students" value="all_students"  onChange={show1} />
                      <p className="ml-2">
                        All Students
                      </p>
                    </label>
                    <label
                      htmlFor="per_student"
                      className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                    >
                      <input type="radio" name="students" id="per_student" value="per_student" onChange={show2} />
                      <p className="ml-2">
                        Particular Students
                      </p>
                    </label>
                    {errors.students && <div className="text-sm text-red-600">{errors.students}</div>}
                  </div>

                  <div className="w-full px-4 mt-4" style={{display: "none"}} id="div1">
                    <Label forInput="students_id" value="Select Students" />
                    <Select
                      ref={ref => {
                        setselectRef(ref);
                      }}
                      name="students_id[]"
                      isMulti
                      id="student_id"
                      value={data.students_id}
                      onChange={(e) => {
                        onStudentsHandleChange(e);
                        setStudent(e.value);
                      }}
                      options={studentsoptions}
                    ></Select>

                    {errors.students_id && <div className="text-sm text-red-600">{errors.students_id}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="priority" value="Priority" required={true} />

                    <Select
                      name="priority"
                      options={priorityList}
                      defaultValue={priorityList.filter((priority) => priority.value == props.question.priority)}
                      onChange={immediateDate}
                    ></Select>

                    {errors.priority && <div className="text-sm text-red-600">{errors.priority}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-4 custom-datepicker">
                    <Label forInput="ask_on_date" value="Ask On Date" required={true} />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        name="ask_on_date"
                        inputFormat="yyyy-MM-dd"
                        value={parseISO(selectDate)}
                        onChange={changeDate}
                        renderInput={(params) => <TextField onKeyDown={onKeyDown} {...params} autoComplete="off" />}
                        disablePast
                        maxDate={maxDate && maxDate}
                        readOnly={disabledDate}
                      />
                    </LocalizationProvider>

                    {errors.ask_on_date && <div className="text-sm text-red-600">{errors.ask_on_date}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="content" value="Content" required={true} />

                    <textarea
                      name="content"
                      id="content"
                      defaultValue={props.questionDetails.content}
                      rows="5"
                      className="mt-1 block w-full py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 resize-none"
                      onChange={onHandleChange}
                    ></textarea>

                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>

                  {data.type === 'descriptive' && (
                    <>
                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="minimum_length" value="Minimum Length of the Answer (Words)" required={true} />

                        <Input
                          handleChange={onHandleChange}
                          value={data.minimum_length}
                          name="minimum_length"
                          className="w-full mt-1"
                        />

                        {errors.minimum_length && <div className="text-sm text-red-600">{errors.minimum_length}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="maximum_length" value="Maximum Length of the Answer (Words)" required={true} />

                        <Input
                          handleChange={onHandleChange}
                          value={data.maximum_length}
                          name="maximum_length"
                          className="w-full mt-1"
                        />

                        {errors.maximum_length && <div className="text-sm text-red-600">{errors.maximum_length}</div>}
                      </div>
                    </>
                  )}

                  

                  {data.type === 'multiple-choice' && (
                    <>
                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_1" value="Answer Option 1" required={true} />

                        <Input
                          name="answer_1"
                          className="w-full mt-1"
                          value={data.answer_1}
                          handleChange={onHandleChange}
                        />

                        {errors.answer_1 && <div className="text-sm text-red-600">{errors.answer_1}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_2" value="Answer Option 2" required={true} />

                        <Input
                          name="answer_2"
                          className="w-full mt-1"
                          value={data.answer_2}
                          handleChange={onHandleChange}
                        />

                        {errors.answer_2 && <div className="text-sm text-red-600">{errors.answer_2}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_3" value="Answer Option 3" required={true} />

                        <Input
                          name="answer_3"
                          className="w-full mt-1"
                          value={data.answer_3}
                          handleChange={onHandleChange}
                        />

                        {errors.answer_3 && <div className="text-sm text-red-600">{errors.answer_3}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="answer_4" value="Answer Option 4" required={true} />

                        <Input
                          name="answer_4"
                          className="w-full mt-1"
                          value={data.answer_4}
                          handleChange={onHandleChange}
                        />

                        {errors.answer_4 && <div className="text-sm text-red-600">{errors.answer_4}</div>}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 mt-4">
                        <Label forInput="correct_answer_option" value="Correct Answer Option" required={true} />

                        <Select
                          name="correct_answer_option"
                          options={correctAnswerOptions}
                          defaultValue={correctAnswerOptions.filter(
                            (answer) => answer.value == props.correctAnswer.option,
                          )}
                          onChange={(e) => setData('correct_answer_option', e.value)}
                        ></Select>

                        {errors.correct_answer_option && (
                          <div className="text-sm text-red-600">{errors.correct_answer_option}</div>
                        )}
                        
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
