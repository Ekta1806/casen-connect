import React from 'react';
import { Link, Head } from '@inertiajs/inertia-react';
const LandingPage = (props) => {
  return (
    <div className="bg-logo  bg-gray-50">
      <div className="container mx-auto">
        <div className="min-h-auto md:min-h-screen flex flex-col sm:justify-center items-center p-4 pt-6 sm:pt-0">
        <div className="max-w-xs mt-10">
              <img  alt="logo" src="../images/casen-logo-img.png" className="logo-img w-40" />
            </div>
          <div className="flex flex-wrap justify-center  w-full px-0 md:px-6 py-6 bg-transparent overflow-hidden sm:rounded-lg">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
              <div className="m-3 p-6 bg-white rounded-2xl shadow-2xl">
                <div className="overflow-hidden">
                  <img
                    src="/images/students.jpg"
                    className="object-contain h-64 w-96 hover:scale-105 transition duration-200 ease-in-out"
                    alt="Sample Cover"
                  />
                </div>
                <div className="mt-3 flex justify-center">
                  <Link
                    href={route('student.login')}
                    className="py-2 px-4 mt-6 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Student Login
                  </Link>
                </div>
              </div>

              <div className="m-3 p-6 bg-white rounded-2xl shadow-2xl">
                <div className="overflow-hidden">
                  <img
                    src="/images/teacher.jpg"
                    className="object-contain h-64 w-96 hover:scale-105 transition-all duration-200 ease-in-out"
                    alt="Sample Cover"
                  />
                </div>
                <div className="mt-3 flex justify-center">
                  <Link
                    href={route('teacher.login')}
                    className="py-2 px-4 mt-6 bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 focus:ring-offset-orange-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Teacher Login
                  </Link>
                </div>
              </div>

              <div className="m-3 p-6 bg-white rounded-2xl shadow-2xl">
                <div className="overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-vector/competent-resume-writing-professional-cv-constructor-online-job-application-profile-creation-african-american-woman-filling-up-digital-form-concept-illustration_335657-2053.jpg?w=740&t=st=1665650704~exp=1665651304~hmac=36aa573144fd3d739872c2eb53e83923481f88eff8d6aa310de7493df2f5f27a"
                    className="object-contain h-64 w-96 hover:scale-105 transition-all duration-200 ease-in-out"
                    alt="Sample Cover"
                  />
                </div>
                <div className="mt-3 flex justify-center">
                  <Link
                    href={route('admin.login')}
                    className="py-2 px-4 mt-6 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
