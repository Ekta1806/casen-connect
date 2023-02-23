import { useEffect, useState } from 'react';
import { Link,usePage } from '@inertiajs/inertia-react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

export default function TeacherDashboardCards() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(route('teacher.detailsInCard')).then((res) => {
      setData(res.data);
    });
  }, []);

  const { auth } = usePage().props;

  return (
    <div className="px-0 md:px-6 py-0 md:py-6 mx-auto w-full">
      <div className='container mx-auto'>
        <div className="flex flex-wrap justify-center md:justify-start">
          <div className="flex flex-wrap justify-center md:justify-start">
            <div className="grid grid-cols-1 w-full mb-4">
              <div className="shadow-xl rounded-lg p-5 pb-0 lg:pb-5 bg-white border-1 border-blue-100">
                <div className="flex flex-col lg:flex-row justify-between items-center">
                  <div className="w-full lg:w-1/3 que-bg-right order-last lg:order-first">
                    <img alt="welcome-teacher" src="/images/welcome-teacher.png" />
                  </div>
                  <div className="right-box-text items-end">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      welcome
                    </div>
                    <h5 className="text-xl font-bold text-blue-600 mb-2">
                    {`${auth.user.first_name} ${auth.user.last_name}`}
                    </h5>
                    <p className="text-base block text-black-500">
                      We would like to take this opportunity to welcome you to our practice and to thank you for choosing our physicians to participate in your healthcare. We look forward to providing you with personalized, comprehensive health care focusing on wellness and prevention.
                      </p>
                    </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-2 lg:gap-4 w-full md:w-full">
              <Link href={route('teacher.dailyQuestions')}>
                <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
                  <div className="flex flex-row justify-between items-start">
                    <h5 className="mt-0 text-lg font-semibold text-black-500">Total Daily Questions</h5>
                    <div className="right-box-text items-end">
                      <h6 className="custom-dash-student-icon-card">
                        <EventAvailableOutlinedIcon className="text-blue-700 bg-blue-200 p-3 rounded-full justify-center" />
                      </h6>
                    </div>
                  </div>
                  <p className="text-sm font-semibold block  text-green-500">
                    Total questions count: {data.dailyQuestionsCount}{' '}
                  </p>
                </div>
              </Link>
              <Link href={route('teacher.words')}>
                <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
                  <div className="flex flex-row justify-between items-start">
                    <h5 className="mt-0 text-lg font-semibold text-black-500">Total Own Flagged Words</h5>
                    <div className="right-box-text items-end">
                      <h6 className="custom-dash-student-icon-card">
                        <EditOffOutlinedIcon className="text-purple-700 bg-purple-200 p-3 rounded-full justify-center" />
                      </h6>
                    </div>
                  </div>
                  <p className="text-sm font-semibold block  text-green-500">
                    Total Own Flaggedwords count: {data.flaggedWordsCount}{' '}
                  </p>
                </div>
              </Link>
              <Link href={route('teacher.students')}>
                <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
                  <div className="flex flex-row justify-between items-start">
                    <h5 className="mt-0 text-lg font-semibold text-black-500">Total Students</h5>
                    <div className="right-box-text items-end">
                      <h6 className="custom-dash-student-icon-card">
                        <SchoolOutlinedIcon className="text-green-700 bg-green-200 p-3 rounded-full justify-center" />
                      </h6>
                    </div>
                  </div>
                  <p className="text-sm font-semibold block  text-green-500">Total Students: {data.studentsCount} </p>
                </div>
              </Link>
              <Link href={route('teacher.classes')}>
                <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
                  <div className="flex flex-row justify-between items-start">
                    <h5 className="mt-0 text-lg font-semibold text-black-500">Total Classes</h5>
                    <div className="right-box-text items-end">
                      <h6 className="custom-dash-student-icon-card">
                        <LibraryBooksOutlinedIcon className="text-pink-700 bg-pink-200 p-3 rounded-full justify-center" />
                      </h6>
                    </div>
                  </div>
                  <p className="text-sm font-semibold block  text-green-500">Total Classes: {data.classesCount}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
