import Index from '../Dashboard/Index';
import React, { Fragment, useState } from 'react';
import ApiService from '@/services/ApiService';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Menu, Transition, Tab } from '@headlessui/react';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { Inertia } from '@inertiajs/inertia';
import deleteRecord from '@/delete/delete';
import ReadMore from '@/Components/ReadMore';
import { Expand } from '@/Components/Expand';
import 'react-quill/dist/quill.snow.css';
import AddPost from '@/Modals/AddPost';
import { Avatar, CardHeader, Checkbox } from '@mui/material';
import TeacherPostLikes from '@/Modals/TeacherPostLikes';
import DoneIcon from '@mui/icons-material/Done';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DisplayNotesInModal from '@/Modals/DisplayNotesInModal';
import { LikeButton } from '@/Components/LikeButton';
import Images from '@/Components/Images';


export default function PostList(props) {
  const { auth } = usePage().props;
  const [showModal, setShowModal] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [selectedTeacherPostForLikes, setSelectedTeacherPostForLikes] = useState(null);
  const [myPostdata, setMyPostdata] = useState(props.posts.data);
  const [isOpen, setIsOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [allMedia, setMedia] = useState(0);
  const [pageNo, setPageNo] = useState(props.posts.next_page_url);

  const callbackModal = () => {
    setShowModal(false);
    setIsPostOpen(false);
    setIsOpen(false);
  };

  const media = (media) => {
    setMedia(media);
  };

  const popupModel = () => <AddPost closeModel={callbackModal} />;

  const callIndex = (index) => {
    setImgIndex(index);
  };

  const openPostLikeModal = (post) => <TeacherPostLikes post={post} closeModel={callbackModal} modulePanel="student" />;

  const handlAddClick = () => {
    setShowModal(true);
  };

  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedPostForNotes, setSelectedPostForNotes] = useState(null);
  const getNotes = (post, e) => {
    e.preventDefault();
    setOpenNotesModal(true);
    setSelectedPostForNotes(post);
  };
  const displayNotes = (post) => (
    <DisplayNotesInModal
      teacherData={auth.track.classes[0]}
      setOpenNotesModal={setOpenNotesModal}
      fetchRoute={route('student.posts.notes', post)}
      modulePanel="student"
    />
  );

  const getData = (e) => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setMyPostdata((old) => [...old, ...res.data.posts.data]);
      setPageNo(res.data.posts.next_page_url);
    });
  };
  const posting = myPostdata.map((post, index) => (
    <>
      <div
        id="like"
        className="m-8 relative item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-2xl"
        key={index}
      >
        <div className="p-1 rounded-t-md bg-white">
          <CardHeader
            avatar={
              <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
                {auth.user.media[0] ? (
                  <Avatar
                    alt="Placeholder"
                    className="bg-yellow-500 w-12 h-12 block rounded-full"
                    src={auth.user.media[0].original_url}
                  />
                ) : (
                  <Avatar className="bg-yellow-500">{auth.user.first_name.charAt(0)}</Avatar>
                )}
                <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                  <Link href={route('members.profile', auth.user.id)}>
                    <p className="ml-1 text-sm font-semibold capitalize">
                      {`${auth.user.first_name} ${auth.user.last_name}`}
                    </p>
                  </Link>
                  <span className="ml-1 text-gray-500 text-sm">
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
                {post.status == 'pending' ? (
                  <span className=" bg-yellow-200 hover:bg-yellow-600 hover:text-white duration-300 text-yellow-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                    <Link
                      href="#"
                      className="focus:outline-none hover:cursor-pointer"
                      onClick={(e) => getNotes(post, e)}
                    >
                      <AccessTimeIcon className="py-1half" /> Notes +
                    </Link>
                  </span>
                ) : post.status == 'approved' ? (
                  <span className=" bg-green-200 hover:bg-green-600 hover:text-white duration-300 text-green-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                    <Link
                      href="#"
                      className="focus:outline-none hover:cursor-pointer"
                      onClick={(e) => getNotes(post, e)}
                    >
                      <DoneIcon className="py-1half" /> Notes +
                    </Link>
                  </span>
                ) : (
                  <span className=" bg-red-200 hover:bg-red-600 hover:text-white duration-300 text-red-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                    <Link
                      href="#"
                      className="focus:outline-none hover:cursor-pointer"
                      onClick={(e) => getNotes(post, e)}
                    >
                      <ThumbDownOffAltIcon className="py-1half" /> Notes +
                    </Link>
                  </span>
                )}
              </span>
            }
            action={
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
                      {post.status == 'rejected' || post.status == 'pending' ? (
                        <Menu.Item>
                          <Link
                            href={route('post.edit', [post.id, 'editmyposts'])}
                            method="get"
                            className="text-sm py-2 px-4 bg-transparent font-semibold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
                          >
                            Edit
                          </Link>
                        </Menu.Item>
                      ) : (
                        ''
                      )}
                      <Menu.Item>
                        <Link
                          href=""
                          onClick={(e) => deleteRecord(e, route('post.destroy', post.id))}
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
            <ReadMore>{post.desc}</ReadMore>
          </div>
        </div>

        {post.media.length > 1 ? (
          <>
            <div className="grid grid-cols-2">
              {post.thumb_url.slice(0, 4).map((photo, index) => (
                <div className="relative custom-popup-hover">
                  <button
                    className="image-size-big w-full"
                    onClick={() => {
                      setIsOpen(true);
                      setImgIndex(index);
                      media(post.media);
                    }}
                  >
                    <img key={index} src={photo} className="w-full h-auto object-scale down" alt="" />
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
              ))}
            </div>
          </>
        ) : (
          [
            post.media.length ? (
              <div key={post.id} className="mb-4">
                <img src={post.thumb_url[0]} className="w-full h-auto" alt="" />
              </div>
            ) : null,
          ]
        )}

        <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
          <div className="flex items-center flex-wrap p-0 w-full">
            <LikeButton props={post.id} />
            <Expand
              className=""
              teacherData={props.teacher.classes[0]}
              postId={post.id}
              value={props.students}
              valueOne={post.comments_count}
              fetchRoute=""
              modulePanel=""
              modulePaneltwo=""
            >
              {post.id}
            </Expand>
          </div>
        </div>
      </div>
    </>
  ));
  React.useEffect(() => {
    document.title = 'My Posts';
  }, []);

  return (
    <>
      <Index header={'My Posts'} className="relative min-h-screen  student-main-bg">
        <div className="flex flex-wrap mt-0 md:mt-4">
          <div className="w-full mb-0 md:mb-4 px-0 md:px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg bg-white border-1 border-blue-100">
              <div className="">
                <div className="p-4 text-center flex justify-between items-center">
                  <h6 className="flex items-center text-black-600 text-lg font-semibold">
                    My Posts
                  </h6>
                  <div className="flex justify-end">
                    <button
                      onClick={handlAddClick}
                      className="inline-flex items-center px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none ease-linear transition-all"
                    >
                      Add Post
                    </button>
                  </div>
                  
                </div>
               
              </div>
              <div className='bg-gray-100 mt-2'>
                {posting && posting.length ? (
                  <div className="mt-2 mb-2">{posting}</div>
                ) : (
                  <p className="text-black m-32 text-lg flex justify-center text-center capitalize">
                    No data available
                  </p>
                )}
                {pageNo && (
                  <div className="mb-6 flex items-center justify-center">
                    <button
                      className="inline-flex items-center px-4 py-2 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white hover:border-transparent focus:outline-none ease-linear transition-all"
                      type="button"
                      onClick={(e) => getData(e)}
                    >
                      Load More
                    </button>
                  </div>
                )}
                </div>
              {showModal ? popupModel() : null}
              {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
              {openNotesModal === true ? displayNotes(selectedPostForNotes) : null}
              {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
            </div>
          </div>
        </div>
      </Index>
    </>
  );
}
