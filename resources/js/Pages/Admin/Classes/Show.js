import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import MappedStudents from './MappedStudents';
import PostsList from './PostsList';

export default function Edit(props) {
  const students = props.students;
  const teachers = props.teachers;
  const studentsPosts = props.studentsPosts;
  const classes = props.class;

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Classes'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-1/2">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Class Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.classes.edit', classes.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Class
                  </Link>
                  <button
                    href="#"
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    onClick={back}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-auto p-4 md:p-6 pt-0 md:pt-0 class-teacher">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full rounded">
                <div className='flex flex-wrap'>
                  <span className="class-detail">Class Name:</span> 
                  <span className="font-bold">{classes.name}</span> 
                </div>
                <div className='flex flex-wrap'>
                  <span className="class-detail">Teachers:</span>  
                  {props.classTeacher.map((teacher, index) => (
                  <>
                    <span className="text-blue-600 hover:text-blue-800 font-semibold">{ (index ? ', ' : '') +teacher.first_name + ' '+  teacher.last_name}</span>
                  </>
                  ))}
                </div>
                <div className='flex flex-wrap'>
                    <span className="class-detail">Track:</span>  
                    <span>
                      <Link
                        href={route('admin.tracks.show', classes.track_id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {classes.track.name}
                      </Link>
                    </span>
                </div>
                <div className='flex flex-wrap'>
                  <span className="class-detail">Description:</span>
                  <span>{classes.description}</span>
                </div>
              </div>
            </div>
          </div>
          <MappedStudents students={props.studentsData} division={classes} />
        </div>
        <div className="w-full xl:w-1/2 pl-0 xl:pl-8">
          <PostsList students={studentsPosts} teachers={teachers} tagstudents={students}/>
        </div>
      </div>
    </Authenticated>
  );
}
