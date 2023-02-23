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
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DisplayCommentNotesInModal from '@/Modals/DisplayCommentNotesInModal';
import DisplayAdminCommentNotesInModal from '@/Modals/DisplayAdminCommentNotesInModal';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { FunctionsRounded } from '@mui/icons-material';

const AddCommentTeacher = ({ commentCount, value, props, modulePanel, modulePaneltwo }) => {
  const { data, setData, reset } = useForm({
    comment: '',
    comment_1: '',
  });

  const [disable, setDisable] = useState(true);
  const [clickDisable, setClickDisable] = useState(true);
  
  const approveRejectComment = (e, commentId, status) => {
    e.preventDefault();

    (async () => {
      const notesText = await Swal.fire({
        title: 'Note for Approving / Rejecting',
        input: 'textarea',
        inputLabel: 'Any notes that you would like to add? (Optional)',
        showCancelButton: true,
      });

      /* The status should be updated only if the OK button is clicked. */
      if (notesText.isConfirmed) {
        let notesBody = null;
        if (notesText != null || notesText != '' || notesText.trim().length > 0) {
          notesBody = notesText.value;
        }

        axios
          .patch(route(`${modulePanel}.comments.approveRejectComment`, [commentId, status]), { notes: notesBody })
          .then((res) => {
            Swal.fire({
              title: 'Success !',
              text: res.data.message,
              icon: 'success',
            });

            setTimeout(() => {
              window.location.reload(false);
            }, 1500);

            setRefreshKey((oldKey) => oldKey + 1);
          });
      }
    })();
  };
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
  const none = 'none';
  const [errors, setErrors] = useState([]);

  const { auth } = usePage().props;

  const [comments, setComments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState(-1);
  const [tagData, setTaggedData] = useState([]);
  

  function editComment(event, comment) {
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
    if (editingId == comment) {
      formData.set('comment_1', data.comment_1);
    }
    ApiService.post(route('teacher.comment.update', comment), formData)
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
  const deleteData = (event) => {
    ApiService.destroy(route('teacher.comment.destroy', event.currentTarget.value)).then(() => {
      setRefreshKey((oldKey) => oldKey + 1);
    });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('teacher.studentComments', value)).then((res) => {
        setComments(res.data);
        Inertia.reload(commentCount);
      });
      ApiService.get(route('teacher.students.studentTaggedData', value)).then((res) => {
        setTaggedData(res.data);
        res.data && res.data.map((abc)=>{
          const disableLabel = (abc.id === 0) ? true : false ;
          setClickDisable(disableLabel);
        })
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
      props={comment}
      setOpenCommentNotesModal={setOpenCommentNotesModal}
      fetchRoute={route('teacher.comments.notes', comment)}
      modulePanel={modulePanel}
    />
  );

  const approveRejectClassPostsComment = (e, commentId, status) => {
    e.preventDefault();

    (async () => {
      const notesText = await Swal.fire({
        title: 'Note for Approving / Rejecting',
        input: 'textarea',
        inputLabel: 'Any notes that you would like to add? (Optional)',
        showCancelButton: true,
      });

      if (notesText.isConfirmed) {
        let notesBody = null;
        if (notesText != null || notesText != '' || notesText.trim().length > 0) {
          notesBody = notesText.value;
        }

        axios
          .patch(route(`${modulePanel}.classPosts.approveRejectPendingComment`, [commentId, status]), {
            notes: notesBody,
          })
          .then((res) => {
            Swal.fire({
              title: 'Success !',
              text: res.data.message,
              icon: 'success',
            });

            setRefreshKey((oldKey) => oldKey + 1);
          });
      }
    })();
  };
  const renderUserSuggestionEdit = (index) => {
    <>{index}</>;
  };

  const comment =
    comments &&
    comments.map((commentedBy, index) => (
      <div key={index} className="whitespace-pre-line py-6  border-gray-200 relative">
        <div className="flex items-start space-x-2">
          {commentedBy.teacher && commentedBy.teacher_id != 0 && 
          <div>
            {auth.profilePicture ? (
              <Avatar alt="..." src={auth.profilePicture} className="shadow-xl rounded-full" />
            ) : (
              <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                {auth.user.first_name.charAt(0)}
              </div>
            )}
          </div>
          } 
          {commentedBy.user && commentedBy.commented_by != 0 &&
            <div>
            {commentedBy.user.media.length ? (
              <img
                src={commentedBy.user.media[0].original_url}
                alt={commentedBy.user.first_name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                {commentedBy.user.first_name.charAt(0)}
              </div>
            )}
            </div>
          }
          {commentedBy.admin && commentedBy.admin_id != 0 &&
            <div>
            {commentedBy.admin.media.length ? (
              <img
                src={commentedBy.admin.media[0].original_url}
                alt={commentedBy.admin.first_name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                {commentedBy.admin.first_name.charAt(0)}
              </div>
            )}
            </div>
          }
          <div className="relative flex flex-col w-full">
            <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
              {commentedBy.commented_by !== 0 && (
                <>
                  <p className="ml-1 text-sm truncate">
                    {`${commentedBy.user.first_name} ${commentedBy.user.last_name}`}
                  </p>
                  <span className="text-gray-500 text-sm ml-1">
                    {new Date(commentedBy.created_at).toLocaleDateString('en-US', {
                      hour12: false,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </>
              )}
              {commentedBy.teacher_id !== 0 && (
                <>
                  <p className="ml-1 text-sm truncate">{`${auth.user.first_name} ${auth.user.last_name}`}</p>
                  <span className="text-gray-500 text-sm ml-1">
                    {new Date(commentedBy.created_at).toLocaleDateString('en-US', {
                      hour12: false,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </>
              )}
              {commentedBy.admin_id !== 0 && (
                <>
                  <p className="ml-1 text-sm truncate">{`${commentedBy.admin.first_name} ${commentedBy.admin.last_name}`}</p>
                  <span className="text-gray-500 text-sm ml-1">
                    {new Date(commentedBy.created_at).toLocaleDateString('en-US', {
                      hour12: false,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {editingId == commentedBy.id && commentedBy.teacher_id !== 0 ? (
                <>
                  <div className="whitespace-pre-line">
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
                          tagData && tagData.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original}))
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
                      onClick={(e) => handleSave(e, commentedBy.id)}
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
                  {commentedBy.teacher_id == 0 && commentedBy.admin_id == 0 &&
                    (commentedBy.status == 'pending' ? (
                      <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getCommentNotes(commentedBy, e)}
                        >
                          <HistoryToggleOffOutlinedIcon /> Notes +
                        </Link>
                      </span>
                    ) : commentedBy.status == 'approved' ? (
                      <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getCommentNotes(commentedBy, e)}
                        >
                          <HistoryToggleOffOutlinedIcon /> Notes +
                        </Link>
                      </span>
                    ) : (
                      <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                        <Link
                          href="#"
                          className="focus:outline-none hover:cursor-pointer"
                          onClick={(e) => getCommentNotes(commentedBy, e)}
                        >
                          <HistoryToggleOffOutlinedIcon /> Notes +
                        </Link>
                      </span>
                    ))}
                  <p className="relative break-words text-sm whitespace-pre-line bg-gray-100 p-3 rounded-lg">
                    <ReadMore>{commentedBy.comment}</ReadMore>
                  </p>
                </>
              )}
            </p>
          </div>
          <div className="inline-flex items-start text-base font-semibold text-gray-900 dark:text-white">
            {commentedBy.teacher_id !== 0 && (
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
                  <Menu.Items className="absolute w-36 top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="p-0">
                    <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              editComment(e, commentedBy.comment);
                              }}
                            value={commentedBy.id}
                            className={`${
                              active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={deleteData}
                            value={commentedBy.id}
                            className={`${
                              active ? 'text-blue-600 hover:bg-blue-100' : 'text-black-800'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>

        {modulePanel === 'teacher' &&
          modulePaneltwo !== 'postComments' &&
          (commentedBy.status == null || commentedBy.status == 'pending') && (
            <div className="ml-10 mt-2 text-sm">
              <Link
                className="p-1 px-2 font-semibold text-green-600 bg-green-200 rounded-full border border-transparent hover:bg-green-600 hover:text-white"
                href="#"
                onClick={(e) => approveRejectComment(e, commentedBy.id, 'approved')}
                as="button"
                method="patch"
              >
                {' '}
                Approve
              </Link>
              <Link
                className="p-1 px-2 ml-2  text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white"
                href="#"
                onClick={(e) => approveRejectComment(e, commentedBy.id, 'rejected')}
                as="button"
                method="patch"
              >
                {' '}
                Reject
              </Link>
            </div>
          )}

        {modulePanel === 'teacher' && modulePaneltwo !== 'postComments' && commentedBy.status == 'approved' && (
          <span className="ml-10 text-green-600">Approved</span>
        )}

        {modulePanel === 'teacher' && modulePaneltwo !== 'postComments' && commentedBy.status == 'rejected' && (
          <span className="ml-10 text-red-600">Rejected</span>
        )}

        {modulePanel === 'teacher' &&
          modulePaneltwo === 'postComments' &&
          (commentedBy.status == null || commentedBy.status == 'pending') && (
            <div className="ml-10 mt-2 text-sm">
              <Link
                className="p-1 px-2 font-semibold text-green-600 bg-green-200 rounded-full border border-transparent hover:bg-green-600 hover:text-white"
                href="#"
                onClick={(e) => approveRejectClassPostsComment(e, commentedBy.id, 'approved')}
                as="button"
                method="patch"
              >
                {' '}
                Approve
              </Link>
              <Link
                className="p-1 px-2 ml-2 text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white"
                href="#"
                onClick={(e) => approveRejectClassPostsComment(e, commentedBy.id, 'rejected')}
                as="button"
                method="patch"
              >
                {' '}
                Reject
              </Link>
            </div>
          )}

        {modulePanel === 'teacher' && modulePaneltwo === 'postComments' && commentedBy.status == 'approved' && (
          <span className="ml-10 text-green-600">Approved</span>
        )}

        {modulePanel === 'teacher' && modulePaneltwo === 'postComments' && commentedBy.status == 'rejected' && (
          <span className="ml-10 text-red-600">Rejected</span>
        )}
      </div>
    ));

  const renderUserSuggestion = (index) => {
    <>{index}</>;
  };
  const SaveComment = () => {
    setDisable(true);
    ApiService.post(route('teacher.comment.store'), data)
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
                tagData && tagData.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original}))
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

const AddComment = ({ teacherData, commentCount, value, props }) => {
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

  function handleClick(event,comment) {
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
          ApiService.post(route('comment.update', comment.id), formData)
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
    ApiService.destroy(route('comment.destroy', event.currentTarget.value)).then(() => {
      setRefreshKey((oldKey) => oldKey + 1);
    });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('comments', value)).then((res) => {
        setComments(res.data);
        Inertia.reload(commentCount);
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
  const renderUserSuggestionEdit = (index) => {
    <>{index}</>;
  };

  const comment = comments.map((comment, index) => (
    <div className="flow-root" key={index}>
      {((comment.status == 'rejected' || comment.status == 'pending') && comment.user.id == auth.user.id) ||
      comment.status == 'approved' ||
      comment.status == 'not_required' ? (
        <ul className="">
          <li className="py-3 sm:py-4">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {comment.user &&
                  (comment.user.media[0] ? (
                    <Avatar
                      alt="..."
                      src={comment.user.media[0].original_url}
                      className="object-cover rounded-full h-8 w-8 flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {comment.user.first_name.charAt(0)}
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
              </div>

              <div className="relative flex flex-col w-full">
                {comment.user && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">{`${comment.user.first_name} ${comment.user.last_name}`}</p>
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
                {comment.admin && (
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">
                      {`${comment.admin.first_name} ${comment.admin.last_name}`}
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
                <p className=" text-sm text-gray-500 overflow-visible mt-1 ">
                  {editingId == comment.id ? (
                    <>
                      <div className="whitespace-pre-line">
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
                                props && props.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
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
                      {comment.user &&
                        comment.user.id == auth.user.id &&
                        comment.teacher_id == 0 &&
                        (comment.status == 'pending' ? (
                          <span className="bg-yellow-200 hover:bg-yellow-600 hover:text-white duration-300 text-yellow-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(comment, e)}
                            >
                              <AccessTimeIcon className="py-1half" /> Notes +
                            </Link>
                          </span>
                        ) : comment.status == 'approved' ? (
                          <span className="bg-green-200 hover:bg-green-600 hover:text-white duration-300 text-green-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(comment, e)}
                            >
                              <DoneIcon className="py-1half" /> Notes +
                            </Link>
                          </span>
                        ) : (
                          <span className="bg-red-200 hover:bg-red-600 hover:text-white duration-300 text-red-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(comment, e)}
                            >
                              <ThumbDownOffAltIcon className="py-1half" /> Notes +
                            </Link>
                          </span>
                        ))}
                      <p className="relative break-words text-sm whitespace-pre-line bg-gray-100 p-3 rounded-lg">
                        <ReadMore>{comment.comment}</ReadMore>
                      </p>
                    </>
                  )}
                </p>
              </div>
              <div className="inline-flex items-start text-base font-semibold text-gray-900">
                {comment.user && auth.user.id == comment.user.id ? (
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
                          {(comment.status == 'pending' || comment.status == 'rejected') && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                 onClick={(e) => {
                                  handleClick(e, comment.comment);
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
                          )}
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
      ) : (
        ''
      )}
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
          ApiService.post(route('comment.store'), data)
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
                props && props.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
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

const AddPostAdminComment = ({ fetchRoute, commentCount, modulePanel, postId,value }) => {

  const { data, setData, reset } = useForm({
    comment: '',
    comment_1: '',
  });

  const [openCommentNotesModal, setOpenCommentNotesModal] = useState(false);
  const [selectedCommentForNotes, setSelectedCommentForNotes] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState(null);
  const { auth } = usePage().props;
  const [disable, setDisable] = useState(true);
  const [editingId, setEditingId] = useState(-1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errors, setErrors] = useState([]);
  const [update, setUpdate] = useState('');

  const getCommentNotes = (comment, e, notesName) => {
    e.preventDefault();
    setOpenCommentNotesModal(true);
    setSelectedCommentForNotes(comment);
    setName(notesName);
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
        backgroundColor: '#ededed',
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

  const defaultMentionStyle = {
    backgroundColor: '#a6c4f580',
    padding: '5px 0px',
  };
  const SaveComment = () => {
    setDisable(true);
      ApiService.post(route('admin.comment.store'), data)
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
    };


  const displayCommentNotes = (comment) => (
    <DisplayAdminCommentNotesInModal
      props={comment}
      name={name}
      setOpenCommentNotesModal={setOpenCommentNotesModal}
      fetchRoute={route('admin.comments.notes.posts.fetch', comment)}
      modulePanel="admin"
    />
  );
  function handleClick(event, comment) {
    setEditingId(event.currentTarget.value);
    setData({ comment_1: comment });
  }
  const handleChangeComment = (event) => {
    setDisable(false);
    setData({ comment: event.target.value });
  };

  const renderUserSuggestion = (index) => {
    <>{index}</>;
  };
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


  const handleSave = (e, comment) => {
    e.preventDefault();
    const formData = new FormData();
  
      formData.set('_method', 'PATCH');
      if (editingId == comment.id) {
        formData.set('comment_1', data.comment_1);
      }
      ApiService.post(route('admin.comment.update', comment.id), formData)
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
  };
  const fetchData = (event) => {
    ApiService.destroy(route('admin.comment.destroy', event.currentTarget.value)).then(() => {
      setRefreshKey((oldKey) => oldKey + 1);
    });
  };
  useEffect(() => {
    const fetchData = () => {
      ApiService.get(fetchRoute).then((res) => {
        setComments(res.data);
        Inertia.reload(commentCount);
      });
    };
    fetchData();
  }, [refreshKey]);

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
                value && value.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
              }
            />
          </MentionsInput>
          <input type="hidden" id="post_id" name="post_id" value={(data.post_id = postId)} />
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
      {comments.comments &&
        comments.comments.map((commentedBy, index) => (
          <ul className="" key={index}>
            <li className="py-3 sm:py-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {commentedBy.avatar && (
                    <>
                      <img src={commentedBy.avatar} alt={commentedBy.name} className="w-8 h-8 rounded-full" />
                    </>
                  )}
                  {commentedBy.avatar === false && (
                    <>
                      <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                        {commentedBy.name.charAt(0)}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col w-full">
                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm truncate">{commentedBy.name}</p>

                    <span className="text-gray-500 text-sm ml-1">
                      {new Date(commentedBy.comment.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>
                    {modulePanel === 'admin' && commentedBy.comment.status == 'pending' && (
                      <span className="ml-1 text-yellow-600 text-sm">Pending</span>
                    )}
                    {modulePanel === 'admin' && commentedBy.comment.status == 'approved' && (
                      <span className="ml-1 text-green-600 text-sm">Approved</span>
                    )}
                    {modulePanel === 'admin' && commentedBy.comment.status == 'rejected' && (
                      <span className="ml-1 text-red-600 text-sm">Rejected</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400 mt-1">
                    <>
                      {commentedBy.comment.teacher_id === 0 && commentedBy.comment.admin_id === 0 &&
                        (commentedBy.comment.status == 'pending' ? (
                          <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(commentedBy.comment.id, e, commentedBy.name)}
                            >
                              <HistoryToggleOffOutlinedIcon /> Notes +
                            </Link>
                          </span>
                        ) : commentedBy.status == 'approved' ? (
                          <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(commentedBy.comment.id, e, commentedBy.name)}
                            >
                              <HistoryToggleOffOutlinedIcon /> Notes +
                            </Link>
                          </span>
                        ) : (
                          <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-notes-inner right-0 ml-0 z-10">
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer"
                              onClick={(e) => getCommentNotes(commentedBy.comment.id, e, commentedBy.name)}
                            >
                              <HistoryToggleOffOutlinedIcon /> Notes +
                            </Link>
                          </span>
                        ))}
                    </>
                  </p> 
                  <p className="text-sm text-gray-500 mt-1 overflow-visible">
                    {editingId == commentedBy.comment.id ? (
                      <>
                        <div className="whitespace-pre-line">
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
                                value && value.map((student) => ({ id: student.id, display: student.first_name + student.last_name + " ",image: student.avatar_original }))
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
                          onClick={(e) => handleSave(e, commentedBy.comment)}
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
                          <ReadMore>{commentedBy.comment.comment}</ReadMore>
                        </p>
                      </>
                    )}
                  </p>
                </div>
                <div className="inline-flex items-start text-base font-semibold text-gray-900">
                  {commentedBy.comment.admin_id && auth.user.id == commentedBy.comment.admin_id ? (
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
                                    handleClick(e, commentedBy.comment.comment);
                                    }}
                                  value={commentedBy.comment.id}
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
                                  value={commentedBy.comment.id}
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
        ))}

      {comments.comments && !comments.comments.length ? (
        <div className="whitespace-pre-line mt-2 mb-2">No record Found</div>
      ) : (
        ''
      )}

      {openCommentNotesModal === true ? displayCommentNotes(selectedCommentForNotes) : null}
    </div>
  );
};

export { AddComment, AddCommentTeacher, AddPostAdminComment };
