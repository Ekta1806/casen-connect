import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';

export default function Show(props) {
  const { admin } = props;

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Admins'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Admin Details</h6>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={route('admin.admins.edit', admin.id)}
                    className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                  >
                    Edit This Admin
                  </Link>

                  <Link
                    href={route('admin.admins')}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-auto p-4 md:p-6 pt-0 md:pt-0">
              <div className="bg-white p-6 shadow my-6 mx-auto w-full rounded">
                <div className="flex flex-col items-start sm:flex-row">
                  {props.profilePicture !== false && (
                    <img
                      src={props.profilePicture}
                      alt={`${admin.first_name} ${admin.last_name}`}
                      className="w-36 block rounded-full sm:rounded"
                      loading="lazy"
                    />
                  )}

                  <div className={`tracking-wide ${props.profilePicture === false && 'p-0'}`}>
                    <div className="font-bold text-lg">
                      {admin.first_name} {admin.last_name}
                    </div>
                    <div className="text-gray-700 my-2">{admin.email}</div>
                    <div className="text-gray-700">{admin.contact_number}</div>
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
