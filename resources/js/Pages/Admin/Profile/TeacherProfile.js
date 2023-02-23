import React, { Fragment, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import ReadMore from '@/Components/ReadMore';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { AdminClassExpand } from '@/Components/Expand';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { Avatar,Checkbox } from '@mui/material';

export default function Profile(props) {
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [openLikesModal, setOpenLikesModal] = useState(false);

  const getPostLikes = (post, e) => {
    e.preventDefault();
    setOpenLikesModal(true);
    setSelectedPostForLikes(post);
  };

  React.useEffect(() => {
    document.title = 'Profile';
  }, []);
  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('admin.posts.likes.fetch', [post.id, 'class_posts'])}
      modulePanel="admin"
    />
  );

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'TeacherProfile'}>
      <div className="flex flex-wrap mt-8 md:mt-12">
        <div className="w-full mb-12 px-0 md:px-4">
          <div className="relative  min-w-0 break-words mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="px-3 md:px-6 flex flex-col md:flex-row">
              <div className="">
                <div className="relative flex justify-center md:justify-end px-4 md:px-10">
                  <span className="flex items-center justify-center rounded-full -m-8">
                    {props.name.media[0] ? (
                      <img
                        src={props.name.media[0].original_url}
                        alt={`${props.name.first_name} ${props.name.last_name}`}
                        className="object-cover rounded-full w-12 md:w-20 h-12 md:h-20 flex items-center justify-center"
                      />
                    ) : (
                      <div className="w-12 md:w-20 h-12 md:h-20 relative flex justify-center items-center rounded-full text-3xl md:text-5xl text-white uppercase bg-yellow-500">
                        {props.name.first_name.charAt(0)}
                      </div>
                    )}
                  </span>
                </div>
              </div>
              <div className=" text-start mt-2 md:mt-0 ml-0 md:ml-12 py-4 text-black">
                <h1 className="text-blue-500 text-lg font-semibold">
                  {props.name.first_name} {props.name.last_name}
                </h1>
                <>{props.name.email} </>
                {/* <span className="">
                  {props.teacher.class_posts.length == 1 && <p>{props.class_posts.length} post</p> ||
                   props.class_posts.length == 0 && <p>{props.class_posts.length} Posts</p> ||
                   props.class_posts.length > 1 && <p>{props.class_posts.length} Posts</p>}</span> */}
              </div>
            </div>
            <hr />
            <div className="relative flex-row items-start md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-3 p-3 bg-gray-200 rounded-lg border-0">
              {props.teacher &&
                props.teacher.map((post, index) => (
                  <>
                    <div className="m-6 bg-white pb-4 item-center rounded-2xl shadow-md md:max-w-2xl" key={index}>
                      <div className="bg-blue-100 flex flex-row rounded-t">
                        <div className="px-2 py-3 mx-3 w-auto h-auto rounded-full">
                          {post.teacher.media.length ? (
                            <img
                              alt = "images"
                              className="w-12 h-12 object-cover rounded-full shadow"
                              src={post.teacher.media[0].original_url}
                            />
                          ) : (
                            <Avatar className="bg-yellow-500 w-12 h-12 object-cover rounded-full shadow">
                              {post.teacher.first_name.charAt(0)}
                            </Avatar>
                          )}
                        </div>
                        <div className="flex flex-col py-3">
                          <div className="flex text-black-600 text-sm font-bold">
                            <span className="flex-1 flex-shrink-0">{`${post.teacher.first_name} ${post.teacher.last_name}`}</span>
                          </div>
                          <div className="flex w-full mt-1">
                            <div className="text-blue-600 font-base text-sm mr-1">Teacher</div>
                            <div className="text-gray-500 text-sm">
                              {new Date(post.updated_at).toLocaleDateString('en-US', {
                                hour12: false,
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-gray-400 font-medium text-sm px-2">
                        {post.media.length > 1 ? (
                          <div className="row">
                            <div className="grid grid-cols-3 col-span-2 gap-2">
                              {post.thumb_url.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo}
                                  className={'overflow-hidden rounded-xl row-span-3' + ' max-h-auto'}
                                  alt=""
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          [
                            post.media.length ? (
                              <div key={index} className="mb-4">
                                <img src={post.thumb_url[0]} className="w-full h-auto" alt="" />
                              </div>
                            ) : null,
                          ]
                        )}
                      </div>
                      <div className="text-gray-500 text-sm mb-6 mx-3 px-2">
                        <ReadMore>{post.content}</ReadMore>
                      </div>

                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">
                          {(post.likes.length == 1 && (
                            <button
                              onClick={(e) => getPostLikes(post, e)}
                              className="hover:text-gray-400 text-black text-sm md:text-base"
                            >
                              <Checkbox
                                value={post.id}
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                checked={post.likes_count !== 0}
                              />
                              {post.likes.length} like
                            </button>
                          )) ||
                            (post.likes.length > 1 && (
                              <button
                                onClick={(e) => getPostLikes(post, e)}
                                className="hover:text-gray-400 text-black text-sm md:text-base"
                              >
                                <Checkbox
                                  value={post.id}
                                  icon={<FavoriteBorder />}
                                  checkedIcon={<Favorite />}
                                  checked={post.likes_count !== 0}
                                />
                                {post.likes.length} likes
                              </button>
                            ))}
                          <AdminClassExpand
                            className=""
                            fetchRoute={route('admin.posts.teacher.class.comments.fetch', post.id)}
                            valueOne={post.comments.length}
                            modulePanel="admin"
                          >
                            {post.id}
                          </AdminClassExpand>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
