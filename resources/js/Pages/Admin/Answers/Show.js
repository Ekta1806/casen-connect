import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import ReadMore from '@/Components/ReadMore';

export default function Show(props) {
  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Notes'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-800 text-xl font-bold">Notes Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.answers.edit', props.answer.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Note
                  </Link>

                  <Link
                    href={route('admin.answers')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto p-4 md:p-6 pt-0 md:pt-0">
              <div className="flex flex-wrap space-y-4">
                <div className="flex w-full mt-4 space-x-2">
                  <div className="text-gray-500 font-semibold text-sm">Content:</div>
                  <div className="whitespace-pre-wrap break-all"><ReadMore>{props.answer.content}</ReadMore></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
