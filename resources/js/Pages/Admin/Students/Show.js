import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AnsweredQuestions from './AnsweredQuestions';
import MappedClasses from './MappedClasses';
import PostsList from './PostsList';

export default function Show(props) {
  const posts  = props.student;
  const student_id = props.student_id.id;
  const student = props.student_id;
  const students = props.students;

  const back = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Students'}>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="w-full xl:w-1/2">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Student Details</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={route('admin.students.edit', [student_id])}
                      className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600  border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                    >
                      Edit This Student
                    </Link>

                    <button
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                      onClick={back}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>

              <div className="font-sans leading-tight bg-grey-lighter p-6">
                <div className="mb-2 max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="border-b px-2 sm:px-4 pb-6">
                    <div className="text-left sm:text-left sm:flex m-2">
                      {props.profilePicture ? (
                        <img
                          className="h-24 w-24 rounded-full border-4 border-white mr-4"
                          src={props.profilePicture}
                          alt={`${student.first_name} ${student.last_name}`}
                        />
                      ) : (
                        <div className="w-12 h-12 relative flex justify-center items-center rounded-full text-2xl text-white uppercase bg-yellow-500">
                          {student.first_name.charAt(0)}
                        </div>
                      )}

                      <div className="ml-2 py-2">
                        <h3 className="flex font-bold text-xl">
                          {`${student.first_name} ${student.last_name}`}{' '}
                          {student.is_private == 1 && (
                            <div className="text-green-600 ml-1 mb-1">
                              <LockOutlinedIcon />
                            </div>
                          )}
                          {student.is_private == 0 && (
                            <div className="text-red-600 ml-1">
                              <LockOpenOutlinedIcon />
                            </div>
                          )}
                        </h3>
                        <div className="text-gray-700 my-2">{student.email}</div>
                        <div className="inline-flex text-grey-dark sm:flex items-center">
                          {student.is_active == 1 && (
                            <div className="text-green-500">
                              <ToggleOnIcon /> Active
                            </div>
                          )}
                          {student.is_active == 0 && (
                            <div className="text-red-600">
                              <ToggleOffIcon /> Not Active
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="flex font-bold text-xl mb-2">Academic details:</h3>
                    <div className="flex flex-col sm:flex-row">
                      {student.level && <span className="text-blue-500">Level: {student.level.name}</span>}
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row">
                      <span className="text-blue-500">Class Name: {student.classes[0].name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AnsweredQuestions answers={props.dailyQuestionAnswers} />
          </div>
          <div className="w-full xl:w-1/2 pl-0 xl:pl-8">
            <MappedClasses classList={props.classesList} student={student} />

            <PostsList posts={posts} student={student} students={students}/>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
