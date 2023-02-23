import { Link } from '@inertiajs/inertia-react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function MappedTeachers(props) {
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-center flex justify-between">
          <h6 className="text-black-600 text-lg font-semibold capitalize">Teachers</h6>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border bg-blue-600 text-white">
              <th className="text-left py-4 px-6">First Name</th>
              <th className="text-left py-4 px-6">Last Name</th>
              <th className="text-left py-4 px-6">Email</th>
              <th className="py-4 px-6 flex items-center justify-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {props.teachers.length > 0 &&
              props.teachers.map((teacher, index) => (
                <tr className="border bg-white hover:bg-blue-100" key={index}>
                  <td className="py-4 px-6">{teacher.first_name}</td>
                  <td className="py-4 px-6">{teacher.last_name}</td>
                  <td className="py-4 px-6">{teacher.email}</td>
                  <td className="flex items-center justify-start py-4 px-6 space-x-4">
                    <Link
                      className="text-blue-600 rounded-full custom-table-ic-view"
                      href={route('admin.teachers.show', teacher.id)}
                    >
                      <VisibilityOutlinedIcon />
                    </Link>
                    <Link
                      className="text-green-500 rounded-full custom-table-ic-edit"
                      href={route('admin.teachers.edit', teacher.id)}
                    >
                      <ModeEditOutlineOutlinedIcon />
                    </Link>
                  </td>
                </tr>
              ))}

            {props.teachers.length <= 0 && (
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
  );
}
