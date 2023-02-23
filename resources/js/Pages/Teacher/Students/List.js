import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import 'sweetalert2/src/sweetalert2.scss';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
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
  const [allRows, setAllRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPageRowCount, setPerPageRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fetchRows = () => {
    setIsLoading(true);

    axios.get(route('teacher.students.fetch', { page: page > 0 ? page + 1 : null })).then((response) => {
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

  const allColumns = [
    {
      field: 'first_name',
      minWidth: 160,
      flex: 1,
      headerName: 'First Name',
    },
    {
      field: 'last_name',
      minWidth: 160,
      flex: 1,
      headerName: 'Last Name',
    },
    {
      field: 'email',
      minWidth: 200,
      flex: 1,
      headerName: 'Email',
    },
    {
      field: 'posts_count',
      minWidth: 150,
      flex: 1,
      headerName: 'Total Posts',
      renderCell: (params) =>
        params.row.posts_count > 0 ? (
          <Link
            className="text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
            href={route('teacher.students.show', params.id)}
          >
            {params.row.posts_count}
          </Link>
        ) : (
          <p className="ml-2">{params.row.posts_count}</p>
        ),
    },
    {
      field: 'Login As Student',
      minWidth: 150,
      flex: 1,
      headerName: 'Login As Student',
      renderCell: (params) => (
        <a
          className="text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
          href={route('teacher.student.store', params.id)}
          target="_blank"
          rel="noreferrer"
        >
          <LoginOutlinedIcon />
        </a>
      ),
    },
    {
      field: 'level_id',
      minWidth: 150,
      flex: 1,
      headerName: 'Level',
      renderCell: (params) => (
        <p>{params.row.level && params.row.level.name ? params.row.level.name : 'Not Defined'}</p>
      ),
    },
    {
      field: 'class',
      minWidth: 100,
      flex: 1,
      headerName: 'Classes',
      renderCell: (params) => (
        <a
          className="break-words text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
          href={route('teacher.classes.show', params.row.classes[0].id)}
          target="_blank"
          rel="noreferrer"
        >
          {params.row.classes[0].name}
        </a>
      ),
    },
    {
      field: 'actions',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 100,
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => [
        <GridActionsCellItem
           key="1"
          className="custom-table-ic-view"
          label=""
          icon={
            <Link className="text-blue-600 rounded-full" href={route('teacher.students.show', params.id)}>
              <VisibilityOutlinedIcon className="medium" />
            </Link>
          }
        />,
        <GridActionsCellItem
          key="2"
          className="custom-table-ic-edit"
          label=""
          icon={
            <Link className="text-green-600 rounded-full" href={route('teacher.students.edit', params.id)}>
              <ModeEditOutlineOutlinedIcon className="medium" />
            </Link>
          }
        />,
      ],
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Students'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Students List</h6>
                </div>
              </div>
            </div>

            <div className="w-100 overflow-x-auto">
              <DataGrid
                className="custom-export"
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
