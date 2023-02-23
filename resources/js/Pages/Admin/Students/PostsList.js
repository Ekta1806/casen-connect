  import { useState, useEffect } from 'react';
import ReadMore from '@/Components/ReadMore';
import { Checkbox } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { Link } from '@inertiajs/inertia-react';
import { AdminExpand } from '@/Components/Expand';
import DisplayNotesInModal from '@/Modals/DisplayNotesInModal';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import { AdminLikeButton } from '@/Components/LikeButton';

export default function PostsList(props) {
  const  posts  = props.posts;
  const  student  = props.student;
  const  students  = props.students;

  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedPostForNotes, setSelectedPostForNotes] = useState(null);
  const [myPostdata, setMyPostdata] = useState(props.posts.data);
  const [isBottom, setIsBottom] = useState(false);
  const [pageNo, setPageNo] = useState(props.posts.next_page_url);

  const getNotes = (post, e) => {
    e.preventDefault();
    setOpenNotesModal(true);
    setSelectedPostForNotes(post);
  };
  const displayNotes = (post) => (
    <DisplayNotesInModal
      props={props.student}
      setOpenNotesModal={setOpenNotesModal}
      fetchRoute={route('admin.posts.notes', post)}
      modulePanel="admin"
    />
  );
  const getPostLikes = (post, e) => {
    e.preventDefault();
    setOpenLikesModal(true);
    setSelectedPostForLikes(post);
  };
  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('admin.posts.likes.fetch', [post.id, 'post'])}
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

  const getData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setMyPostdata((old) => [...old, ...res.data.student.data]);
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

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">Post List</h6>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-auto px-2 md:px-6 py-2 md:py-6 w-full md:max-w-xl">
        {myPostdata.length > 0 &&
          myPostdata.map((post) => (
            <div className="m-0 mb-4 md:mb-6 bg-white rounded-lg shadow-md" key={post.id}>
              <div className="flex flex-wrap items-center justify-between px-4 py-4 relative">
                <div className="flex items-center mt-1 mx:mt-0">
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

                    <span className="text-gray-500 text-sm ml-1">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        hour12: false,
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </span>

                    {post.status == 'approved' && <span className="text-green-500 text-sm ml-1">Approved</span>}
                    {post.status == 'rejected' && <span className="text-red-600 text-sm ml-1">Rejected</span>}
                    {post.status == 'pending' && <span className="text-yellow-600 text-sm ml-1">Pending</span>}
                  </div>
                </div>
                <div className="ml-0 xl:ml-3 mt-1 sm:mt-0 text-sm text-gray-600">
                  <>
                    <Link
                      href="#"
                      className="focus:outline-none hover:cursor-pointer ml-2"
                      onClick={(e) => getNotes(post, e)}
                    >
                      <span className="bg-blue-200 hover:bg-blue-600 hover:text-white duration-300 text-blue-700 text-bold capitalize text-sm rounded-full px-2 absolute -top-1 right-0 ml-0">
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
                <img className="w-full h-auto" src={post.thumb_url[0]} alt={`Post id#${post.id} - media 1`} />
              )}

              {post.media.length > 1 && (
                <div
                  className={
                    post.media.length === 2 ? 'grid grid-cols-2 items-center' : 'grid grid-cols-3 items-center'
                  }
                >
                  {post.thumb_url.map((photo, index) => (
                    <img
                      key={index}
                      className="max-w-full h-auto object-scale-down"
                      src={photo}
                      alt={`Post id#${post.id} - media #${index + 1}`}
                    />
                  ))}
                </div>
              )}
              {post.status == 'approved' &&
              <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                <div className="flex items-center flex-wrap p-0 w-full">
                  <AdminLikeButton props={post.id} />
                  <AdminExpand
                    className=""
                    fetchRoute={route('admin.posts.comments.fetch', post.id)}
                    valueOne={post.comments.length}
                    modulePanel="admin"
                    value={students}
                    postId={post.id}
                  >
                    {post.id}
                  </AdminExpand>
                </div>
              </div>
              }
            </div>
          ))}

        {posts.length == 0 && <p className="text-center">No records found.</p>}
        {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}

        {openNotesModal === true ? displayNotes(selectedPostForNotes) : null}
      </div>
    </div>
  );
}
