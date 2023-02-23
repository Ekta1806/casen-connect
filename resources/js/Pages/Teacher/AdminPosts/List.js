import { Fragment, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import Select from 'react-select';
import { AdminOwnPostExpand } from '@/Components/Expand';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { AdminTeacherPostLikes } from '@/Components/AdminPostLikes';
import ApiService from '@/services/ApiService';
import { Inertia } from '@inertiajs/inertia';
import Images from '@/Components/Images';
import 'react-image-lightbox/style.css';

export default function List(props) {
  const [inputText, setInputText] = useState('');
  const inputHandler = (e) => {
    setInputText(e.label.toLowerCase());
  };
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);


  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const filteredData = props.rows.filter((el) => {
    if (inputText === '') {
      return el;
    }
    
    if(el.class !== null){
      return el.class.name.toLowerCase().includes(inputText);
    }
    if(el.class === null){
      if(inputText === "all classes"){
        return el;
      }
    }
  });

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

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Admins Posts'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col md:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Admin&apos;s posts</h6>
                  <div className="ml-0 md:ml-6 mt-1 md:mt-0 w-full md:w-auto">
                    <Select options={props.classes} name="classes_id" onChange={inputHandler}></Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100 overflow-x-auto">
              <ul className="relative flex-row items-start pt-6 bg-gray-200 rounded-lg border-0 imageList">
                {filteredData.map((post, index) => (
                  <li className="profile mb-6" key={index}>
                    <div className={'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl'}>
                      <div className="flex justify-between">
                        <span className="top-0 inline-flex items-center justify-center px-2 py-1 text-sm font-semibold leading-none text-blue-600 bg-blue-100 rounded-b">
                          Class Name: {post.class ? post.class.name : "All Classes"}
                        </span>
                      </div>
                      <CardHeader
                        avatar={
                          <span className="relative flex items-center no-underline w-18 h-12 rounded-full bg-white">
                            {post.admin.profilePicture ? (
                              <Avatar
                                alt="Placeholder"
                                className="bg-yellow-500 w-12 h-12 block rounded-full"
                                src={post.admin.profilePicture}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500">{post.admin.first_name.charAt(0)}</Avatar>
                            )}

                            <div className="flex flex-wrap flex-col lg:flex-row items-start justify-start">
                              <p className="ml-2 text-sm font-semibold capitalize">
                                {`${post.admin.first_name} ${post.admin.last_name}`}{' '}
                              </p>
                              <div className="ml-2 text-gray-500 text-sm">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
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
                      />
                      <div className="p-3">
                        <ReadMore>{post.content}</ReadMore>
                      </div>

                      <div className="">
                        {post.media.length > 1 ? (
                          <>
                            <div className="grid grid-cols-2">
                              {post.thumb_url.slice(0, 4).map((photo, index) => (
                                <>
                                  <div className="relative custom-popup-hover" key={index}>
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
                          </>
                        ) : (
                          [
                            post.media.length ? (
                              <div className="mb-4">
                                <button
                                  onClick={() => {
                                    setIsOpen(true);
                                    setImgIndex(0);
                                    media(post.media);
                                  }}
                                >
                                  <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                                </button>
                              </div>
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
                  </li>
                ))}
              </ul>

              {filteredData.length == 0 && <p className="text-xl text-center m-24">No Posts Yet :(</p>}
              {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
