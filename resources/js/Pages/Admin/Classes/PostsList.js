import { Fragment, useEffect, useState } from 'react';
import ReadMore from '@/Components/ReadMore';
import 'sweetalert2/src/sweetalert2.scss';
import Favorite from '@mui/icons-material/Favorite';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { AdminExpand, AdminClassExpand } from '@/Components/Expand';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { Tab } from '@headlessui/react';
import { AdminClassPostLikeButton, AdminLikeButton } from '@/Components/LikeButton';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PostsList(props) {
  const teachers = props.teachers;
  const students = props.students;
  const tagstudents = props.tagstudents;

  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [modalName, setModalName] = useState(null);
  const [studentPost, setStudentPost] = useState(students.data);
  const [teacherPost, setTeacherPost] = useState(teachers.data);
  const [isBottom, setIsBottom] = useState(false);
  const [pageNo, setPageNo] = useState(students.next_page_url);

  const getPostLikes = (post, e, param) => {
    e.preventDefault();
    setModalName(param);
    setOpenLikesModal(true);
    setSelectedPostForLikes(post);
  };

  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('admin.posts.likes.fetch', [post.id, modalName])}
      modulePanel="admin"
    />
  );

  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

    if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
      setIsBottom(true);
    }
  };

  const studentPostData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setStudentPost((old) => [...old, ...res.data.studentsPosts.data]);
      setIsBottom(false);
      setPageNo(res.data.studentsPosts.next_page_url);
    });
  };

  const teacherPostData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setTeacherPost((old) => [...old, ...res.data.teachers.data]);
      setIsBottom(false);
      setPageNo(res.data.teachers.next_page_url);
    });
  };

  useEffect(() => {
    if (isBottom) {
      if (pageNo != null) {
        studentPostData();
        teacherPostData();
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom]);


  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">Posts List</h6>
          </div>
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="mx-2 my-4 flex space-x-1 rounded-full bg-blue-600 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-auto rounded-full p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase leading-5 text-white',
                'hover:bg-gray-300',
                selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
              )
            }
          >
            Students&apos; Posts
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-auto rounded-full p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase leading-5 text-white',
                'hover:bg-gray-300',
                selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
              )
            }
          >
            Teacher&apos;s posts
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 bg-gray-50 rounded-b">
          <Tab.Panel className="">
            <div className="flex flex-col mx-auto px-2 md:px-6 py-0 md:py-6 w-full">
              <>
                {studentPost.map((post, index) => (
                  <div
                    className={`bg-white shadow mb-4 md:mb-6 mx-auto w-full lg:w-3/4 xl:w-full rounded ${
                      post.media.length ? 'row-span-3' : 'row-span-1'
                    }`}
                    key={index}
                  >
                    <CardHeader
                      avatar={
                        <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
                          {post.user.media[0] ? (
                            <Avatar
                              alt="Placeholder"
                              className="bg-yellow-500 w-12 h-12 block rounded-full"
                              src={post.user.media[0].original_url}
                            />
                          ) : (
                            <Avatar className="bg-yellow-500">{post.user.first_name.charAt(0)}</Avatar>
                          )}
                          <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                            <p className="ml-1 text-sm font-semibold capitalize">
                              {`${post.user.first_name} ${post.user.last_name}`}
                            </p>
                            <span className="text-gray-500 text-sm ml-1">
                              {' '}
                              {new Date(post.created_at).toLocaleDateString('en-US', {
                                hour12: false,
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              })}{' '}
                            </span>
                            {post.status == 'approved' && <span className="text-green-500 text-sm ml-1">Approved</span>}
                            {post.status == 'rejected' && <span className="text-red-600 text-sm ml-1">Rejected</span>}
                            {post.status == 'pending' && <span className="text-yellow-600 text-sm ml-1">Pending</span>}
                          </div>
                        </span>
                      }
                    />
                    <div className="p-3">
                      <ReadMore>{post.desc}</ReadMore>
                    </div>
                    <div className="">
                      {post.media.length > 1 ? (
                        <div className="overflow-y-auto h-96  grid-cols-3 items-center">
                          {post.thumb_url.map((photo, index) => (
                            <div key={index} className="">
                              <img src={photo} className="max-w-full h-auto" alt="" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        [
                          post.media.length ? (
                            <div key={index} className="mb-4">
                              <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                            </div>
                          ) : null,
                        ]
                      )}
                    </div>
                    {post.status == 'approved' && (
                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">
                        <AdminLikeButton props={post.id} />
                        <AdminExpand
                          className=""
                          fetchRoute={route('admin.posts.comments.fetch', post.id)}
                          valueOne={post.comments.length}
                          modulePanel="admin"
                          value={tagstudents}
                          postId={post.id}
                        >
                          {post.id}
                        </AdminExpand>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
              {studentPost.length == 0 && <p className="text-center">No records found.</p>}
            </div>
          </Tab.Panel>

          <Tab.Panel className="">
            <>
              <div className="flex flex-col mx-auto px-2 md:px-6 py-0 md:py-6 w-full">
                {teacherPost.length > 0 &&
                  teacherPost.map((post) => (
                    <div
                      className="bg-white shadow mb-4 md:mb-6 mx-auto w-full lg:w-3/4 xl:w-full rounded"
                      key={post.id}
                    >
                      <CardHeader
                        avatar={
                          <span className="relative flex items-center no-underline w-18 h-12 rounded-full bg-white">
                            {post.teacher.media.length ? (
                              <Avatar
                                alt="Placeholder"
                                className="bg-yellow-500 w-12 h-12 block rounded-full"
                                src={post.teacher.media[0].original_url}
                              />
                            ) : (
                              <Avatar className="bg-yellow-500">{post.teacher.first_name.charAt(0)}</Avatar>
                            )}

                            <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                              <p className="ml-1 text-sm font-semibold capitalize">
                              {post.teacher.first_name + ' ' + post.teacher.last_name}
                              </p>
                              <div className="ml-1 text-gray-500 text-sm">
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

                      <div className="px-4 py-4 border-t">
                        <ReadMore>{post.content}</ReadMore>
                      </div>
                      <div className="">
                        {post.media.length == 1 && (
                          <img className="w-full h-auto" src={post.thumb_url[0]} alt={`Post id#${post.id} - media 1`} />
                        )}

                        {post.media.length > 1 && (
                          <div
                            className={
                              post.media.length === 2
                                ? 'grid grid-cols-2 items-center'
                                : 'grid grid-cols-3 items-center'
                            }
                          >
                            {post.thumb_url.map((photo, index) => (
                              <img
                                key={index}
                                className="rounded px-4 py-4 max-w-full h-auto object-scale-down"
                                src={photo}
                                alt={`Post id#${post.id} - media #${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-center flex-wrap p-0 w-full">
                        <AdminClassPostLikeButton props={post.id} />
                        <AdminClassExpand 
                          className=""
                          fetchRoute={route('admin.posts.teacher.class.comments.fetch', post.id)}
                          valueOne={post.comments.length}
                          modulePanel="admin"
                          value={tagstudents}
                          postId={post.id}
                        >
                          {post.id}
                        </AdminClassExpand>
                        </div>
                      </div>
                    </div>
                  ))}

                {teacherPost.length == 0 && <p className="text-center">No records found.</p>}
              </div>
            </>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}
    </div>
  );
}
