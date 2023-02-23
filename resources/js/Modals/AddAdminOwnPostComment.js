
import { usePage, useForm, Link } from '@inertiajs/inertia-react';
import React, { Fragment, useEffect, useState } from 'react';
import swal from 'sweetalert2';
import { MentionsInput, Mention } from 'react-mentions';
import { Avatar } from '@mui/material';
import { Menu, Transition } from '@headlessui/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ApiService from '@/services/ApiService';
import ReadMore from '@/Components/ReadMore';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Inertia } from '@inertiajs/inertia';

import DisplayCommentNotesInModal from '@/Modals/DisplayCommentNotesInModal';

const AddAdminOwnPostComment = ({ teacherData, commentCount, value, props }) => {
    const { data, setData, reset } = useForm({
      comment: '',
      comment_1: '',
    });
  
    const [update, setUpdate] = useState('');
    const [disable, setDisable] = useState(true);
    const [tagdata, setTagData] = useState([]);
    
    const defaultMentionStyle = {
      backgroundColor: '#a6c4f580',
      padding: '5px 0px',
    };
    const defaultStyle = {
      control: {
        fontSize: 14,
        fontWeight: 'normal',
      },
  
      '&multiLine': {
        control: {
          fontFamily: 'monospace',
        },
        highlighter: {
          padding: 9,
          border: '1px solid transparent',
        },
        input: {
          padding: 9,
        },
      },
  
      '&singleLine': {
        display: 'inline-block',
        width: 180,
  
        highlighter: {
          padding: 1,
          border: '2px inset transparent',
        },
        input: {
          padding: 1,
          border: '2px inset',
        },
      },
      
      suggestions: {
        list: {
          border: '1px solid rgba(0,0,0,0.15)',
          fontSize: 14,
        },
        item: {
          padding: '5px 15px',
          borderBottom: '1px solid rgba(0,0,0,0.15)',
          '&focused': {
            backgroundColor: '#a6c4f580',
          },
        },
      },
    };
  
    const [errors, setErrors] = useState([]);
  
    const { auth } = usePage().props;
  
    const [comments, setComments] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingId, setEditingId] = useState(-1);
  
    function handleClick(event, comment) {
      setEditingId(event.currentTarget.value);
      setData({ comment_1: comment });
    }
  
    const renderUserSuggestionEdit = (index) => {
      <>{index}</>;
    };

    const handleCancelEdit = () => {
      setEditingId(-1);
      setErrors('');
      setDisable(true);
    };
  
    const handleChange = (event) => {
      setDisable(false);
      setData({ comment_1: event.target.value});
    };
  
    const handleChangeComment = (event) => {
      setDisable(false);
      setData({ comment: event.target.value });
    };
  
    const handleSave = (e, comment) => {
      e.preventDefault();
      const formData = new FormData();
  
      formData.set('_method', 'PATCH');
      if (editingId == comment.id) {
        formData.set('comment_1', data.comment_1);
      }
      axios
        .get(route('admin.adminposts.checkwords'), {
          params: {
            desc: data.comment_1,
          },
        })
        .then((rsp) => {
          if (rsp.data.status == 'error') {
            swal.fire({
              icon: 'error',
              html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
            });
          } else {
            ApiService.post(route('admin.adminposts.comment.update', comment.id), formData)
              .then(() => {
                setErrors('');
                setEditingId(-1);
                setDisable(true);
                setRefreshKey((oldKey) => oldKey + 1);
                Toast.fire({
                  title: '  ',
                  html: "<p class='text-md'>Comment updated successfully</p>",
                  icon: 'success',
                });
              })
              .catch((err) => {
                if (err.response.status === 422) {
                  setErrors(err.response.data.errors);
                }
              });
          }
        });
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
    const fetchData = (event) => {
      ApiService.destroy(route('admin.adminposts.comment.destroy', event.currentTarget.value)).then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      });
    };
  
    useEffect(() => {
      const fetchData = () => {
        ApiService.get(route('admin.adminposts.comments', value)).then((res) => {
          setComments(res.data);
          Inertia.reload(commentCount);
        });

        ApiService.get(route('admin.adminposts.tagStudents', value)).then((res) => {
          setTagData(res.data);
        });
        };
      fetchData();
    }, [refreshKey]);

   
  
    const [openCommentNotesModal, setOpenCommentNotesModal] = useState(false);
    const [selectedCommentForNotes, setSelectedCommentForNotes] = useState(null);
    const displayCommentNotes = (comment) => (
      <DisplayCommentNotesInModal
        teacherData={teacherData}
        props={comment}
        setOpenCommentNotesModal={setOpenCommentNotesModal}
        fetchRoute={route('student.comments.notes', comment)}
        modulePanel="student"
      />
    );
    
    const comment = comments.map((comment, index) => (
      <div className="flow-root" key={index}>
        <ul className="">
          <li className="py-3 sm:py-4">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {comment.admin &&
                  (comment.admin.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.admin.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.admin.first_name.charAt(0)}
                    </div>
                  ))}
                {comment.teacher &&
                  (comment.teacher.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.teacher.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.teacher.first_name.charAt(0)}
                    </div>
                  ))}
                  {comment.student &&
                  (comment.student.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.student.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.student.first_name.charAt(0)}
                    </div>
                  ))}
              </div>

              <div className="relative flex flex-col w-full">
                {comment.admin && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">{`${comment.admin.first_name} ${comment.admin.last_name}`}</p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.teacher && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.teacher.first_name} ${comment.teacher.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.student && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.student.first_name} ${comment.student.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                {editingId == comment.id ? (
                  <>
                    <div className="whitespace-pre-line">
                      {/* <textarea
                        className="h-48 w-full bg-gray-100 shadow-none break-words text-md rounded-lg"
                        id="standard-helperText"
                        defaultValue={comment.content}
                        name="comment_1"
                        onChange={handleChange}
                      /> */}
                      <MentionsInput
                        className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
                        value={data.comment_1}
                        name="comment_1"
                        rendersuggestion={renderUserSuggestionEdit()}
                        style={defaultStyle}
                        allowSuggestionsAboveCursor={true}
                        onChange={handleChange}
                      >
                        <Mention
                          className=""
                          trigger="@"
                          markup="@[__display__]"
                          style={defaultMentionStyle}
                          renderSuggestion={(entry) => {
                            var els = document.getElementsByClassName("pointer-events-none");
                            Array.prototype.forEach.call(els, function(el) {
                                el.parentElement.classList.add("disable-heading");
                            });
                              if(!entry.image){
                                return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                                  {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                                  <span>{entry.display}</span>
                                  
                                  </div>
                              }else{
                              return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                                <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                                <span>{entry.display}</span>
                                </div>;
                              }
                          }}
                          data={
                            tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original  }))
                          }
                        />
                      </MentionsInput>
                    </div>
                    {errors.comment_1 && <div className="text-red-500 m-2">{errors.comment_1}</div>}
                    <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
                      <button
                        onClick={handleCancelEdit}
                      >
                        <CloseOutlinedIcon/>
                      </button>
                      <button
                        onClick={(e) => handleSave(e, comment)}
                        className={
                          (disable == true && 'cursor-not-allowed opacity-50') +
                          ' text-blue-600 focus:outline-none hover:text-yellow-500'
                        }
                        disabled={disable}
                      >
                        <SendOutlinedIcon />
                      </button>
                    </span>
                  </>
                ):(
                  <>
                    <p className="relative break-words text-sm whitespace-pre-line bg-gray-100 p-3 rounded-lg">
                      <ReadMore>{comment.content}</ReadMore>
                    </p>
                  </>
                ) 
                }
              </p>
              </div>
              <div className="inline-flex items-start text-base font-semibold text-gray-900">
                {comment.admin && auth.user.id == comment.admin.id ? (
                  <Menu as="div" className="relative flex justify-end">
                    <div className="flex justify-end">
                      <Menu.Button className="inline-flex justify-center w-full px-1 md:px-4 py-0 text-sm font-medium text-gray-500 rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2">
                        <MoreVertIcon />
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
                      <Menu.Items className="z-11 absolute w-24 top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                        <div className="p-0">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  handleClick(e, comment.content);
                                }}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={fetchData}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  ''
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    ));

    const renderUserSuggestion = (index) => {
      <>{index}</>;
    };
    const SaveComment = () => {
      setDisable(true);
      axios
        .get(route('admin.adminposts.checkwords'), {
          params: {
            desc: data.comment,
          },
        })
        .then((rsp) => {
          if (rsp.data.status == 'error') {
            swal.fire({
              icon: 'error',
              html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
            });
          } else {
            ApiService.post(route('admin.adminposts.comment.store'), data)
              .then(() => {
                setRefreshKey((oldKey) => oldKey + 1);
  
                reset();
                setErrors('');
                Toast.fire({
                  title: '  ',
                  html: "<p class='text-md'>Comment added successfully</p>",
                  icon: 'success',
                });
              })
              .catch((err) => {
                if (err.response.status === 422) {
                  setErrors(err.response.data.errors);
                }
              });
          }
        });
    };
    return (
      <div className="w-full sm:w-full place-content-center p-2 max-w-auto bg-white">
        <div className="mb-2 mt-3 flex flex-row items-start">
          <div className="w-8 h-8 text-sm text-black inline-flex items-center justify-center rounded-full">
            <span className="w-8 h-8 text-sm text-black bg-blueGray-200 inline-flex items-center justify-center rounded-full m-2 sm:-m-12">
              {auth.profilePicture ? (
                <Avatar alt="..." src={auth.profilePicture} className="shadow-xl rounded-full" />
              ) : (
                <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                  {auth.user.first_name.charAt(0)}
                </div>
              )}
            </span>
          </div>
          <div className="relative flex w-full sm:w-full flex-wrap items-stretch">
            <MentionsInput
              className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
              value={data.comment}
              name="comment"
              rendersuggestion={renderUserSuggestion()}
              style={defaultStyle}
              allowSuggestionsAboveCursor={true}
              onChange={handleChangeComment}
            >
              <Mention
                className=""
                trigger="@"
                markup="@[__display__]"
                style={defaultMentionStyle}
                renderSuggestion={(entry) => {
                  var els = document.getElementsByClassName("pointer-events-none");
                  Array.prototype.forEach.call(els, function(el) {
                      el.parentElement.classList.add("disable-heading");
                  });
                    if(!entry.image){
                      return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                        {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                        <span>{entry.display}</span>
                        
                        </div>
                    }else{
                    return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                      <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                      <span>{entry.display}</span>
                      </div>;
                    }
                }}
                data={
                  tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original  }))
                }
              />
            </MentionsInput>
            <input type="hidden" id="post_id" name="post_id" value={(data.post_id = value)} />
            <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
              <button
                onClick={SaveComment}
                className={
                  (disable == true && 'cursor-not-allowed opacity-50') +
                  ' text-blue-600 focus:outline-none hover:text-yellow-500'
                }
                disabled={disable}
              >
                <SendOutlinedIcon />
              </button>
            </span>
          </div>
        </div>
        {errors.comment && <div className="text-red-500 ml-14">{errors.comment}</div>}
        {comments.length ? <div className="whitespace-pre-line mt-2 mb-2">{comment}</div> : ''}
        {openCommentNotesModal === true ? displayCommentNotes(selectedCommentForNotes) : null}
      </div>
    );
};

