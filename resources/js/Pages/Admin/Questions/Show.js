import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';

export default function Show(props) {
  const { question } = props;

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Questions'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Question Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.questions')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-auto bg-gray-100 p-4 md:p-6">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full rounded">
                <div className="font-bold tracking-wide">Q: {props.question.content}</div>

                {question.type == 'multiple-choice' && (
                  <div className="sm:grid sm:grid-cols-2 sm:gap-2 mt-4">
                    {props.answers.length > 0 &&
                      props.answers.map((answer, i) => (
                        <div
                          className={
                            props.correctAnswer.option == `Option ${++i}`
                              ? 'bg-green-400 py-2 pl-2 rounded'
                              : 'py-2 pl-2'
                          }
                          key={i}
                        >
                          <div>{answer}</div>
                        </div>
                      ))}
                  </div>
                )}

                {question.type == 'descriptive' && (
                  <div className="flex flex-wrap text-sm mt-2">
                    <span>Answer should be between</span>
                    <span className="ml-1">{props.answersLength.minimum} words</span>
                    <span className="ml-1">and {props.answersLength.maximum} words.</span>
                  </div>
                )}

                <div className="flex flex-col justify-between mt-6">
                  <div className="tracking-wide">
                    Level:{' '}
                    <span className="text-blue-600 font-semibold capitalize">
                      {' '}
                      {props.question.level.name && props.question.level.name}
                    </span>
                  </div>
                  <div className="tracking-wide">
                    Track Name:{' '}
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold tracking-wide capitalize"
                      href={route('admin.tracks.show', question.track_id)}
                    >
                      <span className="text-blue-600 font-semibold">{question.track.name}</span>
                    </Link>
                  </div>
                  <div className="tracking-wide">
                    Question Type: <span className="text-blue-600 font-semibold capitalize">{question.type}</span>
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
