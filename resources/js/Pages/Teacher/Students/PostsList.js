import { useState, useEffect } from 'react';
import ReadMore from '@/Components/ReadMore';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import DisplayNotesInModal from '@/Modals/DisplayNotesInModal';
import { Expand } from '@/Components/Expand';
import { TeacherLikeButton } from '@/Components/LikeButton';
import Images from '@/Components/Images';

export default function PostsList(props) {
  const { students } = props;
  const { student } = props;

  const [isBottom, setIsBottom] = useState(false);
  const [posts, setStudentsData] = useState(props.posts.data);
  const [pageNo, setPageNo] = useState(props.posts.next_page_url);
  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
      setIsBottom(true);
    }
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

  const getData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setStudentsData((old) => [...old, ...res.data.student.data]);
      setIsBottom(false);
      setPageNo(res.data.student.next_page_url);
    });
  };

  useEffect(() => {
    if (isBottom) {
      if (pageNo != null) {
        getData();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom]);

  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedPostForNotes, setSelectedPostForNotes] = useState(null);
  const getNotes = (post, e) => {
    e.preventDefault();
    setOpenNotesModal(true);
    setSelectedPostForNotes(post);
  };
  const displayNotes = (post) => (
    <DisplayNotesInModal
      props={props.student}
      setOpenNotesModal={setOpenNotesModal}
      fetchRoute={route('teacher.posts.notes', post)}
      modulePanel="teacher"
    />
  );

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

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-center flex justify-between">
          <h6 className="text-black-600 text-lg font-semibold capitalize">Post List</h6>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center px-2 md:px-6 py-2 md:py-6">
        {posts.length > 0 &&
          posts.map((post) => (
            <div className="m-4 bg-white w-full md:max-w-2xl rounded-lg shadow-md relative" key={post.id}>
              <div className="flex flex-wrap items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  {student.media.length == 0 && (
                    <div className="w-10 h-10 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {student.first_name.charAt(0)}
                    </div>
                  )}

                  {student.media.length > 0 && (
                    <img
                      src={student.media[0].original_url}
                      alt={`${student.first_name} ${student.last_name}`}
                      className="w-10 h-10 rounded-full"
                    />
                  )}

                  <div className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                    <p className="ml-1 text-sm font-semibold capitalize">
                      {student.first_name} {student.last_name}
                    </p>
                    <span className="text-gray-400 text-sm ml-1">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>{' '}
                    {post.status == 'approved' && <span className="text-green-500 text-sm ml-1">Approved</span>}
                    {post.status == 'rejected' && <span className="text-red-600 text-sm ml-1">Rejected</span>}
                  </div>
                </div>

                <div className="ml-0 xl:ml-3 mt-1 sm:mt-0 text-sm text-gray-600">
                  <>
                    <Link
                      href="#"
                      className="focus:outline-none hover:cursor-pointer ml-2"
                      onClick={(e) => getNotes(post, e)}
                    >
                      <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-3 right-0 ml-0">
                        <HistoryToggleOffOutlinedIcon className="py-1half" /> Notes +
                      </span>
                    </Link>
                  </>
                </div>
              </div>

              <div className="px-4 py-4 border-t">
                <ReadMore>{post.desc}</ReadMore>
              </div>

              {post.media.length == 1 && (
                <button
                  className="number"
                  onClick={() => {
                    setIsOpen(true);
                    setImgIndex(0);
                    media(post.media);
                  }}
                >
                  <img className="w-full h-auto" src={post.thumb_url[0]} alt={`Post id#${post.id} - media 1`} />
                </button>
              )}

              {post.media.length > 1 && (
                <div className="grid grid-cols-2">
                  {post.thumb_url.slice(0, 4).map((photo, index) => (
                    <>
                      <div className="relative custom-popup-hover" key={index}>
                        <button
                         className='image-size-big w-full'
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

              <div className="border-t">
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
              {post.status == 'approved' && (
                <div className="grid grid-rows-1 place-items-start h-auto">
                  <div className="flex items-center flex-wrap p-0 w-full">
                    <TeacherLikeButton props={post.id} />
                    <Expand
                      fetchRoute={route('teacher.posts.comments.fetch', post.id)}
                      post={post}
                      modulePanel="teacher"
                      valueOne={post.comments_count}
                      value={students}
                    >
                      {post.id}
                    </Expand>
                  </div>
                </div>
              )}
            </div>
          ))}

        {posts.length == 0 && <p className="text-center">No records found.</p>}
      </div>

      {openNotesModal === true ? displayNotes(selectedPostForNotes) : null}
      {isOpen && <Images media={allMedia} closeModel={callbackModal} setIndex={callIndex} index={imgIndex} />}
    </div>
  );
}
