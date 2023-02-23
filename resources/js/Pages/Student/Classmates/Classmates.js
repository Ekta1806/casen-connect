import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Index from '../Dashboard/Index';

function CustomToolbar() {
  return (
    <GridToolbarContainer className="flex justify-end items-center m-2">
      <GridToolbarExport
        className="export-button border-blue-600"
        printOptions={{
          hideFooter: true,
          hideToolbar: true,
        }}
      />
    </GridToolbarContainer>
  );
}

export default function ClassMates(props) {
  React.useEffect(() => {
    document.title = props._pageTitle;
  }, []);

  const columns = [
    {
      field: 'first_name',
      headerName: 'Name',
      flex: 1,
      minWidth: 100,

      renderCell: (params) => (
        <span className="whitespace-pre-wrap">
          {`${params.row.first_name} ${params.row.last_name}`}
        </span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'posts_count',
      headerName: 'Total Post',
      flex: 1,
      minWidth: 100,

      renderCell: (params) =>
        params.row.posts_count > 0 ? (
          <a
            className="text-sm text-blue-600 p-2 rounded font-medium hover:bg-blue-100"
            href={route('members.profile', params.row.student_id)}
          >
            {params.row.posts_count}
          </a>
        ): <p className="text-sm p-2 rounded font-medium hover:bg-blue-100">0</p>,
    },
    {
      field: 'level_id',
      headerName: 'Level',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'profile',
      headerName: 'Profile',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
        <a
          className="text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
          href={route('members.profile', params.row.student_id)}
        >
          View Profile
        </a>
        </>
      ),
    },
  ];

  return (
    <Index header={'Class Members'}>
      <div className="flex flex-wrap mt-0 md:mt-4">
        <div className="w-full px-0 md:px-4">
          <div className="relative flex flex-col min-w-0 break-words  mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left md:text-center flex">
                <h6 className="flex items-center text-black-600 text-lg font-semibold capitalize">
                  {props.members.classes[0].name} class conducted by{' '}
                  {/* {`${props.members.classes[0].teachers.first_name} ${props.members.classes[0].teachers.last_name}`}{' '} */}
                  {props.teachers.map((teacher, index) => (
                    <>
                    { (index ? ', ' : '') + `${teacher.first_name} ${teacher.last_name}` }
                    </>
                  ))}
                </h6>
                <div className="img-ic">
                  {' '}
                  <img alt="teacher" className="ml-2" width="38" height="38" src="/images/teaching.png"></img>
                </div>
              </div>
            </div>

            {props.members.classes.map((classDetail) => (
              <div className="" key={classDetail.id}>
                <div>
                  <DataGrid
                    className="custom-export"
                    autoHeight
                    rows={classDetail.students.map((student, index) => ({
                      id: index + 1,
                      student_id: student.id,
                      first_name: student.first_name,
                      last_name: student.last_name,
                      email: student.email,
                      posts_count: student.posts_count,
                      level_id: student.level && student.level.name,
                    }))}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Index>
  );
}
