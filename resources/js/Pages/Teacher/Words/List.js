import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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
  const deleteCustomFlaggedWord = (e, word) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this word? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('teacher.words.destroy', word.id)).then((response) => {
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

    axios.get(route('teacher.words.fetch', { page: page > 0 ? page + 1 : null })).then((response) => {
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

  const renderActionColumn = (params) => {
    const cols = [
      <GridActionsCellItem
        className="custom-table-ic-view"
        key="1"
        label=""
        icon={
          <Link className="text-blue-600 rounded-full" href={route('teacher.words.show', params.id)}>
            <VisibilityOutlinedIcon className="medium" />
          </Link>
        }
      />,
    ];
    if (params.row.teacher_id === props.auth.user.id && params.row.created_by === 'teacher') {
      cols.push(
        <GridActionsCellItem
          className="custom-table-ic-delete"
          label=""
          onClick={(e) => deleteCustomFlaggedWord(e, params)}
          icon={<DeleteOutlineOutlinedIcon className="medium text-red-500" />}
        />,
      );
    }
    return cols;
  };

  const allColumns = [
    {
      field: 'content_word',
      minWidth: 300,
      flex: 1,
      headerName: 'Content',
    },
    {
      field: 'description',
      minWidth: 300,
      flex: 1,
      headerName: 'Description',
    },
    {
      field: 'teacher_id',
      minWidth: 250,
      flex: 1,
      headerName: 'Added By',
      renderCell: (params) => (
        <>
          {params.row.teacher_id ? (
            <p className="text-sm">{`${params.row.owner.first_name} ${params.row.owner.last_name}`}</p>
          ) : (
            <p className="ml-2">admin</p>
          )}
        </>
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
      getActions: (params) => renderActionColumn(params),
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Own Flagged Words List'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Own flagged words list</h6>
                </div>

                <Link
                  href={route('teacher.words.create')}
                  className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                >
                  Add New Own Flagged Word
                </Link>
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
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'id', sort: 'desc' }],
                  },
                }}
                sx={{
                  '& .MuiDataGrid-toolbarContainer': {
                    marginLeft: '1rem',
                  },
                  '& .MuiDataGrid-toolbarContainer .MuiButton-root.MuiButton-text': {
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-columnHeaderTitle:last-child': {
                    marginRight: '1rem',
                  },
                  '& .actionColumn': {
                    marginLeft: '-0.75rem !important',
                  },
                  '& .MuiTablePagination-root': {
                    marginRight: '.75rem',
                  },
                }}
                disableColumnMenu={true}
              />
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
