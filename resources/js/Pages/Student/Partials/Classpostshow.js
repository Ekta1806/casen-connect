import React, { useState } from 'react';
import ApiService from '@/services/ApiService';
import { Link } from '@inertiajs/inertia-react';
import { Checkbox, Avatar, CardHeader } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Inertia } from '@inertiajs/inertia';
import ReadMore from '@/Components/ReadMore';
import { ClassExpand } from '@/Components/Expand';
import 'react-quill/dist/quill.snow.css';
import Index from '../Dashboard/Index';
import Likes from '@/Modals/Likes';

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

  const fetchData = (event) => {
    ApiService.post(route('teacher.post.likes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div>
      <Index header={'Posts'}>
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
                        {`${props.student.first_name} ${props.student.last_name}`}{' '}
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
              />
              <div className="ml-5">
                <ReadMore>{props.post.content}</ReadMore>
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
                {props.like ? (
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
                {(props.post.likes.length == 1 && (
                  <button
                    onClick={(e) => openModal(post, e)}
                    className="hover:text-gray-400 text-black text-sm md:text-base"
                  >
                    {props.post.likes.length} like
                  </button>
                )) ||
                  (props.post.likes.length > 1 && (
                    <button
                      onClick={(e) => openModal(post, e)}
                      className="hover:text-gray-400 text-black text-sm md:text-base"
                    >
                      {props.post.likes.length} likes
                    </button>
                  ))}
                <ClassExpand
                  className=""
                  teacherData={props.student}
                  value={props.students}
                  valueOne={props.post.comments.length}
                >
                  {props.post.id}
                </ClassExpand>
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
