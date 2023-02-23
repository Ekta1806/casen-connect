import React, { Fragment, useState } from 'react';
import { Avatar, CardHeader, Checkbox } from '@mui/material';
import 'sweetalert2/src/sweetalert2.scss';
import ReadMore from '@/Components/ReadMore';
import 'react-quill/dist/quill.snow.css';
import { AdminOwnPostExpand } from '@/Components/Expand';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ApiService from '@/services/ApiService';
import { Inertia } from '@inertiajs/inertia';
import Authenticated from '@/Layouts/Authenticated';
import { AdminPostLikes } from '@/Components/AdminPostLikes';
import Images from '@/Components/Images';
import 'react-image-lightbox/style.css';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const AdminPostShow = (props) => {
  React.useEffect(() => {
    document.title = 'notifications';
  }, [props]);
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);

  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const fetchLikeData = (event) => {
    ApiService.post(route('admin.adminposts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const openPostLikeModal = (post) => (
    <AdminPostLikes post={post} closeModel={callbackModal} modulePanel="admin" />
  );

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
        axios.delete(route('admin.adminposts.destroy', post.id)).then((response) => {
          Swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          Inertia.reload({ props });
        });
      }
    });
  };

  return (
    <div>
      <Authenticated auth={props.auth} errors={props.errors} header={'Admin Post'}>
        <div className="item-center m-6 mx-auto bg-white rounded-2xl shadow-md md:max-w-xl">
          <div className="p-1 rounded-t-md bg-purple-200">
            <CardHeader
              avatar={
                <span className="relative flex items-center no-underline w-18 h-12 rounded-full bg-purple-200">
                  {props.auth.profilePicture ? (
                    <Avatar
                      alt="Placeholder"
                      className="bg-yellow-500 w-12 h-12 block rounded-full"
                      src={props.auth.profilePicture}
                    />
                  ) : (
                    <Avatar className="bg-yellow-500">{props.auth.user.first_name.charAt(0)}</Avatar>
                  )}

                  <div className="flex flex-wrap flex-col lg:flex-row items-start justify-start">
                    <p className="ml-2 text-sm font-semibold capitalize">
                      {`${props.auth.user.first_name} ${props.auth.user.last_name}`}{' '}
                    </p>
                    <div className="ml-2 text-gray-500 text-sm">
                      {new Date(props.posts.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </div>
                  </div>
                </span>
              }
              action={
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
                        {props.posts.status !== 'approved' && (
                          <Menu.Item>
                            <Link
                              href={route('admin.adminposts.edit', props.posts.id)}
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
                            onClick={(e) => deletePost(e, props.posts)}
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
              }
            />
          </div>
          <div className="p-3">
            <ReadMore>{props.posts.content}</ReadMore>
          </div>

          <div className="">
            {props.posts.media.length > 1 ? (
              <>
                <div className="grid grid-cols-2">
                  {props.posts.thumb_url.slice(0, 4).map((photo, index) => (
                    <>
                      <div className="relative custom-popup-hover" key={index}>
                        <button
                          className='image-size-small w-full'
                          onClick={() => {
                            setIsOpen(true);
                            setImgIndex(index);
                            media(props.posts.media);
                          }}
                        >
                          <img src={photo} className="max-w-full h-auto" alt="" />
                        </button>
                        {index == 3 && props.posts.media.length - 4 !== 0 && (
                        <div className="overlay">
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setImgIndex(index);
                              media(props.posts.media);
                            }}
                            className="number"
                          >
                            {props.posts.media.length - 4}+
                          </button>
                        </div>
                      )}
                      </div>
                    </>
                  ))}
                </div>
              </>
            ) : (
              [
                props.posts.media.length ? (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setImgIndex(0);
                        media(props.posts.media);
                      }}
                    >
                      <img src={props.posts.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                    </button>
                  </div>
                ) : null,
              ]
            )}
          </div>
          <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
            <div className="flex items-center flex-wrap p-0 w-full">
              {props.posts.likes.length ? (
                <Checkbox
                  value={props.posts.id}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite className="fill-pink" />}
                  name="checkedH"
                  className="checked fill-pink"
                  checked={true}  
                  onClick={fetchLikeData}
                />
              ) : (
                <Checkbox
                  value={props.posts.id}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  name="checkedH"
                  className="checked"
                  checked={false}
                  onClick={fetchLikeData}
                />
              )}

              {(props.posts.likes_count == 1 && (
                <button
                  onClick={(e) => openLikePostModal(props.posts, e)}
                  className="hover:text-gray-400 text-black text-sm md:text-base"
                >
                  {props.posts.likes_count} like
                </button>
              )) ||
                (props.posts.likes_count > 1 && (
                  <button
                    onClick={(e) => openLikePostModal(props.posts, e)}
                    className="hover:text-gray-400 text-black text-sm md:text-base"
                  >
                    {props.posts.likes_count} likes
                  </button>
                ))}
              <AdminOwnPostExpand
                postId={props.posts.id}
                value={props.students}
                valueOne={props.posts.comments_count}
                modulePanel="admin"
                isFriday=""
              >
                {props.posts.id}
              </AdminOwnPostExpand>
            </div>
          </div>
          {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
          {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
        </div>
      </Authenticated>
    </div>
  );
};

export default AdminPostShow;
