import { useEffect, useState } from 'react';
import ReadMore from '@/Components/ReadMore';
import 'sweetalert2/src/sweetalert2.scss';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { AdminClassExpand } from '@/Components/Expand';
import DisplayLikesInModal from '@/Modals/DisplayLikesInModal';
import { Checkbox } from '@mui/material';
import { AdminClassPostLikeButton } from '@/Components/LikeButton';

export default function PostsList(props) {
  const teacher  = props.teacher;
  const students = props.students;

  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [openLikesModal, setOpenLikesModal] = useState(false);
  const [myPostdata, setMyPostdata] = useState(props.posts.data);
  const [isBottom, setIsBottom] = useState(false);
  const [pageNo, setPageNo] = useState(props.posts.next_page_url);

  const getPostLikes = (post, e) => {
    e.preventDefault();
    setOpenLikesModal(true);
    setSelectedPostForLikes(post);
  };

  const displayLikesInModal = (post) => (
    <DisplayLikesInModal
      post={post}
      setOpenLikesModal={setOpenLikesModal}
      fetchRoute={route('admin.posts.likes.fetch', [post.id, 'class_posts'])}
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
      setMyPostdata((old) => [...old, ...res.data.teacher.data]);
      setIsBottom(false);
      setPageNo(res.data.teacher.next_page_url);
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
            <h6 className="text-black-600 text-lg font-semibold capitalize">Teacher&apos;s Post List</h6>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-auto px-2 md:px-6 py-2 md:py-6 w-full md:max-w-xl">
        {myPostdata.length > 0 &&
          myPostdata.map((post) => (
            <div className="m-0 mb-4 md:mb-6 bg-white rounded-lg shadow-md" key={post.id}>
              <div className="flex flex-wrap items-center justify-between px-4 py-4">
                <div className="flex items-center">
                  {props.teacherProfilePicture === false && (
                    <div className="w-10 h-10 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500">
                      {teacher.first_name.charAt(0)}
                    </div>
                  )}

                  {props.teacherProfilePicture !== false > 0 && (
                    <img
                      src={props.teacherProfilePicture}
                      alt={`${teacher.first_name} ${teacher.last_name}`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div className="ml-3 font-semibold capitalize">
                    {teacher.first_name} {teacher.last_name}{' '}
                    <span className="text-gray-500 text-sm">
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
              </div>

              <div className="px-4 py-4 border-t">
                <ReadMore>{post.content}</ReadMore>
              </div>
              <div className="">
                {post.media.length == 1 && (
                  <img
                    className="w-full h-auto"
                    src={post.thumb_url[0]}
                    alt={`Post id#${post.id} - media 1`}
                  />
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
              </div>
              <div className="border-t-2 grid grid-rows-1 place-items-start h-auto">
                <div className="flex items-center flex-wrap p-0 w-full">
                  <AdminClassPostLikeButton props={post.id} />
                  <AdminClassExpand 
                    className=""
                    fetchRoute={route('admin.posts.teacher.class.comments.fetch', post.id)}
                    valueOne={post.comments.length}
                    modulePanel="admin"
                    value={students}
                    postId={post.id}
                  >
                    {post.id}
                  </AdminClassExpand>
                </div>
              </div>
            </div>
          ))}

        {myPostdata.length == 0 && <p className="text-center">No records found.</p>}
        {openLikesModal === true ? displayLikesInModal(selectedPostForLikes) : null}
      </div>
    </div>
  );
}
