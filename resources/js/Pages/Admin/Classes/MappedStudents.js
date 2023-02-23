import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function MappedStudents(props) {
  const removeStudentFromClass = (e, student) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to remove this student from the class? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Remove',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios
          .delete(route('admin.classes.removeStudentFromClass', [props.division.id, student.id]))
          .then((response) => {
              Swal.fire({
                title: 'Success !',
                text: response.data,
                icon: 'success',
              });
              window.history.back();

              setTimeout(() => {
                window.location.reload(false);
              }, 1500);
          });
      }
    });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">Students</h6>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border bg-blue-600 text-white">
              <th className="text-left py-4 px-6">First Name</th>
              <th className="text-left py-4 px-6">Last Name</th>
              <th className="text-left py-4 px-6">Email</th>
              <th className="py-4 px-6 flex items-center justify-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {props.students.length > 0 &&
              props.students.map((student, index) => (
                <tr className="border bg-white hover:bg-blue-100" key={index}>
                  <td className="py-4 px-6">{student.first_name}</td>
                  <td className="py-4 px-6">{student.last_name}</td>
                  <td className="py-4 px-6">{student.email}</td>
                  <td className="flex items-center justify-start py-4 px-6 space-x-4">
                    <Link
                      className="text-blue-600 hover:bg-blue-200 rounded-full p-1"
                      href={route('admin.students.show', student.id)}
                    >
                      <VisibilityOutlinedIcon />
                    </Link>
                    <Link
                      className="text-green-500 hover:bg-green-200 rounded-full p-1"
                      href={route('admin.students.edit', student.id)}
                    >
                      <ModeEditOutlineOutlinedIcon />
                    </Link>
                    <Link
                      className="text-red-600 hover:bg-red-200 rounded-full p-1"
                      href="#"
                      onClick={(e) => removeStudentFromClass(e, student)}
                      as="button"
                      method="delete"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Link>
                  </td>
                </tr>
              ))}

            {props.students.length <= 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 px-6">
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
