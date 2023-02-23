import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import ToolTip from '@/Components/Tooltip';
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
  const deleteQuestion = (e, question) => {
    e.preventDefault();

    Swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this question? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('teacher.questions.destroy', question.id)).then((response) => {
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

    axios.get(route('teacher.questions.fetch', { page: page > 0 ? page + 1 : null })).then((response) => {
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

  const getTrackName = (params) => params.row.track.name;

  const getFormattedTrackName = (params) => params.value.name;

  const getIsAddedByTeacher = (params) => {
    if (params.row.teacher_id !== props.auth.user.id) {
      return 'Yes';
    }
    return 'No';
  };

  const getFormattedIsAddedByTeacherValue = (params) => {
    if (params.value !== props.auth.user.id) {
      return 'No';
    }
    return 'Yes';
  };

  const renderActionColumn = (params) => {
    const cols = [
      <GridActionsCellItem
        key="1"
        className="custom-table-ic-view"
        label=""
        icon={
          <Link className="text-blue-600 rounded-full" href={route('teacher.questions.show', params.id)}>
            <VisibilityOutlinedIcon className="medium" />
          </Link>
        }
      />,
    ];

    if (params.row.teacher_id === props.auth.user.id) {
      cols.push(
        <GridActionsCellItem
          className="custom-table-ic-edit"
          label=""
          icon={
            <Link className="text-green-500 rounded-full " href={route('teacher.questions.edit', params.id)}>
              <ModeEditOutlineOutlinedIcon className="medium" />
            </Link>
          }
        />,
        <GridActionsCellItem
          className="custom-table-ic-delete"
          label=""
          onClick={(e) => deleteQuestion(e, params)}
          icon={<DeleteOutlineOutlinedIcon className="medium text-red-500" />}
        />,
      );
    }

    return cols;
  };

  const allColumns = [
    {
      field: 'content',
      headerName: 'Content',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
      <ToolTip>{params.row.content}</ToolTip>
      ),
    },
    {
      field: 'level_id',
      minWidth: 150,
      flex: 1,
      headerName: 'Level',
      renderCell: (params) => (
        <p className="whitespace-pre-wrap">
          {params.row.level && params.row.level.name ? params.row.level.name : 'Not Define'}
        </p>
      ),
    },
    {
      field: 'track',
      renderCell: getTrackName,
      valueFormatter: getFormattedTrackName,
      minWidth: 80,
      flex: 1,
      type: 'string',
      headerName: 'Track',
    },
    {
      field: 'type',
      minWidth: 150,
      flex: 1,
      headerName: 'Type',
      renderCell: (params) => <p className="whitespace-pre-wrap">{params.row.type}</p>,
    },
    {
      field: 'teacher_id',
      minWidth: 150,
      flex: 1,
      headerClassName: 'header',
      headerName: 'Default Question?',
      renderCell: getIsAddedByTeacher,
      valueFormatter: getFormattedIsAddedByTeacherValue,
    },
    {
      field: 'actions',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 200,
      type: 'actions',
      headerName: 'Action',
      getActions: (params) => renderActionColumn(params),
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Questions'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Questions List</h6>
                </div>
                <Link
                  href={route('teacher.questions.create')}
                  className="inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all   "
                >
                  Add New Question
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
                disableSelectionOnClick
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
