
import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CardHeader, Avatar } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import { LikeButton } from '@/Components/LikeButton';
import { Link, usePage } from '@inertiajs/inertia-react';
import deleteRecord from '@/delete/delete';
import { Expand } from '@/Components/Expand';
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Index from '../Dashboard/Index';
import Images from '@/Components/Images';

export default function Profile(props) {

  const [allMedia, setMedia] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    document.title = 'Profile';
  }, []);


  const callbackModal = () => {
    setIsOpen(false);
  };

  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };
  const { auth } = usePage().props;

  return (
    <Index header={'Profile'}>
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
              <div className="text-start mt-2 md:mt-0 ml-0 md:ml-4 py-4 text-black">
                <h1 className="text-blue-500 text-lg font-semibold">
                  {props.student.first_name} {props.student.last_name}
                </h1>
                <>
                  <div className="mb-1">{props.student.email} </div>
                </>
                <span className="">
                  {(props.student.posts.length == 1 && <p>{props.student.posts.length} post</p>) ||
                    (props.student.posts.length == 0 && <p>{props.student.posts.length} Posts</p>) ||
                    (props.student.posts.length > 1 && <p>{props.student.posts.length} posts</p>)}
                </span>
              </div>
            </div>
            <hr />

            <ul className="relative flex-row items-start pt-6 bg-gray-200 rounded-lg border-0 imageList">
              {props.student.level_id == 5 && props.student.is_private == 1 && props.student.id !== auth.user.id ? (
                <p className="text-black text-lg m-2">
                  <LockOutlinedIcon className="mb-1 text-gray-700" />
                  This account is Private
                </p>
              ) : (
                props.student.posts.map((post, index) =>
                  ((post.status == 'pending' || 'rejected') && props.student.id == auth.user.id) ||
                  post.status == 'approved' ? (
                    <li className="profile mb-6" key={index}>
                      <div
                        className={'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl '}
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

                              <div className="flex flex-wrap flex-col xxl:flex-row items-start justify-start">
                                <Link className="" href={route('members.profile', props.student.id)}>
                                  <p className="ml-2 text-sm font-semibold capitalize">{`${props.student.first_name} ${props.student.last_name}`}</p>
                                </Link>
                                <span className="ml-2 text-gray-500 text-sm">
                                  {' '}
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
                          action={
                            props.student.id == auth.user.id && (
                              <Menu as="div" className="relative inline-block">
                                <div className="">
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
                                      {post.status !== 'approved' && (
                                        <Menu.Item>
                                          <Link
                                            href={route('post.edit', [post.id, 'profile'])}
                                            params="profile"
                                            method="get"
                                            className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                                          >
                                            Edit
                                          </Link>
                                        </Menu.Item>
                                      )}
                                      <Menu.Item>
                                        <Link
                                          href=""
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
                        <div className="p-3">
                          <ReadMore>{post.desc}</ReadMore>
                        </div>
                        <div className="">
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
                            <LikeButton props={post.id} />
                            {console.log(props)}
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
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    ''
                  ),
                )
              )}

              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
            </ul>
            {props.student.posts.length === 0 && (
              <p className="text-black text-center py-4 bg-gray-200 text-lg">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </Index>
  );
}
