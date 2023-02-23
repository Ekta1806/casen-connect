import React from 'react';
import FooterAdmin from '@/Pages/Partial/FooterAdmin';
import HomeIcon from '@mui/icons-material/Home';
import { Link, usePage } from '@inertiajs/inertia-react';
import StudentNavbar from '@/Pages/Partial/Navbar';
import { CardBarChart, Question, News, PostList, Card, CheckList } from '@/Components/Timelines/Details';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs } from '@mui/material';

const Index = (props) => {
  React.useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  const { auth } = usePage().props;
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
        <div className="sticky top-0 custom-navtopbar">
          <StudentNavbar />

          <nav className="bg-white shadow-lg px-4 md:px-10 py-2" aria-label="Breadcrumb">
            <ol className="flex justify-between">
              <Breadcrumbs
                className="text-white breadcrumbs"
                separator={<NavigateNextIcon className="text-gray-400 mt-2" />}
                aria-label="breadcrumb"
              >
                <Link
                  className="text-gray-600 bg-transparent text-sm inline-block rounded mt-2"
                  href={route(dashboardRoute)}
                >
                  {' '}
                  <HomeIcon className="text-sm pb-1 text-gray-600" /> Dashboard
                </Link>
                {props.header && props.header !== 'Dashboard' && (
                  <p className="mt-2 p-1 text-sm bg-transparent inline-block font-semibold text-blue-600 rounded">
                    {props.header}
                  </p>
                )}
              </Breadcrumbs>
              <span className="flex justify-end">
                {!props.children && <Card checklist={props.checklist}/>} 
                  </span>
            </ol>
          
          </nav>
        </div>
        <div className={`bg-gray-50 relative min-h-screen student-main-bg`}>
          <div className="pb-6 md:pb-12 pt-4 px-4">
            <div className="container mx-auto">
              <main>
                {!props.children ? (
                  <>
                    <div className="flex flex-wrap md:flex-nowrap">
                      <div className="w-full lg:w-3/12 xl:w-1/4 left-sec news-show">
                        <CheckList checklist={props.checklist}/>
                        <CardBarChart />
                        <News />
                      </div>
                      <div className="w-full lg:w-9/12 xl:w-10/12 middle-sec">
                        <Question />

                        <PostList
                          pinnedPost={props.pinnedPost}
                          adminPosts={props.adminPosts}
                          isFriday={props.isFriday}
                          students={props.students}
                          user={props.user}
                          teacher={props.teacher}
                          teacherPosts={props.teacherPosts}
                          checklist={props.checklist}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  props.children
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-transparent block mx-auto w-full footer-bg">
        <FooterAdmin />
      </footer>
    </>
  );
};
export default Index;
