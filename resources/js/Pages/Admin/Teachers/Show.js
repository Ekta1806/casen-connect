import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PostsList from './PostsList';
import MappedClasses from './MappedClasses';

export default function Show(props) {
  const posts  = props.teacher;
  const teacher_id = props.teacher_id.id;
  const teacher = props.teacher_id;
  const students = props.students;

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Teachers'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-1/2">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Teacher Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.teachers.edit', teacher_id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Teacher
                  </Link>

                  <Link
                    href={route('admin.teachers')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
            <div className="font-sans leading-tight bg-grey-lighter p-2 md:p-8">
              <div className="mb-2 max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="border-b px-2 sm:px-4 pb-2 md:pb-6">
                  <div className="text-left sm:text-left sm:flex m-2">
                    {props.profilePicture ? (
                      <img
                        className="h-12 w-12 md:w-16 md:h-16 rounded-full border-4 border-white mr-4"
                        src={props.profilePicture}
                        alt={`${teacher.first_name} ${teacher.last_name}`}
                      />
                    ) : (
                      <div className="h-12 w-12 md:w-16 md:h-16 relative flex justify-center items-center rounded-full text-3xl text-white uppercase bg-yellow-500">
                        {teacher.first_name.charAt(0)}
                      </div>
                    )}

                    <div className="ml-2 py-2">
                      <h3 className="flex font-bold text-xl">
                        {`${teacher.first_name} ${teacher.last_name}`}{' '}
                        {teacher.is_private == 1 && (
                          <div className="text-green-600 ml-1 mb-1">
                            <LockOutlinedIcon />
                          </div>
                        )}
                        {teacher.is_private == 0 && (
                          <div className="text-red-600 ml-1">
                            <LockOpenOutlinedIcon />
                          </div>
                        )}
                      </h3>
                      <div className="text-gray-700 my-2">Email: {teacher.email}</div>
                      <div className="text-gray-700">Phone Number: {teacher.contact_number}</div>
                      <div className="flex flex-col sm:flex-row">
                        {teacher.track && <span className="text-gray-700">Track: {teacher.track.name}</span>}
                      </div>
                      <div className="inline-flex text-grey-dark sm:flex items-center">
                        {teacher.is_active == 1 && (
                          <div className="text-green-500">
                            <ToggleOnIcon /> Active
                          </div>
                        )}
                        {teacher.is_active == 0 && (
                          <div className="text-red-600">
                            <ToggleOffIcon /> Not Active
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MappedClasses classes={props.classes} />
        </div>

        <div className="w-full xl:w-1/2 pl-0 xl:pl-8">
          <PostsList posts={posts} teacher={teacher} teacherProfilePicture={props.profilePicture} students={students} />
        </div>
      </div>
    </Authenticated>
  );
}
