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
import { AdminTeacherPostLikes } from '@/Components/AdminPostLikes';
import Images from '@/Components/Images';
import 'react-image-lightbox/style.css';

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
    if(props.isFriday == true ){
      ApiService.post(route('teacher.adminposts.likes', [event.target.value, event.target.checked]))
        .then(() => {
          Inertia.reload(props.rows);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    <AdminTeacherPostLikes post={post} closeModel={callbackModal} modulePanel="teacher" isFriday={props.isFriday}/>
  );
  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div>
      <Authenticated auth={props.auth} errors={props.errors} header={'Admin Post'}>
      {props.post_exits == true &&
        <div className="item-center m-6 mx-auto bg-white rounded-2xl shadow-md md:max-w-xl">
          <div className="p-1 rounded-t-md bg-purple-200">
            <CardHeader
              avatar={
                <span className="flex items-center no-underline w-18 h-12 rounded-full">
                  {props.posts.admin.media[0] ? (
                    <Avatar
                      alt="Placeholder"
                      className="bg-yellow-500 w-12 h-12 block rounded-full"
                      src={props.posts.admin.media[0].original_url}
                    />
                  ) : (
                    <Avatar className="bg-yellow-500">{props.posts.admin.first_name.charAt(0)}</Avatar>
                  )}
                  <div className="flex flex-wrap flex-col lg:flex-row items-start justify-start">
                    <p className="ml-2 text-sm font-semibold capitalize">{`${props.posts.admin.first_name} ${props.posts.admin.last_name}`}</p>
                    <span className="ml-2 text-gray-500 text-sm">
                      {new Date(props.posts.created_at).toLocaleDateString('en-US', {
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
                modulePanel="teacher"
                isFriday={props.isFriday}
              >
                {props.posts.id}
              </AdminOwnPostExpand>
            </div>
          </div>
          {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
          {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
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

export default AdminPostShow;
