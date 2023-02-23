import React from 'react';
import UserDropdown from '@/Components/Dropdowns/UserDropdown.js';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Drawer } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import TvIcon from '@mui/icons-material/Tv';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import NavSideBar from '@/Pages/Partial/NavSideBar';
import NavTeacherBar from '@/Pages/Partial/NavTeacherBar';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';

export default function Navbar() {
  const [state, setState] = React.useState({ left: false });
  const { component } = usePage();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const listing = () => (
    <nav className="rounded-tr-lg p-0 md:p-0 custom-navsidebar left-0 relative h-screen top-0 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-none bg-white w-60 md:w-72 py-4">
      <div className="">
        <div className="">
          <img alt="logo" className="mt-2 mx-auto" height="60" width="60" src="/images/casen-logo-img.png" />
          <Link
            href={route('student.home')}
            className="text-left pb-2 text-black-800 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-2 md:px-4 py-4 md:py-6 hover:text-blue-500"
          >
            Casen Connect
          </Link>
        </div>
        <div className='md:hidden custom-profile-dropdown flex flex-col justify-start items-start ml-2'>
            <div>
                <span className="justify-center font-semibold inline-flex items-center py-1 px-3 bg-blue-100 text-blue-600 rounded-full">Level - <span className="font-bold text-xl ml-1"> {auth.user.level_id} </span></span>
            </div>
            <div className="flex justify-end min-w-max lozenge items-center mt-1 mb-2">
                <p className= "text-sm capitalize">Your class name is <span className="font-bold"> {auth.track.classes[0].name} </span></p>
            </div>
        </div>
        <ul className="md:flex-col md:min-w-full flex flex-col list-none pt-1">
          <li className="items-center">
            <Link
              href={route('student.home')}
              className={`text-sm capitalize px-6 py-3 font-semibold block ${
                component === 'Student/Dashboard/Index'
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                  : 'text-black-800 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center text-base">
                  <TvIcon className="text-blue-600" />
                </span>
                <span className="ml-3">Dashboard</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href={route('student.posts')}
              className={`text-sm capitalize px-6 py-3 font-semibold block ${
                component === 'Student/Posts/Post'
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                  : 'text-black-800 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center text-base">
                  {' '}
                  <CropOriginalIcon className="text-blue-600" />
                </span>
                <span className="ml-3">My Posts</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href={route('members')}
              className={`text-sm capitalize px-6 py-3 font-semibold block ${
                component === 'Student/Classmates/Classmates'
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                  : 'text-black-800 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center text-base">
                  {' '}
                  <CastForEducationIcon className="text-blue-600" />
                </span>
                <span className="ml-3"> Class members</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              href={route('questions.review')}
              className={`text-sm capitalize px-6 py-3 font-semibold block ${
                component === 'Student/Questions/List'
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                  : 'text-black-800 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center text-base">
                  {' '}
                  <QuestionAnswerOutlinedIcon className="text-blue-600" />
                </span>
                <span className="ml-3">Past Questions</span>
              </div>
            </Link>
          </li>
          <li className='news-side'>
            <Link
              href={route('student.show.news')}
              className={`text-sm capitalize px-6 py-3 font-semibold block ${
                component === 'Student/Partial/New'
                  ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                  : 'text-black-800 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 text-center text-base">
                  {' '}
                  <NewspaperOutlinedIcon className="text-blue-600" props = "responsive" />
                </span>
                <span className="ml-3">News</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );

  const { auth } = usePage().props;

  return (
    <>
      <nav className="bg-blue-600 border-gray-200 px-2 sm:px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center ml-0 sm:ml-2 mx-2">
          <>
            <span className="flex items-center">
              <div className="bg-blue-100 mr-1 sm:mr-3 p-1 sm:p-2 rounded-full w-16 h-16">
                {auth.guardName === 'admin' && (
                  <Link href={route('admin.dashboard')}>
                    <img className="object-contain" alt="logo" src="/images/casen-logo-img.png" />
                  </Link>
                )}
                {auth.guardName === 'teacher' && (
                  <Link href={route('teacher.dashboard')}>
                    {' '}
                    <img className="object-contain" alt="logo" height="49" width="54" src="/images/casen-logo-img.png" />
                  </Link>
                )}
                {auth.guardName === 'student' && (
                  <Link href={route('student.home')}>
                    <img className="object-contain" alt="logo" height="49" width="54" src="/images/casen-logo-img.png" />
                  </Link>
                )}
              </div>
              <span className="self-center text-xl font-semibold whitespace-nowrap custom-nav-btn">
                {(auth.guardName === 'admin' || auth.guardName === 'teacher' || auth.guardName === 'student') && (
                  <React.Fragment key={'left'}>
                    <button
                      className="w-full hover:bg-transparent border-l border-blue-400 pl-1 sm:pl-3"
                      onClick={toggleDrawer('left', true)}
                    >
                      <MenuRoundedIcon className="text-white hover:bg-blue-100 hover:text-blue-700 rounded-full mr-0 sm:mr-3 text-xl ease-in-out duration-500" />
                    </button>
                    <Drawer
                      className="w-full transition-all"
                      anchor={'left'}
                      open={state.left}
                      onClose={toggleDrawer('left', false)}
                    >
                      {auth.guardName === 'student' && listing('left')}

                      {auth.guardName === 'admin' && <NavSideBar isHidden={!state.left} />}

                      {auth.guardName === 'teacher' && <NavTeacherBar isHidden={!state.left} />}
                    </Drawer>
                  </React.Fragment>
                )}
              </span>
            </span>
          </>
          <div className="flex items-center md:order-2">
            <UserDropdown />
          </div>
        </div>
      </nav>
    </>
  );
}
