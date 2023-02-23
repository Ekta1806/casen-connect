import { usePage } from '@inertiajs/inertia-react';
import AdminDashboardCards from '@/Pages/Admin/AdminDashboardCards';
import TeacherDashboardCards from '@/Pages/Teacher/TeacherDashboardCards';

export default function HeaderStats(props) {
  const { component } = usePage();

  const isDashboardPageActive = () =>
    component === 'Admin/Dashboard' || component === 'Teacher/Dashboard' || component === 'Student/Dashboard/Index';

  return (
    <>
      {props.authGuard === 'admin' && isDashboardPageActive() && <AdminDashboardCards />}

      {props.authGuard === 'teacher' && isDashboardPageActive() && <TeacherDashboardCards />}
    </>
  );
}
