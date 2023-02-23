import React, { useEffect, useState } from 'react';
import 'sweetalert2/src/sweetalert2.scss';
import { Modal } from '@mui/material';

export default function DisplayAdminCommentNotesInModal(props) {
  const post = props;
  const { fetchRoute } = props;
  const parse = require('html-react-parser');
  const [allNotes, setAllNotes] = useState([]);
  const { modulePanel } = props;

  const getNotesForPost = () => {
    axios.get(fetchRoute).then((res) => {
      setAllNotes(res.data.notes);
    });
  };

  useEffect(() => getNotesForPost(post), []);
  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className="d-flex w-full justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl m-2">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="px-6 py-4 flex justify-between bg-white items-center">
              <h3 className="font-semibold">{modulePanel == 'admin' && <p>Note for {props.name}</p>}</h3>
              <button
                onClick={() => props.setOpenCommentNotesModal()}
                className="text-xl text-blueGray-900 border-0 border-none focus:outline-none"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-0 pb-4 h-96 bg-gray-100 overflow-y-auto">
              {allNotes.length > 0 &&
                allNotes.map((note, index) => (
                  <div key={index} className="whitespace-pre-line py-4 my-1 border-b border-gray-200 relative">
                    <div className="flex">
                      <div className="ml-2 flex-col items-center">
                        <div className="my-2 text-sm">
                          <span className="flex flex-col mb-2">
                            <span className="font-bold mr-1"> Content</span>
                            {note.comment && parse(note.comment)}
                          </span>
                          <span className="flex flex-col mb-2">
                            <span className="font-bold mr-1"> Notes</span>
                            {note.notes}
                          </span>
                          {note.status == 'rejected' ? (
                            <span className="text-sm text-red-400">
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
                            <p className="text-sm text-green-600">
                              {' '}
                              Approved on{' '}
                              {new Date(note.created_at).toLocaleDateString('en-US', {
                                hour12: false,
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minutes: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {allNotes.length === 0 && <p className="text-center capitalize mt-10">No Notes Found for this Comment</p>}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
