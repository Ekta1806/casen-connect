import React, { Fragment, useState } from 'react';
import ApiService from '@/services/ApiService';
import swal from 'sweetalert2';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Likes from '@/Modals/Likes';
import { Inertia } from '@inertiajs/inertia';
import ReadMore from '@/Components/ReadMore';
import { ClassExpand } from '@/Components/Expand';
import { usePage, Link } from '@inertiajs/inertia-react';
import 'react-quill/dist/quill.snow.css';
import { Avatar, CardHeader, Checkbox } from '@mui/material';
import Authenticated from '@/Layouts/Authenticated';
import Images from '@/Components/Images';

const Show = (props) => {

  React.useEffect(() => {
    document.title = 'notifications';
  }, [props]);

  const openLikeModal = (post) => {
    return <Likes post={post} closeModel={callbackModal} />;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);

  const callbackModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };
  const callIndex = (index) => {
    setImgIndex(index);
  };

  const media = (media) => {
    setMedia(media);
  };
  
  const { auth } = usePage().props;

  const fetchData = (event) => {
    ApiService.post(route('teacher.classPosts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props.rows);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  const deletePost = (e, post) => {
    e.preventDefault();

    swal
      .fire({
        title: 'Warning!',
        text: 'Are you sure you want to delete this class post? Data cannot be retrieved once deleted.',
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Yes! Delete',
        showDenyButton: true,
        denyButtonText: 'No! Cancel',
      })
      .then((chosenButton) => {
        if (chosenButton.isConfirmed) {
          axios.delete(route('teacher.classPosts.destroy', post.id)).then((response) => {
              swal.fire({
                title: 'Success !',
                text: response.data.message,
                icon: 'success',
              });
              window.history.back();
              setTimeout(() => {
                window.location.reload(false);
              }, 1500);
          });
        }
      });
  };

  return (
    <div>
      <Authenticated auth={props.auth} errors={props.errors} header={'ClassPost'}>
        {props.post_exits == true &&
          <div className="item-center m-6 mx-auto bg-white rounded-2xl shadow-md md:max-w-xl">
            <div className="p-1 rounded-t-md bg-white">
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
                      <Avatar>{props.student.first_name.charAt(0)}</Avatar>
                    )}
                    <Link href={route('members.profile', props.student.id)}>
                      <p className="ml-2 text-sm font-semibold capitalize">
                        {props.student.first_name + ' ' + props.student.last_name}{' '}
                        <span className="text-gray-500 text-sm">
                          {new Date(props.post.created_at).toLocaleDateString('en-US', {
                            hour12: false,
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </span>
                      </p>
                    </Link>
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
                          {props.post.status !== 'approved' && (
                            <Menu.Item>
                              <Link
                                href={route('teacher.classPosts.edit', props.post.id)}
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
                              onClick={(e) => deletePost(e, props.post)}
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
              <div className="ml-5">
                <ReadMore>{props.post.content}</ReadMore>
              </div>
            </div>
            
            {props.post.media.length > 1 ? (
              <div className="row">
                <div className="grid grid-cols-2">
                {props.post.thumb_url.slice(0, 4).map((photo, index) => (
                    // <img key={index} src={photo} className="w-full h-auto object-scale down" alt="" />
                    <>
                    <div className="relative custom-popup-hover" key={index}>
                      <button
                        className='image-size-small w-full'
                        onClick={() => {
                          setIsOpen(true);
                          setImgIndex(index);
                          media(props.post.media);
                        }}
                      >
                        <img src={photo} className="max-w-full h-auto" alt="" />
                      </button>
                      {index == 3 && props.post.media.length - 4 !== 0 && (
                      <div className="overlay">
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setImgIndex(index);
                            media(props.post.media);
                          }}
                          className="number"
                        >
                          {props.post.media.length - 4}+
                        </button>
                      </div>
                    )}
                    </div>
                  </>
                  ))}
                </div>
              </div>
            ) : (
              [
                props.post.media.length ? (
                  <div key={props.post.id} className="mb-4">
                    <img src={props.post.thumb_url[0]} className="w-full h-auto" alt="" />
                  </div>
                ) : null,
              ]
            )}
            <div className=" border-t-2 grid grid-rows-1 place-items-start h-auto">
              <div className="flex items-center flex-wrap p-0 w-full">
                {props.like > 0 ? (
                  <Checkbox
                    value={props.post.id}
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite className="fill-pink" />}
                    name="checkedH"
                    className="checked fill-pink"
                    checked={true}
                    onClick={fetchData}
                  />
                ) : (
                  <Checkbox
                    value={props.post.id}
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    name="checkedH"
                    className="checked"
                    checked={false}
                    onClick={fetchData}
                  />
                )}
                {(props.post.likes.length == 1 && <p>{props.post.likes.length} like</p>) ||
                  (props.post.likes.length > 1 && <p>{props.post.likes.length} likes</p>)}
                <ClassExpand
                  className=""
                  post={props.post}
                  fetchRoute={route('teacher.classPosts.fetchPendingComments', props.post.id)}
                  modulePanel="teacher"
                  modulePaneltwo="classPostComments"
                  value={props.students}
                  valueOne={props.post.comments.length}
                >
                  {props.post.id}
                </ClassExpand>
                {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
              </div>
            </div>
          </div>
        }
        {props.post_exits == false &&
          <>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">{props.message}</strong>
              <button
                className="px-4 py-1 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all float-right"
                onClick={back}
              >
                Back
            </button>
            </div>
          </>
        }
      </Authenticated>
    </div>
  );
};

export default Show;
