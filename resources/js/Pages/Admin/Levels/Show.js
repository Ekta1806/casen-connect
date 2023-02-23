import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';

export default function Show(props) {
  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Levels'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Level Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.levels.edit', props.level.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Level
                  </Link>

                  <Link
                    href={route('admin.levels')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto px-6 py-6 pt-0">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full rounded tracking-wide">
                <div className="font-bold">{props.level.name}</div>
                <div className="flex flex-wrap text-sm mt-2">{props.level.short_description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
