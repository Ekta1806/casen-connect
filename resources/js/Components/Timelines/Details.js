import React, { Fragment, useEffect, useState, useRef } from 'react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ApiService from '@/services/ApiService';
import { Link, usePage } from '@inertiajs/inertia-react';
import swal from 'sweetalert2';
import { Menu, Transition, Tab, Popover } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { Inertia } from '@inertiajs/inertia';
import deleteRecord from '@/delete/delete';
import ReadMore from '@/Components/ReadMore';
import { ClassExpand, Expand, AdminOwnPostExpand } from '@/Components/Expand';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import AddPost from '@/Modals/AddPost';
import { Avatar, CardHeader } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DisplayNotesInModal from '@/Modals/DisplayNotesInModal';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LikeButton, ClassPostLikeButton, AdminPostLikeButton } from '../LikeButton';
import Tour from 'reactour';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import Images from '../Images';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
function CheckList(props) {
  const [arrayCheckList, setarrayCheckList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleOnChange = (e) => {
    if(e.target.checked == true){
      const arr = [...`${e.target.value}`].map(Number);
      var checklistId = props.checklist ? JSON.parse(props.checklist.checklist_id).concat(arr) : arr ;
      ApiService.post(route('student.checklist.store',{"checklist": checklistId})).then((res) => {
        Inertia.reload({props});
      });
    }
    else{
      e.target.checked = false;
      var checklist =e.target.value;
      ApiService.post(route('student.checklist.update',{"checklist": checklist})).then((res) => {
        Inertia.reload({props});
      });
    } 
  }
  

  useEffect(() => {
    
   
    setarrayCheckList([
      {
        id: 1,
        name: "Read the news feed",
      },
      {
        id: 2,
        name: "Answer the question of the day",
      },
      {
        id: 3,
        name: "Answer the question in the discussion board",
      },
      {
        id: 4,
        name: "Respond to two classmates posts",
      },
      {
        id: 5,
        name: "Review the information from the news feed for tomorrow's daily question",
      },
    ]);  
   
  }, [refreshKey]);


  return (
    <>
      <div className="px-0 md:px-4 py-4 mx-auto w-full">
        <div className="flex flex-wrap justify-center md:justify-start">
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4 md:gap-2 lg:gap-6 w-full md:w-full">
            <div className="rounded-lg p-2 lg:p-5 bg-white border-1 border-blue-100">
              <div className="flex flex-row justify-between items-start">
                <h5 className=" mt-0 text-lg font-semibold text-black-500">CheckList</h5>
                <div className="right-box-text items-end">
                  <h6 className="custom-dash-student-icon-card">
                      <TourOutlinedIcon className="text-purple-700 bg-purple-200 p-3 rounded-full justify-center top-0"/>
                  </h6>
                </div>
              </div>
            
              {arrayCheckList.map((checklist)=>(
                <>
                 <p>
                  <label
                    htmlFor={checklist.id}
                    className="text-sm flex mb-2"
                  >
                    <input type="checkbox" className="custom-checkbox accent-purple-700 checklist mr-2" value={checklist.id} id={checklist.id} name="checklist" checked={props.checklist ? props.checklist.checklist_id.includes(checklist.id): false}
                      onChange={e => handleOnChange(e,checklist.value, e,checklist.checked)}/>
                    <span>{checklist.name}</span>
                  </label>
                </p>
                </>
              )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Question() {
  const [data, setdata] = useState([]);

  React.useEffect(() => {
    ApiService.get(route('student.getQuestion'))
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const [counter, setCounter] = useState(0);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const formRef = useRef([0]);

  const onHandleChange = (value) => {
    setContent(value);
  };
  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer);
      toast.addEventListener('mouseleave', swal.resumeTimer);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    const contentValue = content
      .split(/\s+/g)
      .join('$')
      .split(/<p>|<\/p>|¤/)
      .join('$')
      .split('$')
      .join('$')
      .split('<br>')
      .join('$')
      .split('$')
      .filter((word) => word !== '').length;
    const { minimum } = data.question.classes[0].questions.question_details.descriptive_answer_length;
    const { maximum } = data.question.classes[0].questions.question_details.descriptive_answer_length;

    if (contentValue && (contentValue < minimum || contentValue > maximum)) {
      Swal.fire({
        title: 'Error !',
        text: `Please enter minimum ${minimum} and maximum ${maximum} words.`,
        icon: 'error',
      });
    } else {
      setCounter(counter + 1);

      const data = new FormData(formRef.current);

      data.set('attempt', counter);
      data.append('desc_answer', content);

      axios
        .get(route('checkwords'), {
          params: {
            desc: content,
          },
        })
        .then((rsp) => {
          if (rsp.data.status == 'error') {
            const sent = rsp.data.html;
            const div = document.createElement('div');
            const quill = new Quill(div);
            quill.clipboard.dangerouslyPasteHTML(sent);
            const result = quill.root.innerHTML;

            swal.fire({
              icon: 'error',
              html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
            });

            setContent(result);
          } else {
            ApiService.post(route('student.question.store'), data)
              .then((response) => {
                if (response.data.status === 'failed') {
                  setErrors(response.data.errors);
                } else {
                  setErrors(' ');
                  setCounter(0);
                  Toast.fire({
                    icon: 'success',
                    html: '<p class="text-lg">You have completed  questions</p>',
                  });
                  Inertia.visit(route('student.home'), { preserveScroll: false });
                }
              })
              .catch((err) => {
                if (err.response.status === 422) {
                  setErrors(err.response.data.errors);
                }
              });
          }
        });
    }
  };

  return (
    <div className="flex flex-wrap mt-0 md:mt-4">
      <div className="w-full px-0 md:px-0">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-4 rounded-lg bg-white border-1 border-blue-100">
          <div className="rounded-t mb-0 px-4 py-4">
            <div className="text-center flex justify-between">
              <h6 className="flex items-center text-black-600 text-lg font-semibold capitalize" id="question">
                {' '}
                Question Of The Day
                <img alt="images" className="ml-2" width="38" height="38" src="/images/question1.png" />
              </h6>
            </div>
          </div>

          <div className="border-t rounded-b w-full p-2 lg:p-0 bg-gray-50">
            {data.question && data.question.classes[0] && (
              <div className="m-4">
                {data.question.classes[0].questions && (
                  <div>
                    <form onSubmit={submit} ref={formRef}>
                      <input
                        type="hidden"
                        name="class_id"
                        defaultValue={data.question.classes[0].questions.classes_id}
                      />
                      <input
                        type="hidden"
                        name="teacher_id"
                        defaultValue={data.question.classes[0].questions.teacher_id}
                      />
                      <input type="hidden" name="question_id" defaultValue={data.question.classes[0].questions.id} />
                      <input
                        type="hidden"
                        name="question_content"
                        defaultValue={data.question.classes[0].questions.question_details.content}
                      />
                      <p className="w-full mr-4 mb-4 text-black-800">
                        {data.question.classes[0].questions.question_details.content}
                      </p>

                      {data.question.classes[0].questions.question_details.type == 'multiple-choice' ? (
                        <>
                          {errors.option_answer && (
                            <div className="text-red-500 text-sm w-96 m-2">{errors.option_answer}</div>
                          )}
                          <div className="w-full grid grid-cols-2 gap-4">
                            <input
                              type="hidden"
                              name="answer"
                              defaultValue={data.question.classes[0].questions.question_details.correct_answer.option}
                            />
                            <input
                              type="hidden"
                              name="type"
                              defaultValue={data.question.classes[0].questions.question_details.type}
                            />
                            <label
                              htmlFor="option1"
                              className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                            >
                              <input type="radio" value="Option 1" id="option1" name="option_answer" />
                              <p className="ml-2">
                                {data.question.classes[0].questions.question_details.answers.option_1}
                              </p>
                            </label>
                            <label
                              htmlFor="option2"
                              className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                            >
                              <input type="radio" value="Option 2" id="option2" name="option_answer" />
                              <p className="ml-2">
                                {data.question.classes[0].questions.question_details.answers.option_2}
                              </p>
                            </label>
                            <label
                              htmlFor="option3"
                              className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                            >
                              <input type="radio" value="Option 3" id="option3" name="option_answer" />
                              <p className="ml-2">
                                {data.question.classes[0].questions.question_details.answers.option_3}
                              </p>
                            </label>

                            <label
                              htmlFor="option4"
                              className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow"
                            >
                              <input type="radio" value="Option 4" id="option4" name="option_answer" />
                              <p className="ml-2">
                                {data.question.classes[0].questions.question_details.answers.option_4}
                              </p>
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-red-500 text-right">
                            Minimum{' '}
                            {data.question.classes[0].questions.question_details.descriptive_answer_length.minimum} &
                            Maximum{' '}
                            {data.question.classes[0].questions.question_details.descriptive_answer_length.maximum}{' '}
                            Words
                          </p>
                          {errors.desc_answer && <div className="text-red-500 text-sm w-96">{errors.desc_answer}</div>}
                          {errors.answer && <div className="text-red-500 text-sm w-96">{errors.answer}</div>}

                          <input
                            type="hidden"
                            name="type"
                            value={data.question.classes[0].questions.question_details.type}
                          />
                          <input type="hidden" name="answer" value={content.replace(/<(.|\n)*?>/g, '')} />
                          <input
                            type="hidden"
                            name="maximum"
                            defaultValue={
                              data.question.classes[0].questions.question_details.descriptive_answer_length.maximum
                            }
                          />
                          <input
                            type="hidden"
                            name="minimum"
                            defaultValue={
                              data.question.classes[0].questions.question_details.descriptive_answer_length.minimum
                            }
                          />
                          <ReactQuill
                            value={content}
                            onChange={onHandleChange}
                            className="ql-editor custom-ql-tollbar"
                            theme="snow"
                          />
                        </>
                      )}
                      <p>
                        {data.question.classes[0].questions.question_details.type == 'multiple-choice'
                          ? ''
                          : `${
                              data.question.classes[0].questions.question_details.descriptive_answer_length.maximum -
                              content
                                .split(/\s+/g)
                                .join('$')
                                .split(/<p>|<\/p>|¤/)
                                .join('$')
                                .split('$')
                                .join('$')
                                .split('<br>')
                                .join('$')
                                .split('$')
                                .filter((word) => word !== '').length
                            } Words are left.`}{' '}
                      </p>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none ease-linear transition-all"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            {!data.question && (
              <div className="item-center text-black text-lg text-bold p-2 m-12 mx-auto rounded-2xl md:max-w-xs z-10">
                <p className="flex text-center">
                  The question has not been posted yet.
                  <img width="50" alt="images" height="50" src="/images/question.png" />
                </p>
              </div>
            )}
            {!data.completed && data.question && !data.question.classes[0].questions && (
              <div className="item-center text-black text-lg text-bold p-2 m-12 mx-auto rounded-2xl md:max-w-xs z-10">
                <p className="flex text-center">
                  The question has not been posted yet.
                  <img width="50" alt="images" height="50" src="/images/question.png" />
                </p>
              </div>
            )}

            {data.completed && (
              <div className="">
                <div className="flex justify-start m-0 item-center px-0 mx-auto bg-white items-center flex-col md:flex-row">
                  <div className="w-full md:w-1/3 que-bg-right order-last md:order-first">
                    <img alt="images" src="/images/que-bg.png" />
                  </div>
                  <div className="w-full md:w-2/3 left-col p-2 mx-0 md:p-8 md:mx-8">
                    <Link href={route('questions.review')}>
                      <p className="hover:underline hover:text-blue-600 w-full text-lg font-bold text-black-600 mb-1">
                        {data.completed.question_content}
                      </p>
                    </Link>

                    {data.completed.option_answer ? (
                      <>
                        <div className="w-full grid grid-cols-2 gap-4">
                          <div
                            className={`flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ${
                              data.completed.option_answer === 'Option 1' ? 'bg-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <p className="ml-2">{data.completed.options.answers.option_1}</p>
                          </div>
                          <div
                            className={`flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ${
                              data.completed.option_answer === 'Option 2' ? 'bg-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <p className="ml-2">{data.completed.options.answers.option_2}</p>
                          </div>
                          <div
                            className={`flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ${
                              data.completed.option_answer === 'Option 3' ? 'bg-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <p className="ml-2">{data.completed.options.answers.option_3}</p>
                          </div>
                          <div
                            className={`flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ${
                              data.completed.option_answer === 'Option 4' ? 'bg-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <p className="ml-2">{data.completed.options.answers.option_4}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <ReadMore className="ml-4 p-2">{data.completed.desc_answer}</ReadMore>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function CardBarChart() {
  const [data, setdata] = useState([0]);
  const { auth } = usePage().props;

  useEffect(() => {
    ApiService.get(route('student.details')).then((res) => {
      setdata(res.data);
    });
  }, []);

  return (
    <>
      <div className="px-0 md:px-4 py-4 mx-auto w-full">
        <div className="flex flex-wrap justify-center md:justify-start">
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-4 md:gap-2 lg:gap-6 w-full md:w-full">
            <div className="rounded-lg p-2 lg:p-5 bg-white border-1 border-blue-100">
              <div className="flex flex-row justify-between items-start">
                <h5 className=" mt-0 text-lg font-semibold text-black-500">Question Of The Day</h5>
                <div className="right-box-text items-end">
                  <h6 className="custom-dash-student-icon-card">
                    <EventAvailableOutlinedIcon className="text-blue-700 bg-blue-200 p-3 rounded-full justify-center top-0" />
                  </h6>
                </div>
              </div>
              <p className="text-green-400">
                <Link href={route('questions.review')} className="text-sm font-semibold block text-green-500">
                  Total questions attended: {data.questions}
                </Link>
              </p>
              <p className="text-sm font-semibold block text-red-500">Total questions missed: {data.missQuestions}</p>
            </div>
            <div id = "classmates" className="rounded-lg p-2 lg:p-5 bg-white border-1 border-blue-100">
              <div className="flex flex-row justify-between items-start">
                <h6 className="mt-0 text-lg font-semibold text-black-500">Total Classmates</h6>
                <div className="right-box-text">
                  <h5 className="custom-dash-student-icon-card">
                    <Link
                      className="flex w-12 text-green-700 bg-green-200 p-3 rounded-full justify-center"
                      href={route('members')}
                    >
                      {data.member && `${data.member.classes[0].students_count} `}
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function News() {
  const [data, setdata] = useState([0]);

  useEffect(() => {
    ApiService.get(route('student.news')).then((res) => {
      setdata(res.data);
    });
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-0 md:mt-4 " id="news">
        <div className="w-full mb-6 md:mb-12 px-0 md:px-4 ">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg bg-white border-1 border-blue-100">
            <div className="rounded-t mb-0 px-4 py-4">
              <div className="text-center flex justify-between">
                <h6 className="flex items-center text-black-600 text-lg font-semibold capitalize">
                  {' '}
                  News
                </h6>
                <img className="ml-2" alt="" width="38" height="38" src="/images/news.png" />
              </div>
            </div>
            <div className="w-full border-t overflow-y-auto max-h-81">
              <div className="item-center p-3 m-4 mx-auto">
                {data.news &&
                  data.news.map((announce, index) => (
                    <div className="mb-4 bg-gray-50 p-3 rounded" key={index}>
                      <p className="uppercase font-semibold text-sm mb-2">News about {announce.title}</p>
                      <p className="mt-0 text-md text-gray-400 whitespace-pre-wrap">{announce.content}</p>
                      <p className="text-xs text-gray-600 uppercase mt-3 text-right">
                        {new Date(announce.created_at).toLocaleDateString('en-US', {
                          hour12: false,
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </p>
                    </div>
                  ))}
                {data.news && data.news.length == 0 && (
                  <div className="mb-4 bg-gray-50 p-3 rounded">
                    <p className="uppercase text-sm text-center">NO News</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PostList(props) {
  const { auth } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [exploreData, setExploreData] = useState(props.user.data);
  const [teacherdata, setTeacherdata] = useState(props.teacherPosts.data);
  const [isOpen, setIsOpen] = useState(false);
  const [allMedia, setMedia] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [pageNoOne, setPageNoOne] = useState(props.user.next_page_url);
  const [pageNoTwo, setPageNoTwo] = useState(props.teacherPosts.next_page_url);

  const callbackModal = () => {
    setShowModal(false);

    setIsOpen(false);
  };

  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const popupModel = () => <AddPost closeModel={callbackModal} />;

  const handlAddClick = () => {
    setShowModal(true);
  };
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedPostForNotes, setSelectedPostForNotes] = useState(null);
  const getNotes = (post, e) => {
    e.preventDefault();
    setOpenNotesModal(true);
    setSelectedPostForNotes(post);
  };
  const displayNotes = (post) => (
    <DisplayNotesInModal
      teacherData={auth.track.classes[0]}
      setOpenNotesModal={setOpenNotesModal}
      fetchRoute={route('student.posts.notes', post)}
      modulePanel="student"
    />
  );

  const exploredData = (e) => {
    axios.get(`${pageNoOne}&type=page`).then((res) => {
      setExploreData((old) => [...old, ...res.data.user.data]);

      setPageNoOne(res.data.user.next_page_url);
    });
  };
  const teacherData = (e) => {
    axios.get(`${pageNoTwo}&type=page`).then((res) => {
      setTeacherdata((old) => [...old, ...res.data.teacherPosts.data]);
      setPageNoTwo(res.data.teacherPosts.next_page_url);
    });
  };

  const exporting = exploreData.map((post) => (
    <div key={post.id}>
      <>
        <div className="m-8 relative item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-4xl">
          <div className="p-1 rounded-t-md bg-white" key={post.id}>
            <CardHeader
              avatar={
                <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
                  {post.user.media[0] ? (
                    <Avatar
                      alt="Placeholder"
                      className="bg-yellow-500 w-12 h-12 block rounded-full"
                      src={post.user.media[0].original_url}
                    />
                  ) : (
                    <Avatar className="bg-yellow-500">{post.user.first_name.charAt(0)}</Avatar>
                  )}
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <Link className="" href={route('members.profile', post.user.id)}>
                      <p className="ml-1 text-sm font-semibold capitalize">{`${post.user.first_name} ${post.user.last_name}`}</p>
                    </Link>
                    <span className="ml-1 text-gray-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                  {post.user.id == auth.user.id &&
                    (post.status == 'pending' ? (
                      <span className="bg-yellow-200 hover:bg-yellow-600 hover:text-white duration-300 text-yellow-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getNotes(post, e)}
                        >
                          <AccessTimeIcon className="py-1half" /> Notes +
                        </Link>
                      </span>
                    ) : post.status == 'approved' ? (
                      <span className="bg-green-200 hover:bg-green-600 hover:text-white duration-300 text-green-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getNotes(post, e)}
                        >
                          <DoneIcon className="py-1half" /> Notes +
                        </Link>
                      </span>
                    ) : (
                      <span className="bg-red-200 hover:bg-red-600 hover:text-white duration-300 text-red-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getNotes(post, e)}
                        >
                          <ThumbDownOffAltIcon className="py-1half" /> Notes +
                        </Link>
                      </span>
                    ))}
                </span>
              }
              action={
                post.user.id == auth.user.id && (
                  <Menu as="div" className="relative inline-block">
                    <div className="bg-white">
                      <Menu.Button className="bg-white rounded-2xl focus:outline-white hover:bg-blue-600 hover:text-white text-gray-500 font-semibold m-1 p-1">
                        <MoreHoriz />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute w-24 top-0 right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                        <div className="py-1">
                          {post.status == 'pending' || post.status == 'rejected' ? (
                            <Menu.Item>
                              <Link
                                href={route('post.edit', [post.id, 'editposts'])}
                                method="get"
                                className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                              >
                                Edit
                              </Link>
                            </Menu.Item>
                          ) : (
                            ''
                          )}
                          <Menu.Item>
                            <Link
                              href="#"
                              onClick={(e) => deleteRecord(e, route('post.destroy', post.id))}
                              method="delete"
                              className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                            >
                              Delete
                            </Link>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )
              }
            />
          </div>
          <div className="p-3">
            <ReadMore>{post.desc}</ReadMore>
          </div>
          {post.media.length > 1 ? (
            <>
              <div className="grid grid-cols-2">
                {post.thumb_url.slice(0, 4).map((photo, index) => (
                  <div className="relative custom-popup-hover">
                    <button
                      className="image-size-big w-full"
                      onClick={() => {
                        setIsOpen(true);
                        setImgIndex(index);
                        media(post.media);
                      }}
                    >
                      <img key={index} src={photo} className="w-full h-auto object-cover down" alt="" />
                    </button>
                    {index == 3 && post.media.length - 4 !== 0 && (
                      <div className="">
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setImgIndex(index);
                            media(post.media);
                          }}
                          className="number"
                        >
                          {post.media.length - 4}+
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            [
              post.media.length == 1 ? (
                <div key={post.id} className="mb-4">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setImgIndex(0);
                      media(post.media);
                    }}
                  >
                    <img src={post.thumb_url[0]} className="w-full h-auto" alt="" />
                  </button>
                </div>
              ) : null,
            ]
          )}
          <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
            <div className="flex items-center flex-wrap p-0 w-full">
              { post.status=="approved" &&
              <>
              <LikeButton props={post.id} />
              <Expand
                className=""
                teacherData={auth.track.classes[0]}
                postId={post.id}
                value={props.students}
                valueOne={post.comments_count}
                fetchRoute=""
                modulePanel=""
                modulePaneltwo=""
              >
                {post.id}
              </Expand>
              </>
              }
            </div>
          </div>
        </div>
      </>
    </div>
  ));

  const adminPosts = props.adminPosts.map((post) => (
    <div key={post.id}>
      <>
        <div className="m-8 relative item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-4xl">
          <div className="bg-purple-200 flex flex-row" key={post.id}>
            <CardHeader
              avatar={
                <span className="flex items-center no-underline w-18 h-12 rounded-full bg-purple-200">
                  {post.admin.media[0] ? (
                    <Avatar
                      alt="Placeholder"
                      className="bg-yellow-500 w-12 h-12 block rounded-full"
                      src={post.admin.media[0].original_url}
                    />
                  ) : (
                    <Avatar className="bg-yellow-500">{post.admin.first_name.charAt(0)}</Avatar>
                  )}
                  <div className="flex flex-wrap flex-col lg:flex-row items-start justify-start">
                    {props.isFriday ?
                    <>
                    <Link className="" href={route('admin.profile', post.admin.id)}>
                      <p className="ml-2 text-sm font-semibold capitalize">{`${post.admin.first_name} ${post.admin.last_name}`}</p>
                    </Link>
                    </>
                    :
                    <>
                      <p className="ml-2 text-sm font-semibold capitalize">{`${post.admin.first_name} ${post.admin.last_name}`}</p>
                    </>
                    }
                    <span className="ml-2 text-gray-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                </span>
              }
            />
          </div>
          <div className="p-3">
            <ReadMore>{post.content}</ReadMore>
          </div>
          {post.media.length > 1 ? (
            <>
              <div className="grid grid-cols-2">
                {post.thumb_url.slice(0, 4).map((photo, index) => (
                  <div className="relative custom-popup-hover">
                    <button
                      className="image-size-big w-full"
                      onClick={() => {
                        setIsOpen(true);
                        setImgIndex(index);
                        media(post.media);
                      }}
                    >
                      <img key={index} src={photo} className="w-full h-auto object-cover down" alt="" />
                    </button>
                    {index == 3 && post.media.length - 4 !== 0 && (
                      <div className="">
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setImgIndex(index);
                            media(post.media);
                          }}
                          className="number"
                        >
                          {post.media.length - 4}+
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            [
              post.media.length == 1 ? (
                <div key={post.id} className="mb-4">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setImgIndex(0);
                      media(post.media);
                    }}
                  >
                    <img src={post.thumb_url[0]} className="w-full h-auto" alt="" />
                  </button>
                </div>
              ) : null,
            ]
          )}
          <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
            <div className="flex items-center flex-wrap p-0 w-full">
              <AdminPostLikeButton props={post.id} isFriday={props.isFriday} />
              <AdminOwnPostExpand
                postId={post.id}
                value={props.students}
                valueOne={post.comments_count}
                modulePanel="student"
                isFriday={props.isFriday}
              >
                {post.id}
              </AdminOwnPostExpand>
            </div>
          </div>
        </div>
      </>
    </div>
  ));

  const teacher_post = teacherdata.map((post, index) => (
    <>
      <div className="m-8 relative item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-4xl" key={index}>
        <div className="bg-blue-100 flex flex-row rounded-t">
          <div className="px-2 py-3 mx-0 md:mx-3 w-auto h-auto rounded-full">
            {post.teacher.media.length ? (
              <img
                alt="images"
                className="w-12 h-12 object-cover rounded-full shadow"
                src={post.teacher.media[0].original_url}
              />
            ) : (
              <Avatar className="bg-yellow-500 w-12 h-12 object-cover rounded-full shadow">
                {post.teacher.first_name.charAt(0)}
              </Avatar>
            )}
          </div>

          <div className="flex flex-col py-3">
            <div className="flex text-black-600 text-sm font-bold">
              <span className="flex-1 flex-shrink-0">{`${post.teacher.first_name} ${post.teacher.last_name}`}</span>
            </div>
            <div className="flex w-full mt-1">
              <div className="text-blue-600 font-base text-sm mr-1">Teacher</div>
              <div className="text-gray-500 text-sm">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  hour12: false,
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-400 font-medium mb-7 mt-6 mx-3 px-2">
          {post.media.length > 1 ? (
            <>
              <div className="grid grid-cols-2">
                {post.thumb_url.slice(0, 4).map((photo, index) => (
                  <div className="relative custom-popup-hover">
                    <button
                      className="image-size-big w-full"
                      onClick={() => {
                        setIsOpen(true);
                        setImgIndex(index);
                        media(post.media);
                      }}
                    >
                      <img key={index} src={photo} className="w-full h-auto object-scale down" alt="" />
                    </button>
                    {index == 3 && post.media.length - 4 !== 0 && (
                      <div className="overlay">
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setImgIndex(index);
                            media(post.media);
                          }}
                          className="number"
                        >
                          {post.media.length - 4}+
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            [
              post.media.length ? (
                <div key={post.id} className="mb-4">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setImgIndex(0);
                      media(post.media);
                    }}
                  >
                    <img src={post.thumb_url[0]} className="w-full h-auto" alt="" />
                  </button>
                </div>
              ) : null,
            ]
          )}
        </div>
        <div className="text-gray-500 mb-6 mx-3 px-2">
          <ReadMore>{post.content}</ReadMore>
        </div>

        <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
          <div className="flex items-center flex-wrap p-0 w-full">
            <ClassPostLikeButton props={post.id} />
            <ClassExpand
              className=""
              teacherData={post.teacher}
              value={props.students}
              fetchRoute=""
              modulePanel=""
              modulePaneltwo=""
              valueOne={post.comments_count}
            >
              {post.id}
            </ClassExpand>
          </div>
        </div>
      </div>
    </>
  ));

  return (
    <>
      <div className="flex flex-wrap mt-0 md:mt-4">
        <div className="w-full mb-0 md:mb-4 px-0 md:px-0">
          <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg bg-white border-1 border-blue-100">
            <div className="">
              <div className="p-4 pb-0 text-center flex justify-between items-center">
                <h6 className="flex items-center text-black-600 text-lg font-semibold">
                  Class Wall
                  <img className="ml-2" width="38" alt="" height="38" src="/images/reviews.png"></img>
                </h6>
                <div className="flex justify-end">
                  <button
                    onClick={handlAddClick}
                    className="inline-flex items-center px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none ease-linear transition-all"
                  >
                    Add Post
                  </button>
                </div>
              </div>
              <Tab.Group>
                <div className='mx-2 my-4 mt-0 sticky z-10 bg-white pt-6 md:pt-4'>
                  <Tab.List className="flex space-x-1 rounded-full bg-blue-600 p-1">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-auto rounded-full p-2 md:p-3 text-xs md:text-sm font-semibold uppercase leading-2 md:leading-5 text-white',
                          'hover:bg-gray-300',
                          selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                        )
                      }
                    >
                      Explore Posts
                    </Tab>
                    <Tab id = "discussion"
                      className={({ selected }) =>
                        classNames(
                          'w-auto rounded-full p-2 md:p-3 text-xs md:text-sm font-semibold uppercase leading-2 md:leading-5 text-white',
                          'hover:bg-gray-300 teacher-post',
                          selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                        )
                      }
                    >
                      <span id = "discussion">Discussion Board </span>
                    </Tab>
                  </Tab.List>
                </div>
                <Tab.Panels className="bg-gray-100 px-2 rounded-b">
                  <Tab.Panel className="overflow-y-auto max-h-full">
                    <div className="mt-2 mb-2">{adminPosts}</div>
                    {props.pinnedPost && props.pinnedPost.map((pinpost, index) => (
                      <>
                      <div className="m-8 relative item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-4xl">
                        <div className="bg-blue-100 flex flex-row rounded-t">
                          <div className="px-2 py-3 mx-0 md:mx-3 w-auto h-auto rounded-full">
                            {pinpost.teacher.media.length ? (
                              <img
                                alt="images"
                                className="w-12 h-12 object-cover rounded-full shadow"
                                src={pinpost.teacher.media[0].original_url}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500 w-12 h-12 object-cover rounded-full shadow">
                                {pinpost.teacher.first_name.charAt(0)}
                              </Avatar>
                            )}
                          </div>

                          <div className="flex flex-col py-3">
                            <div className="flex text-black-600 text-sm font-bold">
                              <span className="flex-1 flex-shrink-0">{`${pinpost.teacher.first_name} ${pinpost.teacher.last_name}`}</span>
                            </div>
                            <div className="flex w-full mt-1">
                              <div className="text-blue-600 font-base text-sm mr-1">Teacher</div>
                              <div className="text-gray-500 text-sm">
                                {new Date(pinpost.created_at).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <>
                          {pinpost.media.length > 1 ? (
                            <div className="grid grid-cols-2 mt-6">
                              {pinpost.thumb_url.slice(0, 4).map((photo, index) => (
                                <>
                                  <div className="relative custom-popup-hover">
                                    <div className="" key={index}>
                                      <button
                                        className="image-size-big w-full"
                                        onClick={() => {
                                          setIsOpen(true);
                                          setImgIndex(index);
                                          media(pinpost.media);
                                        }}
                                      >
                                        <img src={photo} className="max-w-full h-auto" alt="" />
                                      </button>
                                    </div>
                                    {index == 3 && pinpost.media.length - 4 !== 0 && (
                                      <div className="overlay">
                                        <button
                                          onClick={() => {
                                            setIsOpen(true);
                                            setImgIndex(index);
                                            media(pinpost.media);
                                          }}
                                          className="number"
                                        >
                                          {pinpost.media.length - 4}+
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ))}
                            </div>
                          ) : (
                            [
                              pinpost.media.length ? (
                                <button
                                  onClick={() => {
                                    setIsOpen(true);
                                    setImgIndex(0);
                                    media(pinpost.media);
                                  }}
                                >
                                  <img
                                    src={pinpost.thumb_url[0]}
                                    className="w-full h-auto rounded-lg"
                                    alt=""
                                  />
                                </button>
                              ) : null,
                            ]
                          )}
                        </>
                        <div className="text-gray-500 mb-6 mx-3 px-2 mt-6">
                          <ReadMore>{pinpost.content}</ReadMore>
                        </div>
                        <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                          <div className="flex items-center flex-wrap p-0 w-full">
                            <ClassPostLikeButton props={pinpost.id} />
                            <ClassExpand
                              className=""
                              teacherData={pinpost.teacher}
                              value={props.students}
                              fetchRoute=""
                              modulePanel=""
                              modulePaneltwo=""
                              valueOne={pinpost.comments_count}
                            >
                              {pinpost.id}
                            </ClassExpand>
                          </div>
                        </div>
                      </div>
                      </>
                      )
                    )}
                    <div className="mt-2 mb-2">{exporting}</div>
                    {adminPosts.length < 0 && exporting.length < 0 && props.pinnedPost < 0 && (
                      <p className="text-black m-32 text-lg flex justify-center text-center capitalize">
                        No data available
                      </p>
                    )}
                    {pageNoOne && (
                      <div className="mb-6 flex items-center justify-center">
                        <button
                          className="inline-flex items-center px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none ease-linear transition-all"
                          type="button"
                          onClick={(e) => exploredData(e)}
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </Tab.Panel>

                  <Tab.Panel className="overflow-y-auto max-h-full">
                    {teacher_post && teacher_post.length ? (
                      <div className="mt-2 mb-2">{teacher_post}</div>
                    ) : (
                      <p className="text-black m-32 text-lg flex justify-center text-center capitalize">
                        No data available
                      </p>
                    )}
                    {pageNoTwo && (
                      <div className="mb-6 flex items-center justify-center">
                        <button
                          className="inline-flex items-center px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none ease-linear transition-all"
                          type="button"
                          onClick={(e) => teacherData(e)}
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
            {showModal ? popupModel() : null}

            {openNotesModal === true ? displayNotes(selectedPostForNotes) : null}
            {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
          </div>
        </div>
      </div>
    </>
  );
}

function Card(props) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const steps = [
    {
      selector: '#question',
      content: 'This is my first step',
    },
    {
      selector: '#discussion',
      content: 'This is my second step',
    },
    {
      selector: '#news',
      content: 'This is my third step',
    },
  ];

  const [data, setdata] = useState([0]);
  const [arrayCheckList, setarrayCheckList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [value, setValue] = useState([]);
    
  const handleOnChange = (e, value) => {
    let checked = e.target.checked;
    if(checked == true){
      const arr = [...`${e.target.value}`].map(Number);
      var checklistId = props.checklist ? JSON.parse(props.checklist.checklist_id).concat(arr) : arr ;
      ApiService.post(route('student.checklist.store',{"checklist": checklistId})).then((res) => {
        Inertia.reload({props});
      });
    }
    else{
      e.target.checked = false;
      var checklist =e.target.value;
      ApiService.post(route('student.checklist.update',{"checklist": checklist})).then((res) => {
        Inertia.reload({props});
      });
    } 
  }

  useEffect(() => {
    ApiService.get(route('student.details')).then((res) => {
      setdata(res.data);
    });

    setarrayCheckList([
      {
        id: 1,
        name: "Read the news feed",
      },
      {
        id: 2,
        name: "Answer the question of the day",
      },
      {
        id: 3,
        name: "Answer the question in the discussion board",
      },
      {
        id: 4,
        name: "Respond to two classmates posts",
      },
      {
        id: 5,
        name: "Review the information from the news feed for tomorrow's daily question",
      },
    ]);
  }, []);

  return (
    <>
    <div className="news-side ml-1">
        <Popover className="">
          {() => (
            <>
              <Popover.Button>
                <h6 className="custom-dash-student-icon-card">
                <TourOutlinedIcon className="text-purple-700 bg-purple-200 rounded-full p-2" />
                </h6>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2 sm:px-0 lg:max-w-xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      <p>
                        {arrayCheckList.map((checklist)=>(
                          <>
                            <p>
                              <label
                                htmlFor={checklist.id}
                                className="text-sm flex mb-2"
                              >
                                <input type="checkbox" className="custom-checkbox accent-purple-700 checklist mr-2" value={checklist.id} id={checklist.id} name="checklist" checked={props.checklist ? props.checklist.checklist_id.includes(checklist.id): false}
                      onChange={e => handleOnChange(e,checklist.value)}/>
                                {checklist.name}
                              </label>
                            </p>
                          </>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      <span className="news-side custom-dash-student-icon-card">
        <button className="" onClick={(e) => setIsTourOpen(true)}>
          {/* <TourOutlinedIcon className="text-purple-700 bg-purple-200 rounded-full p-2" /> */}
        </button>
        <Tour steps={steps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
      </span>
      <span className="news-side ml-1">
        <Link
          className="news-side flex w-10 text-green-700 bg-green-200 p-2 rounded-full justify-center"
          href={route('members')}
        >
          {data.member && `${data.member.classes[0].students_count} `}
        </Link>
      </span>
      <div className="news-side ml-1">
        <Popover className="">
          {() => (
            <>
              <Popover.Button>
                <h6 className="custom-dash-student-icon-card">
                  <EventAvailableOutlinedIcon className="text-blue-700 bg-blue-200 p-2 rounded-full justify-center top-0" />
                </h6>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2 sm:px-0 lg:max-w-xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      <p className="text-green-400">
                        <Link href={route('questions.review')} className="text-sm font-semibold block text-green-500">
                          Total questions attended: {data.questions}
                        </Link>
                      </p>
                      <p className="text-sm font-semibold block text-red-500">
                        Total questions missed: {data.missQuestions}
                      </p>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  );
}

export { PostList, News, Question, CardBarChart, Card, CheckList };