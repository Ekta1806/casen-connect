import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import TvIcon from '@mui/icons-material/Tv';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

const NavSideBar = (props) => {
  const { component } = usePage();

  const isClassesLinkActive = () =>
    component === 'Teacher/Class/List' ||
    component === 'Teacher/Class/Create' ||
    component === 'Teacher/Class/Show' ||
    component === 'Teacher/Class/Edit';

  const isClassPostsLinkActive = () =>
    component === 'Teacher/ClassPosts/List' ||
    component === 'Teacher/ClassPosts/Create' ||
    component === 'Teacher/ClassPosts/Show' ||
    component === 'Teacher/ClassPosts/Edit';

  const isStudentsLinkActive = () =>
    component === 'Teacher/Students/List' ||
    component === 'Teacher/Students/Show' ||
    component === 'Teacher/Students/Edit';

  const  isAdminPostsLinkActive = () =>
    component === 'Teacher/AdminPosts/List';

  const isQuestionsLinkActive = () =>
    component === 'Teacher/Questions/List' ||
    component === 'Teacher/Questions/Create' ||
    component === 'Teacher/Questions/Show' ||
    component === 'Teacher/Questions/Edit';

  const isDailyQuestionsLinkActive = () =>
    component === 'Teacher/DailyQuestions/List' ||
    component === 'Teacher/DailyQuestions/Show' ||
    component === 'Teacher/DailyQuestions/Edit';

  const isWordLinkActive = () =>
    component === 'Teacher/Words/List' || component === 'Teacher/Words/Show' || component === 'Teacher/Words/Edit';

  const isModerationLinkActive = () => component === 'Teacher/Moderation/List';

  const isFlaggedWordsLinkActive = () => component === 'Teacher/FlaggedWords/List';

  return (
    <>
      <nav
        className={`rounded-tr-lg p-0 md:p-0 custom-navsidebar left-0 relative h-screen top-0 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-none bg-white w-60 md:w-72 py-4 ${
          props.isHidden === false ? 'block md:relative' : 'hidden'
        }`}
      >
        <div className="">
          <div className="">
            <img
              className="mt-2 mx-auto"
              height="60"
              width="60"
              src="/images/casen-logo-img.png"
              alt="Casen Connect Logo"
            />
            <Link
              href={route('teacher.dashboard')}
              className=" text-left pb-2 text-black-800 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-2 md:px-4 py-4 md:py-6 hover:text-blue-500"
            >
              Casen Connect
            </Link>
          </div>

          <ul className="md:flex-col md:min-w-full flex flex-col list-none pt-1">
            <li className="items-center">
              <Link
                href={route('teacher.dashboard')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  component === 'Teacher/Dashboard'
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

            <li className="items-center">
              <Link
                href={route('teacher.classes')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isClassesLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <LibraryBooksOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Classes</span>
                </div>
              </Link>
            </li>

            <li className="items-center">
              <Link
                href={route('teacher.classPosts')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isClassPostsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <CropOriginalIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Teacher&apos;s posts</span>
                </div>
              </Link>
            </li>

            <li className="items-center">
              <Link
                href={route('teacher.students')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isStudentsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <SchoolOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Students</span>
                </div>
              </Link>
            </li>

            <li className="items-center">
              <Link
                href={route('teacher.adminposts')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isAdminPostsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <CropOriginalIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Admin&apos;s posts</span>
                </div>
              </Link>
            </li>

            <li className="items-center">
              <Link
                href={route('teacher.questions')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isQuestionsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <QuestionAnswerOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Question Bank</span>
                </div>
              </Link>
            </li>

            <li className="items-center">
              <Link
                href={route('teacher.dailyQuestions')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isDailyQuestionsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <ContactSupportOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Question Of The Day</span>
                </div>
              </Link>
            </li>
            <li className="items-center">
              <Link
                href={route('teacher.flaggedWords')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isFlaggedWordsLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <BorderColorOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">View Flagged Words Log</span>
                </div>
              </Link>
            </li>
            <li className="items-center">
              <Link
                href={route('teacher.words')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isWordLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <BorderColorOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Own Flagged Words List</span>
                </div>
              </Link>
            </li>
            <li className="items-center">
              <Link
                href={route('teacher.moderation')}
                className={`text-sm capitalize px-6 py-3 font-semibold block ${
                  isModerationLinkActive()
                    ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                    : 'text-black-800 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 text-center text-base">
                    <RateReviewOutlinedIcon className="text-blue-600" />
                  </span>
                  <span className="ml-3">Posts Moderation</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavSideBar;
