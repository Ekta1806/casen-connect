import React, { useState } from 'react';
import ApiService from '@/services/ApiService';
import { Inertia } from '@inertiajs/inertia';
import ReadMore from '@/Components/ReadMore';
import { Expand } from '@/Components/Expand';
import { usePage, Link} from '@inertiajs/inertia-react';
import 'react-quill/dist/quill.snow.css';
import Likes from '@/Modals/Likes';
import { Avatar, CardHeader } from '@mui/material';
import Authenticated from '@/Layouts/Authenticated';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import LikeButton from '@/Components/LikeButton';

const Show = (props) => {
  React.useEffect(() => {
    document.title = "student's post";
  }, [props]);

  const openLikeModal = (post) => {
    return <Likes post={post} closeModel={callbackModal} />;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setShowModal(false);
    setIsOpen(false);
  };

  const { auth } = usePage().props;

  const fetchData = (event) => {
    ApiService.post(route('teacher.classPosts.teacherLikes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props.post);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approveRejectPost = (e, post, approveReject) => {
    e.preventDefault();

    (async () => {
      const notesText = await Swal.fire({
        title: 'Note for Approving / Rejecting',
        input: 'textarea',
        inputLabel: 'Any notes that you would like to add? (Optional)',
        showCancelButton: true,
      });

      if (notesText.isConfirmed) {
        var notesBody = null;
        if (notesText != null || notesText != '' || notesText.trim().length > 0) {
          notesBody = notesText.value;
        }

        axios
          .patch(route('teacher.posts.approveReject', [post.id, approveReject]), { notes: notesBody })
          .then((res) => {
              Swal.fire({
                title: 'Success !',
                text: res.data,
                icon: 'success',
              });
              setTimeout(() => {
                window.location.reload(false);
              }, 1500);
          });
      }
    })();
  };

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };
  
  return (
    <div>
      <Authenticated auth={props.auth} errors={props.errors} header={"Student's Post"}>
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
                  {props.student.id == auth.user.id &&
                    (props.post.status == 'pending' ? (
                      <p className="ml-3  px-2 py-1 bg-yellow-100 rounded-full text-sm text-yellow-500 capitalize">
                        {props.post.status}
                      </p>
                    ) : (
                      (props.post.status == 'rejected' ? (
                      <p className="ml-3  px-2 py-1 bg-red-100 rounded-full text-sm text-red-500 capitalize">
                        {props.post.status}
                      </p>
                    ) : (
                        <p className="ml-3  px-2 py-1 bg-green-100 rounded-full text-sm text-green-500 capitalize">
                          {props.post.status}
                        </p>
                    ))
                  ))}
                </span>
              }
            />
            <div className="ml-5">
              <ReadMore>{props.post.desc}</ReadMore>
            </div>
            <div className="">
              {props.post.media.length > 1 ? (
                <div className="overflow-y-auto h-96  grid-cols-3 items-center">
                  {props.post.thumb_url.map((photo, index) => (
                    <div key={index} className="">
                      <img src={photo} className="max-w-full h-auto" alt="" />
                    </div>
                  ))}
                </div>
              ) : (
                [
                  props.post.media.length ? (
                    <div className="mb-4">
                      <img src={props.post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                    </div>
                  ) : null,
                ]
              )}
              <div className="">
                <div className="flex items-center justify-around px-6">
                  {props.post.status == 'pending' && (
                    <span className="py-2">
                      <Link
                        className="font-semibold bg-green-200 text-green-600 hover:text-green-900 p-2 rounded-md"
                        href="#"
                        onClick={(e) => approveRejectPost(e, props.post, 'approved')}
                        as="button"
                        method="patch"
                      >
                        <CheckOutlinedIcon /> Approve
                      </Link>
                      <Link
                        className="ml-4 font-semibold bg-red-200 text-red-600 hover:text-red-900 p-2 rounded-md"
                        href="#"
                        onClick={(e) => approveRejectPost(e, props.post, 'rejected')}
                        as="button"
                        method="patch"
                      >
                        <CloseOutlinedIcon /> Reject
                      </Link>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {props.post.status === 'approved' && (
            <div className=" border-t-2 grid grid-rows-1 place-items-start h-auto">
              <div className="flex items-center flex-wrap p-0 w-full">
                {/* <LikeButton props = {props.post.id} /> */}
                <Expand
                  fetchRoute={route('teacher.posts.comments.fetch', props.post.id)}
                  post={props.post}
                  modulePanel="teacher"
                  valueOne={props.post.comments.length}
                  value={props.students}
                >
                  {props.post.id}
                </Expand>
                {isOpen ? openLikeModal(selectedPostForLikes) : null}
              </div>
            </div>
          )}
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
