import React from 'react';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditRoadOutlinedIcon from '@mui/icons-material/EditRoadOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import TurnSharpLeftOutlinedIcon from '@mui/icons-material/TurnSharpLeftOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';

import { Link, usePage } from '@inertiajs/inertia-react';

const NavSideBar = (props) => {
  const { component } = usePage();

  const isTracksLinkActive = () =>
    component === 'Admin/Tracks/List' ||
    component === 'Admin/Tracks/Create' ||
    component === 'Admin/Tracks/Show' ||
    component === 'Admin/Tracks/Edit';

  const isLevelsLinkActive = () =>
    component === 'Admin/Levels/List' ||
    component === 'Admin/Levels/Create' ||
    component === 'Admin/Levels/Show' ||
    component === 'Admin/Levels/Edit';

  const isTeachersLinkActive = () =>
    component === 'Admin/Teachers/List' ||
    component === 'Admin/Teachers/Create' ||
    component === 'Admin/Teachers/Show' ||
    component === 'Admin/Teachers/Edit';

  const isAdminsLinkActive = () =>
    component === 'Admin/Admins/List' ||
    component === 'Admin/Admins/Create' ||
    component === 'Admin/Admins/Show' ||
    component === 'Admin/Admins/Edit';

  const isStudentsLinkActive = () =>
    component === 'Admin/Students/List' ||
    component === 'Admin/Students/Create' ||
    component === 'Admin/Students/Show' ||
    component === 'Admin/Students/Edit';

  const  isAdminPostsLinkActive = () =>
    component === 'Teacher/AdminPosts/List' ||
    component === 'Teacher/AdminPosts/Create' ||
    component === 'Teacher/AdminPosts/Edit';

  const isClassesLinkActive = () =>
    component === 'Admin/Classes/List' ||
    component === 'Admin/Classes/Create' ||
    component === 'Admin/Classes/Show' ||
    component === 'Admin/Classes/Edit';

  const isQuestionsLinkActive = () =>
    component === 'Admin/Questions/List' ||
    component === 'Admin/Questions/Create' ||
    component === 'Admin/Questions/Show' ||
    component === 'Admin/Questions/Edit';

  const isIntakeQuestionsLinkActive = () => component === 'Admin/IntakeQuestions/Create';

  const isDailyQuestionsLinkActive = () =>
    component === 'Admin/DailyQuestions/List' ||
    component === 'Admin/DailyQuestions/Create' ||
    component === 'Admin/DailyQuestions/Show' ||
    component === 'Admin/DailyQuestions/Edit';

  const isAnswersLinkActive = () =>
    component === 'Admin/Answers/List' ||
    component === 'Admin/Answers/Create' ||
    component === 'Admin/Answers/Show' ||
    component === 'Admin/Answers/Edit';

  const isFlaggedWordsLinkActive = () => component === 'Admin/FlaggedWords/List';

  const isCustomFlaggedWordsLinkActive = () =>
    component === 'Admin/CustomFlaggedWords/List' ||
    component === 'Admin/CustomFlaggedWords/Create' ||
    component === 'Admin/CustomFlaggedWords/Show' ||
    component === 'Admin/CustomFlaggedWords/Edit';

  const isSiteSettingsLinkActive = () => component === 'Admin/SiteSettings/Index';

  const isNewsLinkActive = () =>
    component === 'Admin/News/List' ||
    component === 'Admin/News/Create' ||
    component === 'Admin/News/Show' ||
    component === 'Admin/News/Edit';

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
              href={route('admin.dashboard')}
              className="text-left pb-2 text-black-800 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold px-2 md:px-4 py-4 md:py-6 hover:text-blue-500"
            >
              Casen Connect
            </Link>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none pt-1">
              <li className="items-center">
                <Link
                  href={route('admin.dashboard')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    component === 'Admin/Dashboard'
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <TvOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Dashboard</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.tracks')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isTracksLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <EditRoadOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Tracks</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.levels')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isLevelsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <TurnSharpLeftOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Levels</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.admins')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isAdminsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <SupervisorAccountOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Admins</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.teachers')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isTeachersLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <CastForEducationOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Teachers</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.students')}
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
                  href={route('admin.adminposts')}
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
                  href={route('admin.classes')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isClassesLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <ClassOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Classes</span>
                  </div>
                </Link>
              </li>
              <li className="items-center">
                <Link
                  href={route('admin.questions')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isQuestionsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <HelpOutlineOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Question Bank</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.intakeQuestions')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isIntakeQuestionsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <LiveHelpOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Intake Question Bank</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.dailyQuestions')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isDailyQuestionsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <QuestionMarkOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Question Of The Day</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.flaggedWords')}
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
                  href={route('admin.customFlaggedWords')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isCustomFlaggedWordsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <BorderColorOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Own flagged words list</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.siteSettings')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isSiteSettingsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <SettingsOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Site Settings</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.news')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isNewsLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <NewspaperOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">News</span>
                  </div>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={route('admin.answers')}
                  className={`text-sm capitalize px-6 py-3 font-semibold block ${
                    isAnswersLinkActive()
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-100 rounded-none border-l-4 border-blue-600'
                      : 'text-black-800 hover:text-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 text-center text-base">
                      <QuestionAnswerOutlinedIcon className="text-blue-600" />
                    </span>
                    <span className="ml-3">Notes</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavSideBar;