const AddStudentAdminOwnPostComment = ({ teacherData, commentCount, value, props, isFriday }) => {
  const { data, setData, reset } = useForm({
    comment: '',
    comment_1: '',
  });

  const [update, setUpdate] = useState('');
  const [disable, setDisable] = useState(true);
  const [tagdata, setTagData] = useState([]);

  const defaultMentionStyle = {
    backgroundColor: '#a6c4f580',
    padding: '5px 0px',
  };
  const defaultStyle = {
    control: {
      fontSize: 14,
      fontWeight: 'normal',
    },

    '&multiLine': {
      control: {
        fontFamily: 'monospace',
      },
      highlighter: {
        padding: 9,
        border: '1px solid transparent',
      },
      input: {
        padding: 9,
      },
    },

    '&singleLine': {
      display: 'inline-block',
      width: 180,

      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        border: '2px inset',
      },
    },
    
    suggestions: {
      list: {
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#a6c4f580',
        },
      },
    },
  };

  const [errors, setErrors] = useState([]);

  const { auth } = usePage().props;

  const [comments, setComments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(-1);

  function handleClick(event, comment) {
    setEditingId(event.currentTarget.value);
    setData({ comment_1: comment });
  }

  const handleCancelEdit = () => {
    setEditingId(-1);
    setErrors('');
    setDisable(true);
  };

  const handleChange = (event) => {
    setDisable(false);
    setData({ comment_1: event.target.value });
  };

  const handleChangeComment = (event) => {
    setDisable(false);
    setData({ comment: event.target.value });
  };

  const handleSave = (e, comment) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set('_method', 'PATCH');
    if (editingId == comment.id) {
      formData.set('comment_1', data.comment_1);
    }
    axios
      .get(route('checkwords'), {
        params: {
          desc: data.comment_1,
        },
      })
      .then((rsp) => {
        if (rsp.data.status == 'error') {
          swal.fire({
            icon: 'error',
            html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
          });
        } else {
          ApiService.post(route('student.adminposts.comment.update', comment.id), formData)
            .then(() => {
              setErrors('');
              setEditingId(-1);
              setDisable(true);
              setRefreshKey((oldKey) => oldKey + 1);
              Toast.fire({
                title: '  ',
                html: "<p class='text-md'>Comment updated successfully</p>",
                icon: 'success',
              });
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
              }
            });
        }
      });
  };
  const renderUserSuggestionEdit = (index) => {
    <>{index}</>;
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
  const fetchData = (event) => {
    ApiService.destroy(route('student.adminposts.comment.destroy', event.currentTarget.value)).then(() => {
      setRefreshKey((oldKey) => oldKey + 1);
    });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('student.adminposts.comments', value)).then((res) => {
        setComments(res.data);
        Inertia.reload(commentCount);
      });
      ApiService.get(route('student.adminposts.tagStudents', value)).then((res) => {
        setTagData(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);

  const [openCommentNotesModal, setOpenCommentNotesModal] = useState(false);
  const [selectedCommentForNotes, setSelectedCommentForNotes] = useState(null);
  const getCommentNotes = (comment, e) => {
    e.preventDefault();
    setOpenCommentNotesModal(true);
    setSelectedCommentForNotes(comment);
  };
  const displayCommentNotes = (comment) => (
    <DisplayCommentNotesInModal
      teacherData={teacherData}
      props={comment}
      setOpenCommentNotesModal={setOpenCommentNotesModal}
      fetchRoute={route('student.comments.notes', comment)}
      modulePanel="student"
    />
  );
  
  const comment = comments.map((comment, index) => (
    <div className="flow-root" key={index}>
        <ul className="">
          <li className="py-3 sm:py-4">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {comment.admin &&
                  (comment.admin.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.admin.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.admin.first_name.charAt(0)}
                    </div>
                  ))}
                {comment.teacher &&
                  (comment.teacher.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.teacher.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.teacher.first_name.charAt(0)}
                    </div>
                  ))}
                  {comment.student &&
                  (comment.student.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.student.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.student.first_name.charAt(0)}
                    </div>
                  ))}
              </div>

              <div className="relative flex flex-col w-full">
                {comment.admin && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">{`${comment.admin.first_name} ${comment.admin.last_name}`}</p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.teacher && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.teacher.first_name} ${comment.teacher.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.student && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.student.first_name} ${comment.student.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                {editingId == comment.id ? (
                  <>
                    <div className="whitespace-pre-line">
                      {/* <textarea
                        className="h-48 w-full bg-gray-100 shadow-none break-words text-md rounded-lg"
                        id="standard-helperText"
                        defaultValue={comment.content}
                        name="comment_1"
                        onChange={handleChange}
                      /> */}
                      <MentionsInput
                        className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
                        value={data.comment_1}
                        name="comment_1"
                        rendersuggestion={renderUserSuggestionEdit()}
                        style={defaultStyle}
                        allowSuggestionsAboveCursor={true}
                        onChange={handleChange}
                      >
                        <Mention
                          className=""
                          trigger="@"
                          markup="@[__display__]"
                          style={defaultMentionStyle}
                          renderSuggestion={(entry) => {
                            var els = document.getElementsByClassName("pointer-events-none");
                            Array.prototype.forEach.call(els, function(el) {
                                el.parentElement.classList.add("disable-heading");
                            });
                              if(!entry.image){
                                return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                                  {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                                  <span>{entry.display}</span>
                                  
                                  </div>
                              }else{
                              return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                                <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                                <span>{entry.display}</span>
                                </div>;
                              }
                          }}
                          data={
                            tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original  }))
                          }
                        />
                      </MentionsInput>
                    </div>
                    {errors.comment_1 && <div className="text-red-500 m-2">{errors.comment_1}</div>}
                    <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
                      <button
                        onClick={handleCancelEdit}
                      >
                        <CloseOutlinedIcon/>
                      </button>
                      <button
                        onClick={(e) => handleSave(e, comment)}
                        className={
                          (disable == true && 'cursor-not-allowed opacity-50') +
                          ' text-blue-600 focus:outline-none hover:text-yellow-500'
                        }
                        disabled={disable}
                      >
                        <SendOutlinedIcon />
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <p className="relative break-words text-sm whitespace-pre-line bg-gray-100 p-3 rounded-lg">
                      <ReadMore>{comment.content}</ReadMore>
                    </p>
                  </>
                )}
              </p>
            </div>
            <div className="inline-flex items-start text-base font-semibold text-gray-900">
                {comment.student && auth.user.id == comment.student.id ? (
                  <Menu as="div" className="relative flex justify-end">
                    <div className="flex justify-end">
                      <Menu.Button className="inline-flex justify-center w-full px-1 md:px-4 py-0 text-sm font-medium text-gray-500 rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2">
                        <MoreVertIcon />
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
                      <Menu.Items className="z-11 absolute w-24 top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                        <div className="p-0">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  handleClick(e, comment.content);
                                }}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={fetchData}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  ''
                )}
              </div>
          </div>
        </li>
      </ul>
    </div>
  ));

  const renderUserSuggestion = (index) => {
    <>{index}</>;
  };
  const SaveComment = () => {
    setDisable(true);
    axios
      .get(route('checkwords'), {
        params: {
          desc: data.comment,
        },
      })
      .then((rsp) => {
        if (rsp.data.status == 'error') {
          swal.fire({
            icon: 'error',
            html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
          });
        } else {
          ApiService.post(route('student.adminposts.comment.store'), data)
            .then(() => {
              setRefreshKey((oldKey) => oldKey + 1);

              reset();
              setErrors('');
              Toast.fire({
                title: '  ',
                html: "<p class='text-md'>Comment added successfully</p>",
                icon: 'success',
              });
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
              }
            });
        }
      });
  };
  return (
    <div className="w-full sm:w-full place-content-center p-2 max-w-auto bg-white">
      <div className="mb-2 mt-3 flex flex-row items-start">
      { isFriday == true &&
        <>
          <div className="w-8 h-8 text-sm text-black inline-flex items-center justify-center rounded-full">
            <span className="w-8 h-8 text-sm text-black bg-blueGray-200 inline-flex items-center justify-center rounded-full m-2 sm:-m-12">
              {auth.profilePicture ? (
                <Avatar alt="..." src={auth.profilePicture} className="shadow-xl rounded-full" />
              ) : (
                <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                  {auth.user.first_name.charAt(0)}
                </div>
              )}
            </span>
          </div>
          <div className="relative flex w-full sm:w-full flex-wrap items-stretch">
            <MentionsInput
              className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
              value={data.comment}
              name="comment"
              rendersuggestion={renderUserSuggestion()}
              style={defaultStyle}
              allowSuggestionsAboveCursor={true}
              onChange={handleChangeComment}
            >
              <Mention
                className=""
                trigger="@"
                markup="@[__display__]"
                style={defaultMentionStyle}
                renderSuggestion={(entry) => {
                  var els = document.getElementsByClassName("pointer-events-none");
                  Array.prototype.forEach.call(els, function(el) {
                      el.parentElement.classList.add("disable-heading");
                  });
                    if(!entry.image){
                      return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                        {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                        <span>{entry.display}</span>
                        
                        </div>
                    }else{
                    return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                      <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                      <span>{entry.display}</span>
                      </div>;
                    }
                }}
                data={
                  tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original  }))
                }
              />
            </MentionsInput>

            <input type="hidden" id="post_id" name="post_id" value={(data.post_id = value)} />
            <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
              <button
                onClick={SaveComment}
                className={
                  (disable == true && 'cursor-not-allowed opacity-50') +
                  ' text-blue-600 focus:outline-none hover:text-yellow-500'
                }
                disabled={disable}
              >
                <SendOutlinedIcon />
              </button>
            </span>
          </div>
        </>
      }
      </div>
      {errors.comment && <div className="text-red-500 ml-14">{errors.comment}</div>}
      {comments.length ? <div className="whitespace-pre-line mt-2 mb-2">{comment}</div> : ''}
      {openCommentNotesModal === true ? displayCommentNotes(selectedCommentForNotes) : null}
    </div>
  );
};

