import { Link } from '@inertiajs/inertia-react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function PostsList(props) {
  const { classList } = props;
  const { student } = props;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">
              {student.first_name} {student.last_name}
            </h6>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border bg-blue-600 text-white">
              <th className="text-left py-4 px-6">Class Name</th>
              <th className="py-4 px-6 flex items-center justify-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {classList.length > 0 &&
              classList.map((division, index) => (
                <tr className="border bg-white hover:bg-blue-100" key={index}>
                  <td className="py-4 px-6">{division.name}</td>
                  <td className="flex items-center justify-start py-4 px-6 space-x-4">
                    <Link
                      className="text-blue-600 hover:bg-blue-200 rounded-full p-1"
                      href={route('admin.classes.show', division.id)}
                    >
                      <VisibilityOutlinedIcon />
                    </Link>
                    <Link
                      className="text-green-500 hover:bg-green-200 rounded-full p-1"
                      href={route('admin.classes.edit', division.id)}
                    >
                      <ModeEditOutlineOutlinedIcon />
                    </Link>
                  </td>
                </tr>
              ))}

            {classList.length == 0 && (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center">
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
