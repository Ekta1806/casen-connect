import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';

export default function Show(props) {
  const { question } = props;
  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Questions'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Question Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.intakeQuestions.edit', props.question.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Question
                  </Link>

                  <Link
                    href={route('admin.intakeQuestions')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto bg-gray-100 p-4 md:p-6">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full rounded">
                <p className="w-full text-left text-lg font-bold text-black-600">Q. {question.content} </p>
                <div className="sm:grid sm:grid-cols-2 sm:gap-2">
                  <div className="py-2 pl-2">
                    <div className="mt-6 mb-6 flex flex-wrap">
                      <div
                        className={` rounded-lg mb-2 flex items-start w-1/2 ${
                          props.question.correct_answer == 'option_1' ? ' bg-green-300' : ''
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                        <span className="text-md text-dark-2 py-1">1.{props.question.option_1}</span>
                      </div>
                      <div
                        className={` rounded-lg mb-2 flex items-start w-1/2 ${
                          props.question.correct_answer == 'option_2' ? ' bg-green-300' : ''
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                        <span className="text-md text-dark-2 py-1">2.{props.question.option_2}</span>
                      </div>
                      <div
                        className={`rounded-lg mb-2 flex items-start w-1/2 ${
                          props.question.correct_answer == 'option_3' ? ' bg-green-300' : ''
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                        <span className="text-md text-dark-2 py-1">3.{props.question.option_3}</span>
                      </div>
                      <div
                        className={`rounded-lg mb-2 flex items-start w-1/2 ${
                          props.question.correct_answer == 'option_4' ? ' bg-green-300' : ''
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                        <span className="text-md text-dark-2 py-1">4.{props.question.option_4}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