const AddTeacherAdminOwnPostComment = ({ commentCount, value, props , isFriday}) => {
  const { data, setData, reset } = useForm({
    comment: '',
    comment_1: '',
  });

  const [update, setUpdate] = useState('');
  const [disable, setDisable] = useState(true);

  const defaultMentionStyle = {
    backgroundColor: '#a6c4f580',
    padding: '5px 0px',
  };
  const defaultStyle = {
    control: {
      fontSize: 14,
      fontWeight: 'normal',
    },

    '&multiLine': {
      control: {
        fontFamily: 'monospace',
      },
      highlighter: {
        padding: 9,
        border: '1px solid transparent',
      },
      input: {
        padding: 9,
      },
    },

    '&singleLine': {
      display: 'inline-block',
      width: 180,

      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        border: '2px inset',
      },
    },
    
    suggestions: {
      list: {
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#a6c4f580',
        },
      },
    },
  };

  const [errors, setErrors] = useState([]);

  const { auth } = usePage().props;

  const [comments, setComments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(-1);
  const [tagdata, setTagData] = useState([]);

  function handleClick(event, comment) {
    setEditingId(event.currentTarget.value);
    setData({ comment_1: comment });
  }

  const renderUserSuggestionEdit = (index) => {
    <>{index}</>;
  };

  const handleCancelEdit = () => {
    setEditingId(-1);
    setErrors('');
    setDisable(true);
  };

  const handleChange = (event) => {
    setDisable(false);
    setData({ comment_1: event.target.value});
  };

  const handleChangeComment = (event) => {
    setDisable(false);
    setData({ comment: event.target.value });
  };

  const handleSave = (e, comment) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set('_method', 'PATCH');
    if (editingId == comment.id) {
      formData.set('comment_1', data.comment_1);
    }
    axios
      .get(route('teacher.adminposts.checkwords'), {
        params: {
          desc: data.comment_1,
        },
      })
      .then((rsp) => {
        if (rsp.data.status == 'error') {
          swal.fire({
            icon: 'error',
            html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
          });
        } else {
          ApiService.post(route('teacher.adminposts.comment.update', comment.id), formData)
            .then(() => {
              setErrors('');
              setEditingId(-1);
              setDisable(true);
              setRefreshKey((oldKey) => oldKey + 1);
              Toast.fire({
                title: '  ',
                html: "<p class='text-md'>Comment updated successfully</p>",
                icon: 'success',
              });
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
              }
            });
        }
      });
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
  const fetchData = (event) => {
    ApiService.destroy(route('teacher.adminposts.comment.destroy', event.currentTarget.value)).then(() => {
      setRefreshKey((oldKey) => oldKey + 1);
    });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('teacher.adminposts.comments', value)).then((res) => {
        setComments(res.data);
        Inertia.reload(commentCount);
      });
      ApiService.get(route('teacher.adminposts.tagStudents', value)).then((res) => {
        setTagData(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);

  
  const comment = comments.map((comment, index) => (
    <div className="flow-root" key={index}>
        <ul className="">
          <li className="py-3 sm:py-4">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {comment.admin &&
                  (comment.admin.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.admin.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.admin.first_name.charAt(0)}
                    </div>
                  ))}
                {comment.teacher &&
                  (comment.teacher.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.teacher.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.teacher.first_name.charAt(0)}
                    </div>
                  ))}
                  {comment.student &&
                  (comment.student.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.student.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.student.first_name.charAt(0)}
                    </div>
                  ))}
              </div>

              <div className="relative flex flex-col w-full">
                {comment.admin && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">{`${comment.admin.first_name} ${comment.admin.last_name}`}</p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.teacher && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.teacher.first_name} ${comment.teacher.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {comment.student && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.student.first_name} ${comment.student.last_name}`}
                    </p>
                    <span className="ml-1 text-gray-500 text-sm">
                      {' '}
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                {editingId == comment.id ? (
                  <>
                    <div className="whitespace-pre-line">
                      {/* <textarea
                        className="h-48 w-full bg-gray-100 shadow-none break-words text-md rounded-lg"
                        id="standard-helperText"
                        defaultValue={comment.content}
                        name="comment_1"
                        onChange={handleChange}
                      /> */}
                      <MentionsInput
                        className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
                        value={data.comment_1}
                        name="comment_1"
                        rendersuggestion={renderUserSuggestionEdit()}
                        style={defaultStyle}
                        allowSuggestionsAboveCursor={true}
                        onChange={handleChange}
                      >
                        <Mention
                          className=""
                          trigger="@"
                          markup="@[__display__]"
                          style={defaultMentionStyle}
                          renderSuggestion={(entry) => {
                            var els = document.getElementsByClassName("pointer-events-none");
                            Array.prototype.forEach.call(els, function(el) {
                                el.parentElement.classList.add("disable-heading");
                            });
                              if(!entry.image){
                                return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                                  {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                                  <span>{entry.display}</span>
                                  
                                  </div>
                              }else{
                              return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                                <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                                <span>{entry.display}</span>
                                </div>;
                              }
                          }}
                          data={
                            tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
                          }
                        />
                      </MentionsInput>
                    </div>
                    {errors.comment_1 && <div className="text-red-500 m-2">{errors.comment_1}</div>}
                    <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
                      <button
                        onClick={handleCancelEdit}
                      >
                        <CloseOutlinedIcon/>
                      </button>
                      <button
                        onClick={(e) => handleSave(e, comment)}
                        className={
                          (disable == true && 'cursor-not-allowed opacity-50') +
                          ' text-blue-600 focus:outline-none hover:text-yellow-500'
                        }
                        disabled={disable}
                      >
                        <SendOutlinedIcon />
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <p className="relative break-words text-sm whitespace-pre-line bg-gray-100 p-3 rounded-lg">
                      <ReadMore>{comment.content}</ReadMore>
                    </p>
                  </>
                )}
              </p>
            </div>
            <div className="inline-flex items-start text-base font-semibold text-gray-900">
                {comment.teacher && auth.user.id == comment.teacher.id ? (
                  <Menu as="div" className="relative flex justify-end">
                    <div className="flex justify-end">
                      <Menu.Button className="inline-flex justify-center w-full px-1 md:px-4 py-0 text-sm font-medium text-gray-500 rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2">
                        <MoreVertIcon />
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
                      <Menu.Items className="z-11 absolute w-24 top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                        <div className="p-0">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  handleClick(e, comment.content);
                                  }}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={fetchData}
                                value={comment.id}
                                className={`${
                                  active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                                } text-sm py-2 px-4 w-full text-left bg-transparent font-semibold block`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  ''
                )}
              </div>
          </div>
        </li>
      </ul>
    </div>
  ));

  const renderUserSuggestion = (index) => {
    <>{index}</>;
  };
  const SaveComment = () => {
    setDisable(true);
    axios
      .get(route('teacher.adminposts.checkwords'), {
        params: {
          desc: data.comment,
        },
      })
      .then((rsp) => {
        if (rsp.data.status == 'error') {
          swal.fire({
            icon: 'error',
            html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
          });
        } else {
          ApiService.post(route('teacher.adminposts.comment.store'), data)
            .then(() => {
              setRefreshKey((oldKey) => oldKey + 1);

              reset();
              setErrors('');
              Toast.fire({
                title: '  ',
                html: "<p class='text-md'>Comment added successfully</p>",
                icon: 'success',
              });
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
              }
            });
        }
      });
  };
  return (
    <div className="w-full sm:w-full place-content-center p-2 max-w-auto bg-white">
      <div className="mb-2 mt-3 flex flex-row items-start">
      { isFriday == true &&
        <>
          <div className="w-8 h-8 text-sm text-black inline-flex items-center justify-center rounded-full">
            <span className="w-8 h-8 text-sm text-black bg-blueGray-200 inline-flex items-center justify-center rounded-full m-2 sm:-m-12">
              {auth.profilePicture ? (
                <Avatar alt="..." src={auth.profilePicture} className="shadow-xl rounded-full" />
              ) : (
                <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                  {auth.user.first_name.charAt(0)}
                </div>
              )}
            </span>
          </div>
          <div className="relative flex w-full sm:w-full flex-wrap items-stretch">
            <MentionsInput
              className="h-auto min-h-40 relative rounded-2xl capitalize text-md w-full ml-2 inline-flex items-center leading-sm bg-gray-100 text-gray-500 whitespace-pre-line h-auto--multiLine"
              value={data.comment}
              name="comment"
              rendersuggestion={renderUserSuggestion()}
              style={defaultStyle}
              allowSuggestionsAboveCursor={true}
              onChange={handleChangeComment}
            >
              <Mention
                className=""
                trigger="@"
                markup="@[__display__]"
                style={defaultMentionStyle}
                renderSuggestion={(entry) => {
                  var els = document.getElementsByClassName("pointer-events-none");
                  Array.prototype.forEach.call(els, function(el) {
                      el.parentElement.classList.add("disable-heading");
                  });
                    if(!entry.image){
                      return <div className={(entry.id == 0) ? 'font-bold pointer-events-none': 'flex items-center clickdis' }>
                        {(entry.id != 0) && <span className="w-8 h-8 mr-2 relative flex justify-center items-center text-xl text-white rounded-full uppercase bg-yellow-500">{entry.display.charAt(0)}</span>}
                        <span>{entry.display}</span>
                        
                        </div>
                    }else{
                    return <div className={(entry.id == 0) ? 'font-bold pointer-events-none':"flex items-center"}>
                      <span className="w-8 h-8 relative flex justify-center items-center mr-2 rounded-full bg-yellow-500"><img src={entry.image} className="object-cover w-8 h-8 rounded-full"/></span>
                      <span>{entry.display}</span>
                      </div>;
                    }
                }}
                data={
                  tagdata && tagdata.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
                }
              />
            </MentionsInput>
            <input type="hidden" id="post_id" name="post_id" value={(data.post_id = value)} />
            <span className="bottom-0 z-10 h-auto leading-snug font-normal absolute text-center text-base items-center justify-center w-8 right-0 px-2 py-2 mr-2 ml-4 inline-flex">
              <button
                onClick={SaveComment}
                className={
                  (disable == true && 'cursor-not-allowed opacity-50') +
                  ' text-blue-600 focus:outline-none hover:text-yellow-500'
                }
                disabled={disable}
              >
                <SendOutlinedIcon />
              </button>
            </span>
          </div>
        </>
      }
      </div>
      {errors.comment && <div className="text-red-500 ml-14">{errors.comment}</div>}
      {comments.length ? <div className="whitespace-pre-line mt-2 mb-2">{comment}</div> : ''}
    </div>
  );
};

export { AddAdminOwnPostComment, AddStudentAdminOwnPostComment, AddTeacherAdminOwnPostComment };