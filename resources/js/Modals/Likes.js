import React, { useEffect, useState } from 'react';
import { Avatar, Modal } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';

export default function Likes(props) {
  const  allLikes  = props.post;
  return (
    <>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div className="d-flex w-full justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl m-2">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t bg-white">
                <h3 className="text-black-800 text-xl font-bold">Likes</h3>
                <div className="flex items-center justify-end border-solid border-blueGray-200 rounded-b">
                  <button
                    onClick={() => props.closeModel()}
                    className="text-xl text-blueGray-900 border-0 border-none focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="px-6 py-0 pb-4 h-96 bg-gray-100 overflow-y-auto">
                {allLikes.length > 0 &&
                  allLikes.map((likedBy, index) => (
                    <div key={index} className="whitespace-pre-line py-4 my-1 border-b border-gray-200 relative">
                      <div className="flex items-center">
                        {likedBy.type === 'student' && 
                          <>
                            {likedBy.avatar === false && (
                              <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                                <Avatar className="bg-yellow-500">{likedBy.name.charAt(0)}</Avatar>
                              </div>
                            )}

                            {likedBy.avatar !== false && (
                              <img src={likedBy.avatar} alt={likedBy.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div className="ml-2">
                              <Link
                                href={route('members.profile', likedBy.id)}
                                className="ml-2 hover:text-gray-900 focus:text-gray-900"
                              >
                                {likedBy.name}
                              </Link>
                            </div>
                          </>
                        } 
                        {likedBy.type === 'teacher' && 
                          <>
                            {likedBy.avatar === false && (
                              <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                                <Avatar className="bg-yellow-500">{likedBy.name.charAt(0)}</Avatar>
                              </div>
                            )}

                            {likedBy.avatar !== false && (
                              <img src={likedBy.avatar} alt={likedBy.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div className="ml-2">
                              <Link
                                href={route('teacher.profile', likedBy.id)}
                                className="ml-2 hover:text-gray-900 focus:text-gray-900"
                              >
                                {likedBy.name}
                              </Link>
                            </div>
                          </>
                        }
                        {likedBy.type === 'admin' && 
                          <>
                            {likedBy.avatar === false && (
                              <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                                <Avatar className="bg-yellow-500">{likedBy.name.charAt(0)}</Avatar>
                              </div>
                            )}

                            {likedBy.avatar !== false && (
                              <img src={likedBy.avatar} alt={likedBy.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div className="ml-2">
                              <Link
                                href={route('admin.profile', likedBy.id)}
                                className="ml-2 hover:text-gray-900 focus:text-gray-900"
                              >
                                {likedBy.name}
                              </Link>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  ))}
                {allLikes.length === 0 && (
                  <div className="flex justify-center items-center mt-10">
                    <div
                      className="border-4 animate-spin h-8 w-8 mr-3"
                      role="status"
                    >
                      <span className="visually-hidden"></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
