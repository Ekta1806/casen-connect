import { Link, usePage } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

export default function AvatarCard(props) {
  const { auth } = usePage().props;

  const deleteProfileImage = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete your profile picture? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(props.deleteAvatarRoute).then((response) => {
        
            Swal.fire({
              title: 'Success !',
              text: response.data,
              icon: 'success',
            });

            setTimeout(() => {
              window.location.reload(false);
            }, 1500);
        });
      }
    });
  };

  return (
    <div className="mt-8 md:mt-14 py-4 px-4 md:px-6 bg-white shadow-lg rounded-lg my-4">
      <div className="flex justify-center md:justify-end -mt-10 md:-mt-16">
        {props.profilePicture !== false ? (
          <img
            src={props.profilePicture}
            alt={`${auth.user.first_name} ${auth.user.last_name}`}
            className="w-12 md:w-20 h-12 md:h-20 object-cover rounded-full border-2"
          />
        ) : (
          <div className="w-12 md:w-20 h-12 md:h-20 relative flex justify-center items-center rounded-full text-3xl md:text-4xl text-white uppercase bg-yellow-500">
            {auth.user.first_name.charAt(0)}
          </div>
        )}
      </div>
      {props.profilePicture !== false && (
        <div className="flex justify-center md:justify-end mt-2">
          <Link
            className="font-semibold bg-red-200 text-red-600 hover:text-red-900 p-2 rounded-md"
            href="#"
            onClick={deleteProfileImage}
            as="button"
            method="delete"
          >
            Delete Image
          </Link>
        </div>
      )}

      <div className='mt-2'>
        <Link href={route('teacher.classes.profile', auth.user.id)}>
          <h2 className="text-blue-500 text-base font-semibold capitalize hover:text-blue-800">
            <span className="text-gray-500 font-semibold">Name:</span> {auth.user.first_name} {auth.user.last_name}
          </h2>
        </Link>
        <p className="mt-1">
          <span className="text-gray-500 font-semibold">Email ID:</span> {auth.user.email}
        </p>
        <p className="mt-1">
          <span className="text-gray-500 font-semibold">Phone Number:</span> {auth.user.contact_number}
        </p>
      </div>
    </div>
  );
}
