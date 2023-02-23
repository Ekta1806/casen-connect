import React, { Fragment, useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Avatar, CardHeader } from '@mui/material';
import { Menu, Transition } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import ReadMore from '@/Components/ReadMore';
import { Expand } from '@/Components/Expand';
import 'react-quill/dist/quill.snow.css';
import Index from '../Dashboard/Index';
import Likes from '@/Modals/Likes';
import { LikeButton } from '@/Components/LikeButton';

const Show = (props) => {
  React.useEffect(() => {
    document.title = 'notifications';
  }, [props]);

  const openLikeModal = (post) => <Likes post={post} closeModel={callbackModal} />;

  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setShowModal(true);
  };

  const callbackModal = () => {
    setShowModal(false);
  };

  const { auth } = usePage().props;

  const deletePost = (e, action) => {
    e.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to revert this!',
      target: '#custom-target',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'position-absolute',
      },
      toast: true,
      position: 'bottom-center',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(action).then((response) => {
          if (response.status == 200) {
            Swal.fire({
              title: 'Success !',
              text: response.data,
              icon: 'success',
            });
            window.history.back();
            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
          }
        });
      }
    });
  };
  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div>
      <Index header={'Notifications'}>
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
                      {`${props.student.first_name} ${props.student.last_name}`}
                      <span className="text-gray-500 text-sm ml-1">
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

                  {props.student.id == auth.user.id &&
                    (props.post.status == 'pending' ? (
                      <p className="ml-3  px-2 py-1 bg-yellow-100 rounded-full text-sm text-yellow-500 capitalize">
                        {props.post.status}
                      </p>
                    ) : props.post.status == 'approved' ? (
                      <p className="ml-3  px-2 py-1 bg-green-100 rounded-full text-sm text-green-500 capitalize">
                        {props.post.status}
                      </p>
                    ) : (
                      <p className="ml-3  px-2 py-1 bg-red-100 rounded-full text-sm text-red-500 capitalize">
                        {props.post.status}
                      </p>
                    ))}
                </span>
              }
              action={
                auth.user.id == props.post.created_by && (
                  <Menu as="div" className="relative inline-block">
                    <div className="bg-white">
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
                          {(props.post.status == 'pending' || props.post.status == 'rejected') && (
                            <Menu.Item>
                              <Link
                                href={route('post.edit', [props.post.id, 'editposts'])}
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
                              onClick={(e) => deletePost(e, route('post.destroy', props.post.id))}
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
            <div className="ml-5">
              <ReadMore>{props.post.desc}</ReadMore>
            </div>
          </div>
          {props.post.media.length > 1 ? (
            <div className="row">
              <div className="grid grid-cols-3 gap-1">
                {props.post.thumb_url.map((photo, index) => (
                  <img key={index} src={photo} className="w-full h-auto object-scale down" alt="" />
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

          <div className=" border-t-1 grid grid-rows-1 place-items-start h-auto">
            <div className="flex items-center flex-wrap p-0 w-full">
              <LikeButton props = {props.post.id} />
              <Expand
                teacherData={auth.track.classes[0]}
                className=""
                value={props.students}
                valueOne={props.post.comments.length}
                fetchRoute=""
                modulePanel=""
                modulePaneltwo=""
              >
                {props.post.id}
              </Expand>
              {showModal ? openLikeModal(selectedPostForLikes) : null}
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
      </Index>
    </div>
  );
};

export default Show;
