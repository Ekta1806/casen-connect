import ReadMore from '@/Components/ReadMore';
import { Link } from '@inertiajs/inertia-react';


export default function AnsweredQuestions(props) {
  const getCorrectAnswer = (answer) => {
    const chosenOption = answer.option_answer.toLowerCase().replace(' ', '_');
    const { options } = answer;

    const answerArr = [];
    Object.keys(options).filter(() => answerArr.push(options.answers[chosenOption]));

    return answerArr[0];
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">Answered Questions</h6>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border bg-blue-600 text-white">
              <th className="text-left py-4 px-6">Question Content</th>
              <th className="text-left py-4 px-6">Answered On</th>
              <th className="text-left py-4 px-6">Given Answer</th>
              <th className="text-left py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {props.answers.length > 0 &&
              props.answers.map((answer, index) => (
                <tr className="border bg-white hover:bg-blue-100" key={index}>
                  <td className="py-4 px-6">{answer.question_content}</td>
                  <td className="py-4 px-6">{new Date(answer.created_at).toLocaleDateString()}</td>
                  {answer.option_answer == null && answer.desc_answer != null && (
                    <>
                      <td className="py-4 px-6">
                        <ReadMore>{answer.desc_answer}</ReadMore>
                      </td>
                      <td className="py-4 px-6">
                        {answer.answer_approved != null && answer.answer_approved == 1 && (
                          <p className="text-green-500">Approved</p>
                        )}
                        {answer.answer_approved != null && answer.answer_approved == 0 && (
                          <p className="text-red-600">Rejected</p>
                        )}
                        {answer.answer_approved == null && <p className="text-yellow-600">Pending</p>}
                      </td>
                    </>
                  )}
                  {answer.option_answer != null && answer.desc_answer == null && (
                    <>
                      <td className="py-4 px-6">{getCorrectAnswer(answer)}</td>
                      <td className="">
                        <Link
                          className=""
                          href={route('admin.dailyQuestions.show', answer.question_id)}
                        >
                          {answer.status == 1 ? (
                            <p className="py-4 px-6 text-green-600 capitalize">Passed</p>
                          ) : (
                            <p className="py-4 px-6 text-yellow-600 capitalize">Pending</p>
                          )}{' '}
                        </Link>
                      </td>
                    </>
                  )}
                </tr>
              ))}

            {props.answers.length <= 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 px-6">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
