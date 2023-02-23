import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Link } from '@inertiajs/inertia-react';

export default function MappedStudents(props) {
  const renderActionColumn = (id) => {
    const cols = [
      <GridActionsCellItem
        key="1"
        className="custom-table-ic-view"
        label=""
        icon={
          <Link className="text-blue-600 rounded-full" href={route('teacher.students.show', id)}>
            <VisibilityOutlinedIcon className="medium" />
          </Link>
        }
      />,
      <GridActionsCellItem
        key="1"
        className="custom-table-ic-edit"
        label=""
        icon={
          <Link className="text-green-600 rounded-full" href={route('teacher.students.edit', id)}>
            <ModeEditOutlineOutlinedIcon className="medium" />
          </Link>
        }
      />,
    ];

    return cols;
  };

  const columns = [
    { field: 'first_name', headerName: 'First name', minWidth: 130 },
    { field: 'last_name', headerName: 'Last name', minWidth: 130 },
    { field: 'email', headerName: 'Email', minWidth: 170 },

    {
      field: 'actions',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      flex: 1,
      minWidth: 170,
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => renderActionColumn(params.id),
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
      <div className="rounded-t bg-white mb-0 px-4 py-4">
        <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
          <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
            <h6 className="text-black-600 text-lg font-semibold capitalize">Students List</h6>
          </div>
        </div>
      </div>
      <div  style={{ height: 264, width: '100%' }} className="w-100 custom-mapped-student">
      <DataGrid
        className="custom-export capitalize bg-white"
        rows={props.students.map((student, index) => ({
          id: student.id,
          student_id: student.id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
        }))}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      </div>
    </div>
  );
}
