import React from 'react';
import { Tab } from '@headlessui/react';

import Index from '../Dashboard/Index';
import { Link } from '@inertiajs/inertia-react';

import 'react-quill/dist/quill.snow.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Notification(props) {

  React.useEffect(() => {
    document.title = 'Notifications';
  }, []);

  return (
    <Index header={'Notifications'} className="bg-white">
      <div className="item-center mx-auto bg-white rounded-2xl shadow-md md:max-w-2xl overflow-y-auto h-96">
        <h2 className="p-4 mt-2 text-xl font-semibold border-b">
          Notifications{' '}
          <NotificationsNoneIcon className="text-blue-600 text-9xl place-content-center" fontSize="medium" />
        </h2>
        <Tab.Group>
          <Tab.List className="mx-2 my-4 flex space-x-1 rounded-full bg-blue-600 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-full py-2.5 text-sm font-semibold uppercase leading-5 text-white',
                  'hover:bg-gray-300',
                  selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                )
              }
            >
              All
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-full py-2.5 text-sm font-semibold uppercase leading-5 text-white',
                  'hover:bg-gray-300',
                  selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                )
              }
            >
              Unread
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              {props.notification.length ? (
                props.notification.map((notify) => (
                  <>
                    <div
                      className="flex flex-col md:flex-row items-start md:items-center w-full border-b p-4"
                      role="alert"
                    >
                      <div className="text-sm font-normal">
                        {notify.type.includes('TagNotification') && (
                          <Link
                            href={
                              notify.data.post_type === 'student_answer'
                                ? route('questions.review')
                                : 
                                  notify.data.post_type === 'teacher_post'
                                  ? route('classPost.show', notify.data.id)
                                  : 
                                  notify.data.post_type === 'teacher'
                                  ? route('teacher.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'student'
                                  ? route('student.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'admin_post'
                                  ? route('student.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'admin'
                                  ? route('admin.adminposts.show', notify.data.id)
                                : route('posts.show', notify.data.id)
                            }
                          >
                            <span className="font-bold">{notify.data.name}</span> {notify.data.data}
                          </Link>
                        )}
                        {notify.type.includes('ClassChangeNotification') && 
                            <>
                              <span className="font-bold">{notify.data.name}</span> {notify.data.data}
                            </>
                        }
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <p className="text-black text-lg text-bold p-2 m-8 mx-auto z-10" role="alert">
                      You have no notifications
                    </p>
                  </div>
                </>
              )}
            </Tab.Panel>

            <Tab.Panel>
              {props.unReadNotification.length ? (
                props.unReadNotification.map((notify) => (
                  <>
                    <div
                      className="flex flex-col md:flex-row items-start md:items-center w-full border-b p-4"
                      role="alert"
                    >
                      <div className="text-sm font-normal">
                        {notify.type.includes('TagNotification') && (
                          <Link
                            href={
                              notify.data.post_type === 'student_answer'
                                ? route('questions.review')
                                : 
                                  notify.data.post_type === 'teacher_post'
                                  ? route('classPost.show', notify.data.id)
                                  : 
                                  notify.data.post_type === 'teacher'
                                  ? route('teacher.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'student'
                                  ? route('student.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'admin_post'
                                  ? route('student.adminposts.show', notify.data.id)
                                  :
                                  notify.data.post_type === 'admin'
                                  ? route('admin.adminposts.show', notify.data.id)
                                : route('posts.show', notify.data.id)
                            }
                          >
                            <span className="font-bold">{notify.data.name}</span> {notify.data.data}
                          </Link>
                        )}
                        {notify.type.includes('ClassChangeNotification') && 
                            <>
                              <span className="font-bold">{notify.data.name}</span> {notify.data.data}
                            </>
                        }
                      </div>
                      <Link
                        className="text-blue-600 bg-blue-100 py-1 px-2 rounded-lg ml-0 md:ml-2 text-sm"
                        href={route('destroy.notification', notify.id)}
                        method="post"
                      >
                        Mark as read
                      </Link>
                    </div>
                  </>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-center">
                    <p className="text-black text-lg text-bold p-2 m-8 mx-auto z-10" role="alert">
                      You have no notifications
                    </p>
                  </div>
                </>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Index>
  );
}
