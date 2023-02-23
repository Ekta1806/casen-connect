import { Link } from '@inertiajs/inertia-react';
import { Fragment, useState, useEffect } from 'react';
import ReadMore from '@/Components/ReadMore';
import { Menu, Transition, Tab } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CardHeader, Avatar } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ClassExpand, Expand } from '@/Components/Expand';
import { Inertia } from '@inertiajs/inertia';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { TeacherClassPostLikeButton, TeacherLikeButton } from '@/Components/LikeButton';
import Images from '@/Components/Images';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PostsList(props) {
  const { classId } = props;
  const { teacher } = props;
  const taggedData = props.taggedData;

  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);

  const media = (media) => {
    setMedia(media);
  };

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [students, setStudentsData] = useState(props.students.data);
  const [posts, setPostsData] = useState(props.posts.data);
  const [pageNo, setPageNo] = useState(props.students.next_page_url);
  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

    if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
      setIsBottom(true);
    }
  };
  const getData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setStudentsData((old) => [...old, ...res.data.students.data]);
      setIsBottom(false);
      setPageNo(res.data.students.next_page_url);
    });
  };

  const getPostData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setPostsData((old) => [...old, ...res.data.posts.data]);
      setIsBottom(false);
      setPageNo(res.data.posts.next_page_url);
    });
  };

  useEffect(() => {
    if (isBottom) {
      if (pageNo != null) {
        getData();
        getPostData();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom]);

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
        let notesBody = null;
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

  const callbackModal = () => {
    setIsOpen(false);
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
          Inertia.reload({ props });
        });
      }
    });
  };

  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('teacher.posts.likes.fetch', post.id)}
      modulePanel="teacher"
    />
  );

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-4">
          <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
            <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
              <h6 className="text-black-600 text-lg font-semibold capitalize">Posts List</h6>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={route('teacher.classPosts.create', classId)}
                className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
              >
                Add New Class Post
              </Link>
            </div>
          </div>
        </div>
        <Tab.Group>
          <Tab.List className="mx-2 my-4 flex space-x-1 rounded-full bg-blue-600 p-1">
            <Tab
              id="student-post"
              className={({ selected }) =>
                classNames(
                  'w-auto rounded-full p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase leading-5 text-white',
                  'hover:bg-gray-300 student-post',
                  selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                )
              }
            >
              Students&apos; Posts
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  'w-auto rounded-full  p-2 sm:p-3 text-xs sm:text-sm font-semibold uppercase leading-5 text-white',
                  'hover:bg-gray-300 teacher-post',
                  selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                )
              }
            >
              Teacher&apos;s posts
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-0 bg-gray-50 rounded-b">
            <Tab.Panel className="">
              <div className="flex flex-col mx-auto px-2 md:px-6 py-0 md:py-6 w-full">
                {students.map((post) => (
                  <>
                    <div
                      className="bg-white shadow mx-auto w-full lg:w-3/4 xl:w-full mb-4 md:mb-8 rounded"
                      key={post.id}
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
                                {`${post.user.first_name} ${post.user.last_name}`}{' '}
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

                              {post.status == 'approved' && (
                                <span className="text-green-500 ml-1 text-sm">Approved</span>
                              )}
                              {post.status == 'rejected' && <span className="text-red-600 ml-1 text-sm">Rejected</span>}
                            </div>
                          </span>
                        }
                      />
                      <div className="p-3">
                        <ReadMore>{post.desc}</ReadMore>
                      </div>
                      <div className="">
                        {post.media.length > 1 && (
                          <div className="grid grid-cols-2">
                            {post.thumb_url.slice(0, 4).map((photo, index) => (
                              <>
                                <div className="relative custom-popup-hover" key={index}>
                                  <button className='image-size-big w-full'
                                    onClick={() => {
                                      setIsOpen(true);
                                      setImgIndex(index);
                                      media(post.media);
                                    }}
                                  >
                                    <img src={photo} className="max-w-full h-auto" alt="" />
                                  </button>
                               

                                {index == 3 && post.media.length - 4 !== 0 && (
                                  <div className="overlay ">
                                    <button
                                      className="number"
                                      onClick={() => {
                                        setIsOpen(true);
                                        setImgIndex(index);
                                        media(post.media);
                                      }}
                                    >
                                      {post.media.length - 4}+
                                    </button>
                                  </div>
                                )}
                                 </div>
                              </>
                            ))}
                          </div>
                        )} 
                            {post.media.length == 1 && (
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
                            )}
                      </div>
                      <div className="grid grid-rows-1 place-items-start h-auto">
                        <div className="flex items-centquestionser justify-center flex-wrap p-0 w-full">
                          <div className="">
                            <div className="flex items-center justify-around px-6">
                              {post.status == 'pending' && (
                                <div className="py-2">
                                  <Link
                                    className="font-semibold bg-green-200 text-green-600 hover:text-green-900 p-2 rounded-md"
                                    href="#"
                                    onClick={(e) => approveRejectPost(e, post, 'approved')}
                                    as="button"
                                    method="patch"
                                  >
                                    <CheckOutlinedIcon /> Approve
                                  </Link>
                                  <Link
                                    className="ml-4 font-semibold bg-red-200 text-red-600 hover:text-red-900 p-2 rounded-md"
                                    href="#"
                                    onClick={(e) => approveRejectPost(e, post, 'rejected')}
                                    as="button"
                                    method="patch"
                                  >
                                    <CloseOutlinedIcon /> Reject
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {post.status == 'approved' && (
                        <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                          <div className="flex items-center flex-wrap p-0 w-full">
                            <TeacherLikeButton props={post.id} />
                            <Expand
                              fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                              post={post}
                              modulePanel="teacher"
                              valueOne={post.comments.length}
                              value={taggedData}
                            >
                              {post.id}
                            </Expand>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ))}

                {students.length == 0 && <p className="text-center p-6 w-full">No records found.</p>}
              </div>
            </Tab.Panel>

            <Tab.Panel className="">
              <>
                <div className="flex flex-col mx-auto px-2 md:px-6 py-0 md:py-6 w-full">
                  {posts.length > 0 &&
                    posts.map((post) => (
                      <div
                        className="bg-white shadow mb-4 md:mb-6 mx-auto w-full lg:w-3/4 xl:w-full rounded"
                        key={post.id}
                      >
                        <div className="flex flex-wrap items-center justify-between px-4 py-4">
                          <div className="flex items-center">
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
                              <span className="text-sm ml-1">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="ml-0 xl:ml-3 mt-1 sm:mt-0 text-sm text-gray-600">
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
                          </div>
                        </div>

                        <div className="px-4 py-4 border-t">
                          <ReadMore>{post.content}</ReadMore>
                        </div>

                        {post.media.length == 1 && (
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
                        )}

                        {post.media.length > 1 && (
                          <div className="grid grid-cols-2">
                            {post.thumb_url.slice(0, 4).map((photo, index) => (
                              <>
                                <div className="relative custom-popup-hover" key={index}>
                                  <button className='image-size-big w-full'
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
                        )}
                        <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                          <div className="flex items-center flex-wrap p-0 w-full">
                            <TeacherClassPostLikeButton props={post.id} />
                            <ClassExpand
                              className=""
                              post={post}
                              fetchRoute={route('teacher.classPosts.fetchPendingComments', post.id)}
                              modulePanel="teacher"
                              modulePaneltwo="classPostComments"
                              value={taggedData}
                              valueOne={post.comments_count}
                            >
                              {post.id}
                            </ClassExpand>
                          </div>
                        </div>
                      </div>
                    ))}

                  {posts.length == 0 && <p className="text-center p-6 w-full">No records found.</p>}
                </div>
              </>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}
        {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
      </div>
    </>
  );
}
