import React, { Fragment, useState } from 'react';
import { Avatar, Checkbox } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import { AdminOwnPostExpand } from '@/Components/Expand';
import Authenticated from '@/Layouts/Authenticated';
import Images from '@/Components/Images';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import {AdminTeacherPostLikes} from '@/Components/AdminPostLikes';
import ApiService from '@/services/ApiService';
import { Inertia } from '@inertiajs/inertia';

export default function AdminProfile(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState();
 

  const callbackModal = () => {
    setIsPostOpen(false);
    setIsOpen(false);

  };

  React.useEffect(() => {
    document.title = 'Profile';
  }, []);


  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };
  const [selectedTeacherPostForLikes, setSelectedTeacherPostForLikes] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const fetchLikeData = (event) => {
    if(props.isFriday == true){
      ApiService.post(route('teacher.adminposts.likes', [event.target.value, event.target.checked]))
        .then(() => {
          Inertia.reload(props.rows);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  };

  const openLikePostModal = (post, e) => {
    e.preventDefault();
    setSelectedTeacherPostForLikes(post);
    setIsPostOpen(true);
  };

  const openPostLikeModal = (post) => (
    <AdminTeacherPostLikes post={post} closeModel={callbackModal} modulePanel="teacher" isFriday={props.isFriday}/>
  );

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'AdminProfile'}>
      <div className="flex flex-wrap mt-8 md:mt-12">
        <div className="w-full mb-12 px-0 md:px-4">
          <div className="relative  min-w-0 break-words mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="px-3 md:px-6 flex flex-col md:flex-row">
              <div className="">
                <div className="relative flex justify-center md:justify-end px-4 md:px-10">
                  <span className="flex items-center justify-center rounded-full -m-8">
                    {props.name.media[0] ? (
                      <img
                        src={props.name.media[0].original_url}
                        alt={`${props.name.first_name} ${props.name.last_name}`}
                        className="object-cover rounded-full w-12 md:w-20 h-12 md:h-20 flex items-center justify-center"
                      />
                    ) : (
                      <div className="w-12 md:w-20 h-12 md:h-20 relative flex justify-center items-center rounded-full text-3xl md:text-5xl text-white uppercase bg-yellow-500">
                        {props.name.first_name.charAt(0)}
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <div className=" text-start mt-2 md:mt-0 ml-0 md:ml-12 py-4 text-black">
                <h1 className="text-blue-500 text-lg font-semibold">
                  {props.name.first_name} {props.name.last_name}
                </h1>
                <>{props.name.email} </>
              </div>
            </div>
            <hr />
            <div className="relative flex-row items-start md:grid-cols-3 lg:grid grid-rows-auto p-3 bg-gray-200 rounded-lg border-0">
              {props.admin &&
                props.admin.map((post, index) => (
                  <>
                    <div
                      className="relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl"
                      key={index}
                    >
                      <div className="bg-blue-100 flex flex-row rounded-t">
                        <div className="px-2 py-3 mx-3 w-auto h-auto rounded-full">
                          {post.admin.media.length ? (
                            <img
                              alt="images"
                              className="w-12 h-12 object-cover rounded-full shadow"
                              src={post.admin.media[0].original_url}
                            />
                          ) : (
                            <Avatar className="bg-yellow-500 w-12 h-12 object-cover rounded-full shadow">
                              {post.admin.first_name.charAt(0)}
                            </Avatar>
                          )}
                        </div>
                        <div className="flex flex-col py-3">
                          <div className="flex text-black-600 text-sm font-bold">
                            <span className="flex-1 flex-shrink-0">{`${post.admin.first_name} ${post.admin.last_name}`}</span>
                          </div>
                          <div className="flex w-full mt-1">
                            <div className="text-blue-600 font-base text-sm mr-1"></div>
                            <div className="text-gray-500 text-sm">
                              {new Date(post.updated_at).toLocaleDateString('en-US', {
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

                      <div className="text-gray-500 text-sm mb-6 mx-3 px-2 mt-3">
                        <ReadMore>{post.content}</ReadMore>
                      </div>

                      <div className="text-gray-400 font-medium text-sm">
                        {post.media.length > 1 ? (
                          <div className="grid grid-cols-2">
                            {post.thumb_url.slice(0, 4).map((photo, index) => (
                              <>
                                <div className="relative custom-popup-hover">
                                  <div className="" key={index}>
                                    <button
                                      className='image-size-small w-full'
                                      onClick={() => {
                                        setIsOpen(true);
                                        setImgIndex(index);
                                        media(post.media);
                                      }}
                                    >
                                      <img src={photo} className="max-w-full h-auto" alt="" />
                                    </button>
                                  </div>
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
                              </>
                            ))}
                          </div>
                        ) : (
                          [
                            post.media.length ? (
                              <button
                                onClick={() => {
                                  setIsOpen(true);
                                  setImgIndex(0);
                                  media(post.media);
                                }}
                              >
                                <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                              </button>
                            ) : null,
                          ]
                        )}
                      </div>

                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">
                          {post.likes.length ? (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite className="fill-pink" />}
                              name="checkedH"
                              className="checked fill-pink"
                              checked={true}
                              onClick={fetchLikeData}
                            />
                          ) : (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite />}
                              name="checkedH"
                              className="checked"
                              checked={false}
                              onClick={fetchLikeData}
                            />
                          )}

                          {(post.likes_count == 1 && (
                            <button
                              onClick={(e) => openLikePostModal(post, e)}
                              className="hover:text-gray-400 text-black text-sm md:text-base"
                            >
                              {post.likes_count} like
                            </button>
                          )) ||
                            (post.likes_count > 1 && (
                              <button
                                onClick={(e) => openLikePostModal(post, e)}
                                className="hover:text-gray-400 text-black text-sm md:text-base"
                              >
                                {post.likes_count} likes
                              </button>
                            ))}
                          <AdminOwnPostExpand
                            postId={post.id}
                            value={props.students}
                            valueOne={post.comments_count}
                            modulePanel="teacher"
                            isFriday={props.isFriday}
                          >
                            {post.id}
                          </AdminOwnPostExpand>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
              {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
