import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import ReadMore from '@/Components/ReadMore';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export default function StudentAnswers(props) {
  const approveRejectAnswer = (e, answer, approveReject) => {
    e.preventDefault();

    axios.patch(route('admin.dailyQuestions.approveRejectAnswer', [answer.id, approveReject])).then((res) => {
     
        Swal.fire({
          title: 'Success !',
          text: `Answer ${approveReject} successfully.`,
          icon: 'success',
        });

        setTimeout(() => {
          window.location.reload(false);
        }, 1500);

      if (res.data.status == 'failed') {
        Swal.fire({
          title: 'Failed !',
          text: 'Answer not found.',
          icon: 'error',
        });
      }
    });
  };

  return (
    <div className="px-0 md:px-4 w-full lg:w-3/5">
      <div className="justify-start relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
        <div className="rounded-t bg-white mb-0 px-4 py-4">
          <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
            <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
              <h6 className="text-black-600 text-lg font-semibold capitalize">Student Answers</h6>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border bg-blue-600 text-white">
                <th className="text-left py-4 px-6">Student Name/Email</th>
                <th className="text-left py-4 px-6">Answered On</th>
                <th className="text-left py-2 px-6">Status</th>
                {props.question.question_details.type == 'descriptive' && (
                  <>
                    <th className="text-left py-4 px-6">Answer</th>
                    <th className="py-4 px-6">Action</th>
                  </>
                )}
                {props.question.question_details.type == 'multiple-choice' && (
                  <>
                    <th className="py-4 px-6">Attempts Count</th>
                    <th className="py-4 px-6">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {props.answers.length > 0 &&
                props.answers.map((answer, index) => (
                  <tr className="border bg-white hover:bg-blue-100" key={index}>
                    <td className="py-4 px-6">
                      {answer.student.first_name} {answer.student.last_name}
                      <br />
                      {answer.student.email}
                    </td>
                    <td className="py-4 px-6">{new Date(answer.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-6">
                      {answer.status == 1 && answer.answer_approved == 1 && <span>Passed</span>}
                      {answer.status == 1 && answer.answer_approved == 0 && <span>Failed</span>}
                      {answer.status == 1 && answer.answer_approved == null && <span>Pending</span>}
                    </td>
                    {props.question.question_details.type == 'descriptive' && (
                      <>
                        <td className="py-4 px-6">
                          <ReadMore>{answer.desc_answer}</ReadMore>
                        </td>
                        <td className="flex items-center justify-center py-4 px-6 space-x-4">
                          {answer.answer_approved == null && (
                            <>
                              <Link
                                className="font-semibold p-1 hover:bg-green-200 rounded-full"
                                href="#"
                                onClick={(e) => approveRejectAnswer(e, answer, 'approved')}
                                as="button"
                                method="patch"
                              >
                                <CheckIcon className="text-green-500 hover:bg-green-200 rounded-full" />
                              </Link>
                              <Link
                                className="font-semibold p-1 hover:bg-red-200 rounded-full"
                                href="#"
                                onClick={(e) => approveRejectAnswer(e, answer, 'rejected')}
                                as="button"
                                method="patch"
                              >
                                <ClearIcon className="text-red-600 hover:bg-red-200 rounded-full" />
                              </Link>
                            </>
                          )}
                          {answer.answer_approved != null && answer.answer_approved == 1 && (
                            <p className="text-green-500">Approved</p>
                          )}
                          {answer.answer_approved != null && answer.answer_approved == 0 && (
                            <p className="text-red-600">Rejected</p>
                          )}
                        </td>
                      </>
                    )}
                    {props.question.question_details.type == 'multiple-choice' && (
                      <>
                        <td className="py-2 px-6 text-center">{answer.attempt}</td>
                        <td className="flex items-center justify-center py-4 px-6 space-x-4">
                          {answer.answer_approved == null && (
                            <>
                              <Link
                                className="font-semibold p-1 hover:bg-green-200 rounded-full"
                                href="#"
                                onClick={(e) => approveRejectAnswer(e, answer, 'approved')}
                                as="button"
                                method="patch"
                              >
                                <CheckIcon className="text-green-500 hover:bg-green-200 rounded-full" />
                              </Link>
                              <Link
                                className="font-semibold p-1 hover:bg-red-200 rounded-full"
                                href="#"
                                onClick={(e) => approveRejectAnswer(e, answer, 'rejected')}
                                as="button"
                                method="patch"
                              >
                                <ClearIcon className="text-red-600 hover:bg-red-200 rounded-full" />
                              </Link>
                            </>
                          )}
                          {answer.answer_approved != null && answer.answer_approved == 1 && (
                            <p className="text-green-500">Approved</p>
                          )}
                          {answer.answer_approved != null && answer.answer_approved == 0 && (
                            <p className="text-red-600">Rejected</p>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}

              {props.answers.length <= 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 px-6">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
