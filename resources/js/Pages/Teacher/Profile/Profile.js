import React, { Fragment, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import { ClassExpand } from '@/Components/Expand';
import ApiService from '@/services/ApiService';
import TeacherClassPostLikes from '@/Components/TeacherClassPostLikes';
import Images from '@/Components/Images';

export default function Profile(props) {
  const fetchLikeData = (event) => {
    ApiService.post(route('teacher.classPosts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [allMedia, setMedia] = useState();
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedTeacherPostForLikes, setSelectedTeacherPostForLikes] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const callbackModal = () => {
    setIsPostOpen(false);
    setIsOpen(false);
  };
  const openLikePostModal = (post, e) => {
    e.preventDefault();
    setSelectedTeacherPostForLikes(post);
    setIsPostOpen(true);
  };

  React.useEffect(() => {
    document.title = 'Profile';
  }, []);
  const openPostLikeModal = (post) => (
    <TeacherClassPostLikes post={post} closeModel={callbackModal} modulePanel="teacher" />
  );

  const [allStudents, setAllStudents] = useState([]);
  const { auth } = usePage().props;

  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };


  const deletePost = (e, post) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this class post? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('teacher.classPosts.destroy', post.id)).then((response) => {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });

          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        });
      }
    });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Profiles'}>
      <div className="flex flex-wrap mt-8 md:mt-12">
        <div className="w-full mb-12 px-0 md:px-4">
          <div className="relative  min-w-0 break-words mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="px-3 md:px-6 flex flex-col md:flex-row">
              <div className="">
                <div className="relative flex justify-center md:justify-end px-4 md:px-10">
                  <span className="flex items-center justify-center rounded-full -m-8">
                    {props.teacher.media[0] ? (
                      <img
                        src={props.teacher.media[0].original_url}
                        alt={`${props.teacher.first_name} ${props.teacher.last_name}`}
                        className="object-cover rounded-full w-12 md:w-20 h-12 md:h-20 flex items-center justify-center"
                      />
                    ) : (
                      <div className="w-12 md:w-20 h-12 md:h-20 relative flex justify-center items-center rounded-full text-3xl md:text-5xl text-white uppercase bg-yellow-500">
                        {props.teacher.first_name.charAt(0)}
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <div className=" text-start mt-2 md:mt-0 ml-0 md:ml-4 py-4 text-black">
                <h1 className="text-blue-500 text-lg font-semibold">
                  {props.teacher.first_name} {props.teacher.last_name}
                </h1>
                <>
                  <div className="mb-1">{props.teacher.email}</div>{' '}
                </>
                <span className="">
                  {(props.teacher.class_posts.length == 1 && <p>{props.teacher.class_posts.length} post</p>) ||
                    (props.teacher.class_posts.length == 0 && <p>{props.teacher.class_posts.length} Posts</p>) ||
                    (props.teacher.class_posts.length > 1 && <p>{props.teacher.class_posts.length} Posts</p>)}
                </span>
              </div>
            </div>
            <hr />
            <div className="relative flex-row items-start md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4 p-3 bg-gray-200 rounded-lg border-0">
              {props.teacher.level_id == 5 && props.teacher.is_private == 1 && props.teacher.id !== auth.user.id ? (
                <p className="text-black text-lg m-2">
                  {' '}
                  <LockOutlinedIcon className="mb-1 text-gray-700" />
                  This account is Private
                </p>
              ) : props.teacher.class_posts.length ? (
                props.teacher.class_posts.map((post, index) =>
                  props.teacher.id == auth.user.id ? (
                    <div
                      className={'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl '}
                      key={index}
                    >
                      <CardHeader
                        avatar={
                          <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
                            {props.teacher.media[0] ? (
                              <Avatar
                                alt="Placeholder"
                                className="bg-yellow-500 w-12 h-12 block rounded-full"
                                src={props.teacher.media[0].original_url}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500">{props.teacher.first_name.charAt(0)}</Avatar>
                            )}

                            <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                              <p className="ml-1 text-sm font-semibold capitalize">{`${props.teacher.first_name} ${props.teacher.last_name}`}</p>
                              <p className="ml-1 text-sm font-semibold capitalize">
                                {' '}
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
                            </div>
                          </span>
                        }
                        action={
                          props.teacher.id == auth.user.id && (
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
                                          href={route('teacher.classPosts.edit', post.id)}
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
                                        onClick={(e) => deletePost(e, post)}
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
                        <ReadMore>{post.content}</ReadMore>
                      </div>
                      <div className="">
                        {post.media.length > 1 ? (
                          <div className="grid grid-cols-2">
                            {post.thumb_url.slice(0, 4).map((photo, index) => (
                              <>
                                <div className="relative custom-popup-hover">
                                  <div className="" key={index}>
                                    <button className='image-size-small w-full'
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
                          <ClassExpand
                            className=""
                            post={post}
                            fetchRoute={route('teacher.classPosts.fetchPendingComments', post.id)}
                            modulePanel="teacher"
                            modulePaneltwo="classPostComments"
                            value={allStudents}
                            valueOne={post.comments_count}
                          >
                            {post.id}
                          </ClassExpand>
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
              {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
