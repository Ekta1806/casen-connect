import swal from 'sweetalert2';
import { Inertia } from '@inertiajs/inertia';

const Toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer);
    toast.addEventListener('mouseleave', swal.resumeTimer);
  },
});

const deleteRecord = (e, action) => {
  e.preventDefault();
  swal
    .fire({
      title: 'Are you sure?',
      text: 'You wont be able to revert this!',
      target: '#custom-target',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'position-absolute',
      },
      toast: true,
      position: 'bottom-center',
    })
    .then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(action).then(() => {
          let match = window.top.location.href.match(/\d+/);
          Toast.fire({
            icon: 'success',
            title: '',
            html: "<p class='text-lg'>Deleted successfully</p>",
          });
          window.top.location.href.toString().includes('home') && Inertia.visit(route('student.home'));
          window.top.location.href.toString().includes('post') && Inertia.visit(route('student.posts'));
          window.top.location.href.toString().includes('profile') && Inertia.visit(route('members.profile', match[0]))
        });
      }
    });
};
export default deleteRecord;
