import { Link } from '@inertiajs/inertia-react';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import DisplayCommentNotesInModal from '@/Modals/DisplayCommentNotesInModal';
import DisplayClassPostCommentNotesInModal from '@/Modals/DisplayClassPostCommentNotesInModal';

export default function DisplayCommentsInModal(props) {
  const { post } = props;
  const { fetchRoute } = props;
  const { modulePanel } = props;
  const { modulePaneltwo } = props;
  const setOpenCommentsModal = props.setOpenCommentsModal ? props.setOpenCommentsModal : '';
  const setOpenClassPostCommentsModal = props.setOpenClassPostCommentsModal ? props.setOpenClassPostCommentsModal : '';
  const [allComments, setAllComments] = useState([]);

  const refDiv = useRef(null);

  const handleClose = () => {
    props.setOpenCommentsModal && setOpenCommentsModal(false);
    props.setOpenClassPostCommentsModal && setOpenClassPostCommentsModal(false);
  };

  const closeCommentsModal = (e) => {
    e.preventDefault();
    props.setOpenCommentsModal && setOpenCommentsModal(false);
    props.setOpenClassPostCommentsModal && setOpenClassPostCommentsModal(false);
  };

  const getCommentsForPost = () => {
    axios.get(fetchRoute).then((res) => {
      setAllComments(res.data.comments);
    });
  };

  useEffect(() => getCommentsForPost(post), []);

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

              setRefreshKey((oldKey) => oldKey + 1);
          });
      }
    })();
  };

  const approveRejectClassPostsComment = (e, commentId, status) => {
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
      modulePanel="teacher"
      modulePaneltwo="classPostComments"
    />
  );

  const [openClassPostCommentNotesModal, setOpenClassPostCommentNotesModal] = useState(false);
  const [selectedClassPostCommentForNotes, setSelectedClassPostCommentForNotes] = useState(null);
  const getClassPostCommentNotes = (comment, e) => {
    e.preventDefault();
    setOpenClassPostCommentNotesModal(true);
    setSelectedClassPostCommentForNotes(comment);
  };
  const displayClassPostCommentNotes = (comment) => (
    <DisplayClassPostCommentNotesInModal
      props={comment}
      setOpenClassPostCommentNotesModal={setOpenClassPostCommentNotesModal}
      fetchRoute={route('teacher.classposts.comments.notes', comment.commentId)}
      modulePanel="teacher"
    />
  );

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleClose}>
        <div ref={refDiv} className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl m-2">
              <div className="px-6 py-4 flex justify-between bg-white items-center">
                <h3 className="font-semibold">Comments By students</h3>

                <button
                  onClick={(e) => closeCommentsModal(e)}
                  className="text-xl text-blueGray-900 border-0 border-none focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <div className="px-6 py-0 pb-4 h-96 bg-gray-100 overflow-y-auto">
                {allComments.length > 0 &&
                  allComments.map((commentedBy, index) => (
                    <div key={index} className="whitespace-pre-line py-4 my-1 border-b border-gray-200 relative">
                      <div className="flex">
                        <div>
                          {commentedBy.avatar === false && (
                            <div className="w-8 h-8 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                              {commentedBy.name.charAt(0)}
                            </div>
                          )}

                          {commentedBy.avatar !== false && (
                            <img src={commentedBy.avatar} alt={commentedBy.name} className="w-8 h-8 rounded-full" />
                          )}
                        </div>

                        <div className="ml-2 flex-col items-center">
                          <Link
                            href={route(`${modulePanel}.students.show`, commentedBy.id)}
                            className="text-blueGray-700 font-semibold hover:text-gray-900 focus:text-gray-900"
                          >
                            {commentedBy.name}
                          </Link>
                          <span className="text-gray-500 text-sm">
                            {' '}
                            {new Date(commentedBy.created_at).toLocaleDateString('en-US', {
                              hour12: false,
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </span>

                          {modulePaneltwo != 'classPostComments' && (
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer ml-2"
                              onClick={(e) => getCommentNotes(commentedBy, e)}
                            >
                              <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute top-0 right-0 ml-0">
                                <HistoryToggleOffOutlinedIcon /> Notes +
                              </span>
                            </Link>
                          )}

                          {modulePaneltwo === 'classPostComments' && (
                            <Link
                              href="#"
                              className="focus:outline-none hover:cursor-pointer ml-2"
                              onClick={(e) => getClassPostCommentNotes(commentedBy, e)}
                            >
                              <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute top-0 right-0 ml-0">
                                <HistoryToggleOffOutlinedIcon /> Notes +
                              </span>
                            </Link>
                          )}

                          <div className="text-sm text-gray-600">{commentedBy.comment}</div>
                        </div>
                      </div>

                      {modulePanel === 'teacher' &&
                        modulePaneltwo != 'classPostComments' &&
                        (commentedBy.status == null || commentedBy.status == 'pending') && (
                          <div className="ml-10 mt-2 text-sm">
                            <Link
                              className="p-1 px-2 font-semibold text-green-600 bg-green-200 rounded-full border border-transparent hover:bg-green-600 hover:text-white"
                              href="#"
                              onClick={(e) => approveRejectComment(e, commentedBy.commentId, 'approved')}
                              as="button"
                              method="patch"
                            >
                              {' '}
                              Approve
                            </Link>
                            <Link
                              className="p-1 px-2 ml-2  text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white"
                              href="#"
                              onClick={(e) => approveRejectComment(e, commentedBy.commentId, 'rejected')}
                              as="button"
                              method="patch"
                            >
                              {' '}
                              Reject
                            </Link>
                          </div>
                        )}

                      {modulePanel === 'teacher' &&
                        modulePaneltwo != 'classPostComments' &&
                        commentedBy.status == 'approved' && <span className="ml-10 text-green-600">Approved</span>}

                      {modulePanel === 'teacher' &&
                        modulePaneltwo != 'classPostComments' &&
                        commentedBy.status == 'rejected' && <span className="ml-10 text-red-600">Rejected</span>}

                      {modulePanel === 'teacher' &&
                        modulePaneltwo === 'classPostComments' &&
                        (commentedBy.status == null || commentedBy.status == 'pending') && (
                          <div className="ml-10 mt-2 text-sm">
                            <Link
                              className="p-1 px-2 font-semibold text-green-600 bg-green-200 rounded-full border border-transparent hover:bg-green-600 hover:text-white"
                              href="#"
                              onClick={(e) => approveRejectClassPostsComment(e, commentedBy.commentId, 'approved')}
                              as="button"
                              method="patch"
                            >
                              {' '}
                              Approve
                            </Link>
                            <Link
                              className="p-1 px-2 ml-2 text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white"
                              href="#"
                              onClick={(e) => approveRejectClassPostsComment(e, commentedBy.commentId, 'rejected')}
                              as="button"
                              method="patch"
                            >
                              {' '}
                              Reject
                            </Link>
                          </div>
                        )}

                      {modulePanel === 'teacher' &&
                        modulePaneltwo === 'classPostComments' &&
                        commentedBy.status == 'approved' && <span className="ml-10 text-green-600">Approved</span>}

                      {modulePanel === 'teacher' &&
                        modulePaneltwo === 'classPostComments' &&
                        commentedBy.status == 'rejected' && <span className="ml-10 text-red-600">Rejected</span>}
                    </div>
                  ))}

                {allComments.length === 0 && <p className="text-center mt-10">This post has not comments yet.</p>}
                {openCommentNotesModal === true ? displayCommentNotes(selectedCommentForNotes) : null}
                {openClassPostCommentNotesModal === true
                  ? displayClassPostCommentNotes(selectedClassPostCommentForNotes)
                  : null}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
