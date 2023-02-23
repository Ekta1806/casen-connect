import React, { useEffect, useState } from 'react';
import 'sweetalert2/src/sweetalert2.scss';
import { usePage } from '@inertiajs/inertia-react';
import { Modal } from '@mui/material';

export default function DisplayClassPostCommentNotesInModal(props) {
  const post = props;
  const { auth } = usePage().props;
  const { fetchRoute } = props;
  const { setOpenClassPostCommentNotesModal } = props;
  const [allNotes, setAllNotes] = useState([]);
  const parse = require('html-react-parser');

  const closeNotesModal = (e) => {
    e.preventDefault();
    setOpenClassPostCommentNotesModal(false);
  };

  const getNotesForComment = () => {
    axios.get(fetchRoute).then((res) => {
      setAllNotes(res.data.notes);
    });
  };

  useEffect(() => getNotesForComment(post), []);

  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className="d-flex w-full justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl m-2">
          <div className="px-6 py-4 flex justify-between bg-white items-center">
            <h3 className="font-semibold">
              {' '}
              {props.modulePanel === 'student' && (
                <p>
                  Note from for
                  {`${auth.user.first_name} ${auth.user.last_name}`}
                </p>
              )}
              {props.modulePanel === 'teacher' && (
                <p>
                  Note from for {props.props.name}
                </p>
              )}
              {props.modulePanel === 'admin' && <p>Note for {props.props.name}</p>}
            </h3>
            <button
              onClick={(e) => closeNotesModal(e)}
              className="text-xl text-blueGray-900 border-0 border-none focus:outline-none"
            >
              &times;
            </button>
          </div>

          <div className="px-6 py-2 h-96 bg-gray-100 overflow-y-auto">
            {allNotes &&
              allNotes.map((note, index) =>
                  <div key={index} className="py-2 border-b border-gray-200">
                    <div className="flex">
                      <div className="my-2 text-sm ">
                        <div className="flex flex-col mb-2">
                          <span className="font-bold mr-1"> Content </span>
                          {note.comment && parse(note.comment)}
                        </div>
                        <span className="flex flex-col mb-2">
                          <span className="font-bold mr-1"> Notes</span>
                          {note.notes}
                        </span>
                        {note.status == 'rejected' ? (
                          <span className="text-sm text-red-500 right-0 bottom-0 mb-2">
                            {' '}
                            Rejected on{' '}
                            {new Date(note.created_at).toLocaleDateString('en-US', {
                              hour12: false,
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-green-500 right-0 bottom-0 mb-2">
                            {' '}
                            Approved on{' '}
                            {new Date(note.created_at).toLocaleDateString('en-US', {
                              hour12: false,
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              )}

            {allNotes.length === 0 && (
              <p className="text-center capitalize">No Notes Found for this Class Post Comment</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
