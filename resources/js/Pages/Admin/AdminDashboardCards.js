import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

export default function AdminDashboardCards() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(route('admin.detailsInCard')).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className='container mx-auto'>
      <div className="px-0 md:px-6 py-0 md:py-6 mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <Link href={route('admin.dailyQuestions')}>
            <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
              <div className="flex flex-row justify-between items-start">
                <h5 className="mt-0 text-lg font-semibold text-black-500">Total Today&apos;s Questions</h5>
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
          <Link href={route('admin.customFlaggedWords')}>
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
              Total Own Flagged Words: {data.flaggedWordsCount}{' '}
              </p>
            </div>
          </Link>
          <Link href={route('admin.students')}>
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
          <Link href={route('admin.classes')}>
            <div className="shadow-xl rounded-lg p-5 bg-white border-1 border-blue-100">
              <div className="flex flex-row justify-between items-start">
                <h5 className="mt-0 text-lg font-semibold text-black-500">Total Classes</h5>
                <div className="right-box-text items-end">
                  <h6 className="custom-dash-student-icon-card">
                    <LibraryBooksOutlinedIcon className="text-pink-700 bg-pink-200 p-3 rounded-full justify-center top-0" />
                  </h6>
                </div>
              </div>
              <p className="text-sm font-semibold block  text-green-500">Total Classes: {data.classesCount}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
