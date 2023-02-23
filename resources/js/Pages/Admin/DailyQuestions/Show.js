import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import StudentAnswers from './StudentAnswers';

export default function Show(props) {
  const { question } = props;
  const questionDetails = question.question_details;
  const answers = [];
  Object.keys(questionDetails.answers).map((key) => {
    answers.push(questionDetails.answers[key]);
  });

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Daily Questions'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full lg:w-2/5 px-0 md:px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Question Details</h6>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.dailyQuestions')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto bg-gray-100 p-4 md:p-6">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full lg:w-3/4 xl:w-full rounded">
                <div className="flex flex-wrap justify-between">
                  <div className="tracking-wide">
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      href={route('admin.classes.show', question.classes_id)}
                    >
                      {props.classesDetails.name}
                    </Link>
                    <span className="mx-1 text-gray-700">by</span>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      href={route('admin.teachers.show', question.teacher_id)}
                    >
                      {`${props.teacherDetails.first_name} ${props.teacherDetails.last_name}`}
                    </Link>
                  </div>

                  <div className="tracking-wide">
                    {question.ask_on_date.toLocaleString('en-Us', {
                      hour12: false,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="font-bold tracking-wide mt-4">Q: {questionDetails.content}</div>

                <div className="sm:grid sm:grid-cols-2 sm:gap-2 m-2">
                  {answers.length > 0 &&
                    answers.map((answer, i) => (
                      <div
                        className={
                          questionDetails.correct_answer.option == `Option ${++i}`
                            ? 'bg-green-200 py-2 pl-2 rounded'
                            : 'py-2 pl-2'
                        }
                        key={i}
                      >
                        <div>{answer}</div>
                      </div>
                    ))}
                </div>

                {questionDetails.type == 'descriptive' && (
                  <div className="flex flex-wrap mt-2">
                    <span>Answer should be between</span>
                    <span className="ml-1">{questionDetails.descriptive_answer_length.minimum} words.</span>
                    <span className="ml-1">and {questionDetails.descriptive_answer_length.maximum} words.</span>
                  </div>
                )}

                <div className="flex flex-col justify-between mt-6">
                  {props.question.level.name && (
                    <div className="tracking-wide">
                      Level:{' '}
                      <Link
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        href={route('admin.levels.show', question.level_id)}
                      >
                        {' '}
                        {props.question.level.name && props.question.level.name}
                      </Link>
                    </div>
                  )}
                  <div className="tracking-wide">
                    Track Name:{' '}
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold tracking-wide"
                      href={route('admin.tracks.show', question.track_id)}
                    >
                      <span className="text-blue-600 font-semibold capitalize">{props.trackDetails.name}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StudentAnswers className="ml-2" question={question} answers={props.answers} />
      </div>
    </Authenticated>
  );
}
