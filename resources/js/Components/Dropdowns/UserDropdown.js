import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import Badge from '@mui/material/Badge';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { createPopper } from '../../../../node_modules/@popperjs/core';
import Tour from 'reactour';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';

const UserDropdown = () => {
  const url = window.location.href;

  const { auth } = usePage().props;
  // document.body.classList.add('disabled-body');

  const steps = [
    {
      selector: '#news',
      content: '☀️Read the news feed',
    },
    {
      selector: '#question',
      content: '☀️Answer the question of the day',
    },
    {
      selector: '#discussion',
      content: '☀️Answer the question in the discussion board',
    },
    {
      selector: '#classmates',
      content: '☀️Respond to two classmates posts',
    },
    {
      selector: '#news',
      content: "☀️Review the information from the news feed for tomorrow's daily question",
    },
  ];

  const [isTourOpen, setIsTourOpen] = useState(false);

  let logoutRoute = '';
  let settingsRoute = 'settings';
  if (auth.guardName === 'admin') {
    logoutRoute = 'admin.logout';
    settingsRoute = 'admin.settings';
  } else if (auth.guardName === 'teacher') {
    logoutRoute = 'teacher.logout';
    settingsRoute = 'teacher.settings';
  } else if (auth.guardName === 'student') {
    logoutRoute = 'student.logout';
    settingsRoute = 'student.settings';
  } else {
    logoutRoute = 'logout';
  }

  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    });

    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleChange = () => {
    setIsTourOpen(false);
    document.body.classList.remove('disabled-body');
   
  }

  const onHandle = () => {

    setIsTourOpen(true);
    document.body.classList.add('disabled-body');

  }

  const handleLogoutClick = (e) => {
    e.preventDefault();
    Inertia.post(route(logoutRoute));
  };

  return (
    <>
      {auth.guardName === 'student' && (
        <>
          {url.includes('home') && (
            <>
              <button
                className="news-show text-purple-700 bg-purple-200 mr-2 rounded-full p-2"
                onClick={onHandle}
              >
                <TourOutlinedIcon />
              </button>
              <Tour steps={steps} isOpen={isTourOpen} onRequestClose={handleChange} />
            </>
          )}

          <div className="md:flex custom-profile-dropdown hidden justify-between items-center">
            <div>
              <span className="justify-center font-semibold inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                Level - <span className="font-bold text-xl ml-1"> {auth.user.level_id} </span>
              </span>
            </div>
            <div className="flex justify-end min-w-max lozenge items-center py-1 px-2 border-r border-blue-400 pr-3 mr-3">
              <p className="text-white capitalize">Your class name is {auth.track.classes[0].name}</p>
            </div>
          </div>
        </>
      )}
      <span
        className="cursor-pointer	text-blueGray-500 capitalize block mr-0 sm:mr-2"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
        onKeyPress={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
        role="button"
        tabIndex="0"
      >
        <div className="items-center flex">
          <p className="text-white mr-2 truncate hover:text-clip xs:w-24 sm:w-28 md:w-auto text-right">
            {auth.user.first_name} {auth.user.last_name}
          </p>
          {auth.profilePicture && (
            <img
              alt={`${auth.user.first_name} ${auth.user.last_name}`}
              src={auth.profilePicture}
              className="object-cover rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center"
            />
          )}
          {!auth.profilePicture && (
            <div className="h-8 w-8 md:h-8 md:w-8 relative flex justify-center items-center rounded-full text-lg text-white uppercase bg-yellow-500">
              {auth.user.first_name.charAt(0)}
            </div>
          )}
        </div>
      </span>

      {(auth.guardName === 'student' || auth.guardName === 'teacher') && (
        <>
          <Link href={auth.guardName === 'student' ? route('show.notification') : route('teacher.show.notification')}>
            <Badge className="ml-2" badgeContent={auth.unReadNotification.length} color="primary">
              <button className="items-center border-l border-blue-400 pl-2 md:pl-3">
                <NotificationsNoneOutlinedIcon className="text-white" />
              </button>
            </Badge>
          </Link>
        </>
      )}
      <div
        ref={popoverDropdownRef}
        className={`${
          dropdownPopoverShow ? 'block ' : 'hidden '
        }custom-listing bg-white text-base z-50 float-left py-2 w-36 md:w-40 list-none text-left rounded shadow-lg mt-4`}
      >
        <Link
          href={route(settingsRoute)}
          className="text-sm py-2 px-4  w-full whitespace-nowrap bg-transparent font-bold block text-black-800 hover:text-blue-600 hover:bg-blue-100"
        >
          Settings
        </Link>
        <Link
          href="#pablo"
          className={
            'text-sm py-2 px-4  w-full whitespace-nowrap bg-transparent font-bold block text-black-800 hover:text-blue-600 hover:bg-blue-100'
          }
          onClick={(e) => handleLogoutClick(e)}
        >
          Logout
        </Link>
      </div>
    </>
  );
};

export default UserDropdown;
