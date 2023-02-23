import AdminNavbar from '@/Pages/Partial/Navbar';
import HeaderStats from '@/Pages/Partial/HeaderStats';
import FooterAdmin from '@/Pages/Partial/FooterAdmin';
import Titlebar from '@/Pages/Partial/Titlebar';
import NavSideBar from '@/Pages/Partial/NavSideBar';
import NavTeacherBar from '@/Pages/Partial/NavTeacherBar';
import { Breadcrumbs } from '@mui/material';
import { Link } from '@inertiajs/inertia-react';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function Authenticated({ auth, header, children }) {
  const { guardName } = auth;

  let dashboardRoute = '';
  if (auth.guardName === 'admin') {
    dashboardRoute = 'admin.dashboard';
  } else if (auth.guardName === 'teacher') {
    dashboardRoute = 'teacher.dashboard';
  } else if (auth.guardName === 'student') {
    dashboardRoute = 'student.home';
  }

  return (
    <>
      <div>
        {(() => {
          if (guardName === 'admin') {
            return <NavSideBar />;
          }
          if (guardName === 'teacher') {
            return <NavTeacherBar />;
          }
        })()}
      </div>
      <div className="sticky top-0 custom-navtopbar">
        <AdminNavbar header={header} />

        <Breadcrumbs
          className="bg-white px-4 md:px-10 py-2 border-b"
          separator={<NavigateNextIcon className="text-gray-400" />}
          aria-label="breadcrumb"
        >
          <Link className="text-gray-600 bg-transparent text-sm flex" href={route(dashboardRoute)}>
            <p className="text-gray-600 text-sm">
              {' '}
              <HomeIcon className="mb-1" /> Dashboard
            </p>
          </Link>

          {header && header !== 'Dashboard' && (
            <p className="p-1 text-sm bg-transparent inline-block font-semibold text-blue-600 rounded">{header}</p>
          )}
        </Breadcrumbs>
      </div>

      <div className="relative min-h-screen teacher-main-bg bg-no-repeat bg-right pb-6 md:pb-12 pt-4 px-4">
        <HeaderStats authGuard={guardName} />
        <div className="relative px-0 md:px-6 py-0 md:py-6 mx-auto w-full">
          <div className='container mx-auto'>
            <Titlebar title={header} />

            <main>{children}</main>
          </div>
        </div>
      </div>
      <footer className="block mx-auto w-full footer-bg bg-gray-50">
        <FooterAdmin />
      </footer>
    </>
  );
}
