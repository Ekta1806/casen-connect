import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import MappedClasses from './MappedClasses';
import MappedTeachers from './MappedTeachers';

export default function Show(props) {
  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Tracks'}>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-1/2">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-2xl rounded-xl bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Track Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.tracks.edit', props.track.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white  bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500 focus:outline-none ease-linear transition-all"
                  >
                    Edit This Track
                  </Link>

                  <Link
                    href={route('admin.tracks')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto p-4 md:p-6 pt-0 md:pt-0">
              <div className="bg-white shadow p-4 my-6 mx-auto w-full rounded">
                <div className="font-bold">{props.track.name}</div>
                <div className="mt-2">{props.track.short_description}</div>
              </div>
            </div>
          </div>

          <MappedClasses classes={props.classes} />
        </div>
        <div className="w-full xl:w-1/2 pl-0 xl:pl-8">
          <MappedTeachers teachers={props.teachers} />
        </div>
      </div>
    </Authenticated>
  );
}
