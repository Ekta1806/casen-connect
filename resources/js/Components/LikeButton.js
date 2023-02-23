import React, { useEffect, useState } from 'react';
import ApiService from '@/services/ApiService';
import { Checkbox } from '@mui/material';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Likes from '@/Modals/Likes';
import TeacherPostLikes from '@/Modals/TeacherPostLikes';
import AdminPostLikes from '@/Modals/AdminPostLikes';
import AdminLikes from '@/Modals/AdminLikes';

function LikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);


  const fetchData = (e) => {
    ApiService.post(route('likes', [e.target.value, e.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => <Likes post={post} closeModel={callbackModal} />;


  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('posts.likes.fetch', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

function ClassPostLikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);


  const fetchData = (e) => {
    ApiService.post(route('teacher.post.likes', [e.target.value, e.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => <Likes post={post} closeModel={callbackModal} />;

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('student.posts.likes', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}
function AdminLikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);

  const fetchData = (e) => {
    ApiService.post(route('admin.post.likes', [e.target.value, e.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => 
  <AdminPostLikes
    post={post}
    closeModel={callbackModal}
  />;


  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('admin.posts.showlikes', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

function AdminClassPostLikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);

  const fetchData = (e) => {
    ApiService.post(route('admin.classposts.likes', [e.target.value, e.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => 
  <AdminPostLikes
    post={post}
    closeModel={callbackModal}
  />;


  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('admin.classposts.showlikes', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

function TeacherLikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);

  const fetchData = (event) => {
    ApiService.post(route('teacher.classes.likes', [event.target.value, event.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => { 
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };
  
  const openLikeModal = (post) => <TeacherPostLikes post={post} closeModel={callbackModal} modulePanel="teacher" />;


  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('teacher.posts.likes.fetch', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}
      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

function TeacherClassPostLikeButton({ props }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);

  const fetchData = (event) => {
    ApiService.post(route('teacher.classPosts.likes', [event.target.value, event.target.checked]))
      .then(() => {
        setRefreshKey((oldKey) => oldKey + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => <Likes post={post} closeModel={callbackModal} />;


  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('teacher.posts.likes', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

function AdminPostLikeButton({ props, isFriday }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPostForLikes, setSelectedPostForLikes] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setAllLikes] = useState([]);
  const fetchData = (e) => {
    if(isFriday == true){
      ApiService.post(route('student.adminposts.likes', [e.target.value, e.target.checked]))
        .then(() => {
          setRefreshKey((oldKey) => oldKey + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const openModal = (post, e) => {
    e.preventDefault();
    setSelectedPostForLikes(post);
    setIsOpen(true);
  };

  const callbackModal = () => {
    setIsOpen(false);
  };

  const openLikeModal = (post) => <AdminLikes post={post} isFriday={isFriday} closeModel={callbackModal} />;

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('student.adminposts.showLikes', props)).then((res) => {
        setAllLikes(res.data);
      });
    };
    fetchData();
  }, [refreshKey]);
  return (
    <>
      {likes && likes.owner ? (
        <Checkbox
          value={props}
          id="like"
          icon={<FavoriteBorder />}
          checkedIcon={<Favorite className="fill-pink" />}
          name="checkedH"
          className="checked fill-pink"
          checked={true}
          onClick={fetchData}
        />
      ) : (
      <Checkbox
        value={props}
        id="like"
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        name="checkedH"
        className="checked"
        checked={false}
        onClick={fetchData}
      />
      )}

      {(likes.likes && likes.likes.length == 1 && (
        <button  onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
          {likes.likes && likes.likes.length} like
        </button>
      )) ||
        (likes.likes && likes.likes.length > 1 && (
          <button onClick={(e) => openModal(likes.likes, e)} className="hover:text-gray-400 text-black text-sm md:text-base">
            {likes.likes && likes.likes.length} likes
          </button>
        ))}
         {isOpen ? openLikeModal(selectedPostForLikes) : null}
    </>
    
  );
}

export { LikeButton, ClassPostLikeButton, AdminLikeButton, TeacherLikeButton, TeacherClassPostLikeButton, AdminPostLikeButton, AdminClassPostLikeButton};
