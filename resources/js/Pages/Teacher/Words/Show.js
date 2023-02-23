import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';

export default function Show(props) {
  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Words'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Word Details</h6>
                </div>

                <Link
                  href={route('teacher.words')}
                  className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                >
                  Cancel
                </Link>
              </div>
            </div>

            <div className="flex-auto bg-gray-100 p-4 md:p-6">
              <div className="bg-white shadow p-4 my-2 mx-auto w-full rounded">
                <div className="font-bold mt-2">
                  Word : 
                  <span className="font-semibold ml-1">
                    {props.word.content_word}
                  </span>
                </div>
                <div className="font-bold mt-2">
                  Description :
                  <span className="ml-1 font-semibold">
                    {props.word.description}
                  </span> 
                </div>
                <div className="mt-2 font-bold">
                  Added by {props.word.created_by}:
                  <span className="font-semibold ml-1">
                    {props.addedBy.first_name} {props.addedBy.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
