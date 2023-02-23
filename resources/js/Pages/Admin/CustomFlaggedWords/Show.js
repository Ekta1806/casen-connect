import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';

export default function Show(props) {
  const getRoute = (content) => {
    if (content.created_by === 'admin') {
      return route('admin.admins.show', content.admin_id);
    }

    if (content.created_by === 'teacher') {
      return route('admin.teachers.show', content.teacher_id);
    }
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Own flagged words list'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Custom Flagged Word Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.customFlaggedWords')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto bg-gray-100 p-4 md:p-6">
              <div className="bg-white shadow p-4 mx-auto w-full rounded">
                <div className="font-bold mt-2">
                  Word : 
                  <span className="font-semibold ml-1">
                    {props.customFlaggedWord.content_word}
                  </span>
                </div>
                <div className="font-bold mt-2">
                  Description : 
                  <span className="font-semibold ml-1">
                    {props.customFlaggedWord.description}
                  </span>
                </div>
                <div className="font-bold mt-2">
                  Added by {props.customFlaggedWord.created_by}:
                  <Link
                    href={getRoute(props.customFlaggedWord)}
                    className="text-blue-600 hover:text-blue-800 font-semibold ml-1"
                  >
                    {props.addedBy.first_name} {props.addedBy.last_name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
