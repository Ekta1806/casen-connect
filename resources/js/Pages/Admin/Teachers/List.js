import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

const CustomToolbar = () => (
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

export default function List(props) {
  const deleteTeacher = (e, teacher) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this teacher? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('admin.teachers.destroy', teacher.id)).then((response) => {

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

  const [allRows, setAllRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPageRowCount, setPerPageRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fetchRows = () => {
    setIsLoading(true);

    axios.get(route('admin.teachers.fetch', { page: page > 0 ? page + 1 : null })).then((response) => {
      setIsLoading(false);
      setAllRows(response.data.rows);
      setTotalRows(response.data.total);
      setPerPageRowCount(response.data.perPageRowCount);
    });
  };
  useEffect(() => {
    fetchRows();
  }, [page]);

  const handlePageChange = (number) => {
    setPage(number);
  };

  const [rowCountState, setRowCountState] = useState(totalRows || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) => (totalRows !== undefined ? totalRows : prevRowCountState));
  }, [totalRows, setRowCountState]);

  const getTrackName = (params) => (
    <Link
      className="font-semibold text-blue-600 hover:text-blue-800"
      href={route('admin.tracks.show', params.row.track_id)}
    >
      {params.row.track.name}
    </Link>
  );

  const getFormattedTrackNae = (params) => params.value.name;

  const getIsActiveValue = (params) => {
    if (params.row.is_active == 0) {
      return <span className="text-red-600 bg-red-200 px-1 rounded"> No</span>;
    }

    return <span className="text-green-600 bg-green-200 px-1 rounded"> Yes</span>;
  };

  const getFormattedIsActive = (params) => {
    if (params.value == 0) {
      return 'No';
    }

    return 'Yes';
  };

  const allColumns = [
    {
      field: 'first_name',
      minWidth: 150,
      flex: 1,
      headerName: 'First Name',
    },
    {
      field: 'last_name',
      minWidth: 150,
      flex: 1,
      headerName: 'Last Name',
    },
    {
      field: 'email',
      minWidth: 200,
      flex: 1,
      type: 'string',
      headerName: 'Email',
    },
    {
      field: 'track',
      renderCell: getTrackName,
      valueGetter: getFormattedTrackNae,
      minWidth: 100,
      flex: 1,
      headerName: 'Track',
    },
    {
      field: 'classes_count',
      minWidth: 150,
      flex: 1,
      headerName: 'Total Classes',
      renderCell: (params) =>params.row.class_count > 0 ? (
          <Link
            className="text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
            href={route('admin.teachers.show', params.id)}
          >
            {params.row.class_count}
          </Link>
        ) : (
          <p className="ml-2">{params.row.class_count}</p>
        ),
    },
    {
      field: 'is_active',
      renderCell: getIsActiveValue,
      valueFormatter: getFormattedIsActive,
      minWidth: 100,
      flex: 1,
      headerName: 'Active ?',
    },
    {
      field: 'actions',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 200,
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => [
        <GridActionsCellItem
          key="1"
          className="custom-table-ic-view"
          label=""
          icon={
            <Link className="text-blue-600 rounded-full" href={route('admin.teachers.show', params.id)}>
              <VisibilityOutlinedIcon className="medium" />
            </Link>
          }
        />,
        <GridActionsCellItem
          key="1"
          className="custom-table-ic-edit"
          label=""
          icon={
            <Link className="text-green-500 rounded-full" href={route('admin.teachers.edit', params.id)}>
              <ModeEditOutlineOutlinedIcon className="medium" />
            </Link>
          }
        />,
        <GridActionsCellItem
          key="1"
          className="custom-table-ic-delete"
          label=""
          onClick={(e) => deleteTeacher(e, params)}
          icon={<DeleteOutlineOutlinedIcon className="text-red-500" />}
        />,
      ],
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Teachers'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Teachers List</h6>
                </div>

                <Link
                  href={route('admin.teachers.create')}
                  className="inline-flex items-center px-4 py-2 text-sm text-white rounded-full bg-blue-600 font-semibold  border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                >
                  Add New Teacher
                </Link>
              </div>
            </div>
            <div className="w-100 overflow-x-auto">
              <DataGrid
                className="custom-export capitalize"
                autoHeight
                columns={allColumns}
                rows={allRows}
                components={{ Toolbar: CustomToolbar }}
                pagination
                page={page}
                loading={isLoading}
                pageSize={perPageRowCount}
                rowsPerPageOptions={[perPageRowCount]}
                paginationMode="server"
                rowCount={rowCountState}
                onPageChange={handlePageChange}
                disableColumnMenu={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
