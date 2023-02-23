import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import 'sweetalert2/src/sweetalert2.scss';
import { CardHeader, Avatar, Checkbox } from '@mui/material';
import ReadMore from '@/Components/ReadMore';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Link, usePage } from '@inertiajs/inertia-react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { ClassExpand, Expand } from '@/Components/Expand';
import ApiService from '@/services/ApiService';
import TeacherClassPostLikes from '@/Components/TeacherClassPostLikes';
import { Inertia } from '@inertiajs/inertia';

export default function List(props) {
  const [allRows, setAllRows] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { auth } = usePage().props;

  useEffect(() => {
    const fetchRows = () => {
      axios
        .get(route('teacher.moderation.fetchPendingPosts'))
        .then((response) => {
          setAllRows(response.data);
          setAllStudents(response.data.all_students);
        });
    };
    fetchRows();
  }, [refreshKey]);

  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const getPostLikes = (post, e) => {
    e.preventDefault();
    setOpenLikesModal(true);
    setSelectedPostForLikes(post);
  };
  const displayLikesInModal = (post) => {
    return (
      <DisplayLikesInModal
        post={post}
        setOpenLikesModal={setOpenLikesModal}
        fetchRoute={route('teacher.posts.likes.fetch', post.id)}
        modulePanel="teacher"
      />
    );
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
                text: res.data.message,
                icon: 'success',
              });

              setRefreshKey((oldKey) => oldKey + 1);
          });
      }
    })();
  };

  const fetchLikeData = (event) => {
    ApiService.post(route('teacher.classPosts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTeacherLikeData = (event) => {
    ApiService.post(route('teacher.classPosts.teacherLikes', [event.target.value, event.target.checked]))
      .then(() => {
        Inertia.reload(props);
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [allStudents, setAllStudents] = useState([]);
  const [selectedTeacherPostForLikes, setSelectedTeacherPostForLikes] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const callbackModal = () => {
    setIsPostOpen(false);
  };
  const openLikePostModal = (post, e) => {
    e.preventDefault();
    setSelectedTeacherPostForLikes(post);
    setIsPostOpen(true);
  };
  const openPostLikeModal = (post) => {
    return <TeacherClassPostLikes post={post} closeModel={callbackModal} modulePanel="teacher" />;
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Post Moderation'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Post Moderation List</h6>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-full mb-4 md:mb-12">
                <div className="relative  min-w-0 break-words mb-6">
                  <div className="relative flex-row items-start md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4 p-3 bg-gray-50">
                    {allRows.posts && allRows.posts.map((post, index) => (
                      <>
                        <div
                          className={
                            'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl ' +
                            (post.media.length ? 'row-span-3' : 'row-span-1')
                          }
                          key={index}
                        >
                          <span className="top-0 inline-flex items-center justify-center px-2 py-1 text-sm font-semibold leading-none text-blue-600 bg-blue-100 rounded-b">
                            Class Name: {post.class.name}
                          </span>
                          <CardHeader
                            avatar={
                              <>
                                <span className="flex items-center no-underline w-18 h-12 rounded-full bg-white">
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
                                    <p className="ml-1 text-sm  font-semibold capitalize">
                                      {post.teacher.first_name + ' ' + post.teacher.last_name}
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
                                  </div>
                                </span>
                              </>
                            }
                          />
                          <div className="p-3">
                            <ReadMore>{post.content}</ReadMore>
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
                                  <div className="mb-4">
                                    <img src={post.thumb_url[0]} className="w-full h-auto rounded-lg" alt="" />
                                  </div>
                                ) : null,
                              ]
                            )}
                          </div>
                          <hr />
                          <div className="grid grid-rows-1 place-items-start h-auto">
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

                              {post.comments.length > 0 ? (
                                <ClassExpand
                                  className=""
                                  post={post}
                                  fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                                  modulePanel="teacher"
                                  modulePaneltwo="classPostComments"
                                  value={allStudents}
                                  valueOne={post.comments_count}
                                  commentLenth={post.comments.length}
                                >
                                  {post.id}
                                </ClassExpand>
                              ) : (
                                <ClassExpand
                                  className=""
                                  post={post}
                                  fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                                  modulePanel="teacher"
                                  modulePaneltwo="classPostComments"
                                  value={allStudents}
                                  valueOne={post.comments_count}
                                >
                                  {post.id}
                                </ClassExpand>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                    {allRows.students && allRows.students.map((post, index) => (
                      <>
                          <div
                            className={
                              'relative item-center m-0 md:m-2 bg-white rounded-xl shadow-lg md:max-w-xl ' +
                              (post.media.length ? 'row-span-3' : 'row-span-1')
                            }
                          >
                            <span className="top-0 inline-flex items-center justify-center px-2 py-1 text-sm font-semibold leading-none text-blue-600 bg-blue-100 rounded-b">
                              Class Name: {post.user.classes[0].name}
                            </span>
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
                                      {post.user.first_name + ' ' + post.user.last_name}{' '}
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
                                      })}
                                    </span>

                                    {post.status == 'approved' && (
                                      <span className="text-green-500 text-sm ml-1">Approved</span>
                                    )}
                                    {post.status == 'rejected' && (
                                      <span className="text-red-600 text-sm ml-1">Rejected</span>
                                    )}
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
                                      <img
                                        src={post.thumb_url[0]}
                                        className="w-full h-auto rounded-lg"
                                        alt=""
                                      />
                                    </div>
                                  ) : null,
                                ]
                              )}
                              <div className="border-t">
                                <div className="flex items-center justify-around px-6">
                                  {post.status == 'pending' && (
                                    <span className="py-2">
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
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <hr />
                            {post.status == 'approved' &&
                            <div className="grid grid-rows-1 place-items-start h-auto">
                              <div className="flex items-center flex-wrap p-0 w-full">
                                {post.likes.length > 0 ? (
                                  <Checkbox
                                    value={post.id}
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite className="fill-pink" />}
                                    name="checkedH"
                                    className="checked fill-pink"
                                    checked={true}
                                    onClick={fetchTeacherLikeData}
                                  />
                                ) : (
                                  <Checkbox
                                    value={post.id}
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite />}
                                    name="checkedH"
                                    className="checked"
                                    checked={false}
                                    onClick={fetchTeacherLikeData}
                                  />
                                )}

                                {(post.likes.length == 1 && (
                                  <button
                                    onClick={(e) => getPostLikes(post, e)}
                                    className="hover:text-gray-400 text-black text-sm md:text-base"
                                  >
                                    {post.likes.length} like
                                  </button>
                                )) ||
                                  (post.likes.length > 1 && (
                                    <button
                                      onClick={(e) => getPostLikes(post, e)}
                                      className="hover:text-gray-400 text-black text-sm md:text-base"
                                    >
                                      {post.likes.length} likes
                                    </button>
                                  ))}

                                  
                                {post.comments_count > 0 ? (
                                  <Expand
                                    fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                                    post={post}
                                    modulePanel="teacher"
                                    valueOne={post.comments_count}
                                    commentLenth={post.comments_count}
                                    value={allStudents}
                                  >
                                    {post.id}
                                  </Expand>
                                ) : (
                                  <Expand
                                    fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                                    post={post}
                                    modulePanel="teacher"
                                    valueOne={post.comments_count}
                                    value={allStudents}
                                  >
                                    {post.id}
                                  </Expand>
                                )}
                              </div>
                            </div>
                          }
                          </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {allRows.posts == 0 && allRows.students == 0 && <p className="text-xl text-center m-24">No Posts Yet :(</p>}
            {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}
            {isPostOpen ? openPostLikeModal(selectedTeacherPostForLikes) : null}
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
