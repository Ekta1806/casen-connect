import { Link } from '@inertiajs/inertia-react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function MappedClasses(props) {
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-center flex justify-between">
          <h6 className="text-black-600 text-lg font-semibold capitalize">Teacher&apos;s Class List</h6>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border bg-blue-600 text-white">
              <th className="text-left py-4 px-6">Name</th>
              <th className="py-4 px-6 flex items-center justify-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {props.classes.length > 0 &&
              props.classes.map((division, index) => (
                <tr className="border bg-white hover:bg-blue-100" key={index}>
                  <td className="py-4 px-6">{division.name}</td>
                  <td className="flex items-center justify-start py-4 px-6 space-x-4">
                    <Link className="text-blue-600 rounded-full" href={route('admin.classes.show', division.id)}>
                      <VisibilityOutlinedIcon className=" custom-table-ic-view medium" />
                    </Link>
                    <Link
                      className="text-green-500 rounded-full custom-table-ic-edit"
                      href={route('admin.classes.edit', division.id)}
                    >
                      <ModeEditOutlineOutlinedIcon className=" custom-table-ic-edit medium" />
                    </Link>
                  </td>
                </tr>
              ))}

            {props.classes.length == 0 && (
              <tr>
                <td colSpan="2" className="py-4 px-6 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
