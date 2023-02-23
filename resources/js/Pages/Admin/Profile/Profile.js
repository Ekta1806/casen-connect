import React, { Fragment, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { usePage } from '@inertiajs/inertia-react';
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { AdminExpand } from '@/Components/Expand';

export default function Profile(props) {
  React.useEffect(() => {
    document.title = 'Profile';
  }, []);

  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [modalName, setModalName] = useState(null);
  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('admin.posts.likes.fetch', [post.id, modalName])}
      modulePanel="admin"
    />
  );
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);

  const openModal = (post, e, params) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setOpenLikesModal(true);
    setModalName(params);
  };

  const { auth } = usePage().props;

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Profile'}>
      <div className="flex flex-wrap mt-8 md:mt-12">
        <div className="w-full mb-12 px-0 md:px-4">
          <div className="relative  min-w-0 break-words mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="px-3 md:px-6 flex flex-col md:flex-row">
              <div className="">
                <div className="relative flex justify-center md:justify-end px-4 md:px-10">
                  <span className="flex items-center justify-center rounded-full -m-8">
                    {props.student.media[0] ? (
                      <img
                        src={props.student.media[0].original_url}
                        alt={`${props.student.first_name} ${props.student.last_name}`}
                        className="object-cover rounded-full w-12 md:w-20 h-12 md:h-20 flex items-center justify-center"
                      />
                    ) : (
                      <div className="w-12 md:w-20 h-12 md:h-20 relative flex justify-center items-center rounded-full text-3xl md:text-5xl text-white uppercase bg-yellow-500">
                        {props.student.first_name.charAt(0)}
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <div className=" text-start mt-2 md:mt-0 ml-0 md:ml-12 py-4 text-black">
                <h1 className="text-blue-500 text-lg font-semibold">
                  {props.student.first_name} {props.student.last_name}
                </h1>
                <>
                  <div className="mb-1">{props.student.email}</div>{' '}
                </>
                <span className="">
                  {(props.student.posts.length == 1 && <p>{props.student.posts.length} post</p>) ||
                    (props.student.posts.length == 0 && <p>{props.student.posts.length} Posts</p>) ||
                    (props.student.posts.length > 1 && <p>{props.student.posts.length} posts</p>)}
                </span>
              </div>
            </div>
            <hr />
            <div className="relative flex-row items-start md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4 p-3 bg-gray-200 rounded-lg border-0">
              {props.student.level_id == 5 && props.student.is_private == 1 && props.student.id !== auth.user.id ? (
                <p className="text-black text-lg m-2">
                  {' '}
                  <LockOutlinedIcon className="mb-1 text-gray-700" />
                  This account is Private
                </p>
              ) : props.student.posts.length ? (
                props.student.posts.map((post, index) =>
                  ((post.status == 'pending' || 'rejected') && props.student.id == auth.user.id) ||
                  post.status == 'approved' ? (
                    <div
                      className={`relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl ${
                        post.media.length ? 'row-span-3' : 'row-span-1'
                      }`}
                      key={index}
                    >
                      <CardHeader
                        avatar={
                          <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
                            {props.student.media[0] ? (
                              <Avatar
                                alt="Placeholder"
                                className="bg-yellow-500 w-12 h-12 block rounded-full"
                                src={props.student.media[0].original_url}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500">{props.student.first_name.charAt(0)}</Avatar>
                            )}
                            <p className="ml-2 text-sm font-semibold capitalize">
                              {`${props.student.first_name} ${props.student.last_name}`}{' '}
                              <span className="text-gray-500 text-sm">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </span>
                            </p>
                            {props.student.id == auth.user.id &&
                              (post.status == 'pending' ? (
                                <span className="bg-yellow-100  text-yellow-500 capitalize text-sm rounded-full p-1 absolute -top-3 right-6 ml-0">
                                  <AccessTimeIcon className="" />
                                </span>
                              ) : post.status == 'approved' ? (
                                <span className="bg-green-100  text-green-500 capitalize text-sm rounded-full p-1 absolute -top-3 right-6 ml-0">
                                  <DoneIcon />
                                </span>
                              ) : (
                                <span className="bg-red-100  text-red-500 text-sm rounded-full p-1 absolute -top-3 right-6 ml-0">
                                  <ThumbDownOffAltIcon />
                                </span>
                              ))}
                          </span>
                        }
                      />
                      <div className="p-3">
                        <ReadMore>{post.desc}</ReadMore>
                      </div>
                      <div className="">
                        {post.media.length > 1 ? (
                          <div className="overflow-y-auto h-96  grid-cols-3 items-center">
                            {post.thumb_url.map((photo, index) => (
                              <div key={index} className="">
                                <img src={photo} className="max-w-full h-auto" alt="" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          [
                            post.media.length ? (
                              <div key={index} className="mb-4">
                                <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                              </div>
                            ) : null,
                          ]
                        )}
                      </div>
                    
                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">
                          {post.likes.length >= 0 ? (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite className="fill-pink" />}
                              name="checkedH"
                              className="checked fill-pink"
                              checked={true}
                            />
                          ) : (
                            <Checkbox
                              value={post.id}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite />}
                              name="checkedH"
                              className="checked"
                              checked={false}
                            />
                          )}
                          {(post.likes_count == 1 && (
                            <button
                              onClick={(e) => openModal(post, e, 'post')}
                              className="hover:text-gray-400 text-black text-sm md:text-base"
                            >
                              {post.likes_count} like
                            </button>
                          )) ||
                            (post.likes_count > 1 && (
                              <button
                                onClick={(e) => openModal(post, e, 'post')}
                                className="hover:text-gray-400 text-black text-sm md:text-base"
                              >
                                {post.likes_count} likes
                              </button>
                            ))}
                          <AdminExpand
                            className=""
                            fetchRoute={route('admin.posts.comments.fetch', post.id)}
                            valueOne={post.comments.length}
                            modulePanel="admin"
                          >
                            {post.id}
                          </AdminExpand>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  ),
                )
              ) : (
                <p className="text-black m-2 text-lg">No posts yet</p>
              )}
              {openLikesModal ? displayLikesInModal(selectedPostForLikes) : null}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
