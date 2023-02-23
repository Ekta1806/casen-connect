import { useEffect, useState } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Link } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ToolTip from '@/Components/Tooltip';

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
        axios.delete(route('teacher.dailyQuestions.destroy', question.id)).then((response) => {

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

    axios.get(route('teacher.dailyQuestions.fetchAll', { page: page > 0 ? page + 1 : null })).then((response) => {
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

  const getClassName = (params) => (
    <Link
      className="font-semibold text-blue-600 hover:text-blue-800"
      href={route('teacher.classes.show', params.row.classes_id)}
    >
      {params.row.classes.name}
    </Link>
  );

  const getFormattedClassName = (params) => params.value.name;

  const getQuestionContent = (params) => params.row.question_details.content;

  const getQuestionType = (params) => params.row.question_details.type;

  const renderActionColumn = (params) => {
    const cols = [
      <GridActionsCellItem
        key="1"
        className="custom-table-ic-view"
        label=""
        icon={
          <Link className="text-blue-600 rounded-full" href={route('teacher.dailyQuestions.show', params.id)}>
            <VisibilityOutlinedIcon className="medium" />
          </Link>
        }
      />,
    ];

    if (params.row.teacher_id === props.auth.user.id && params.row.added_by === 'teacher') {
      cols.push(
        <GridActionsCellItem
          key="1"
          className="custom-table-ic-edit"
          label=""
          icon={
            <Link className="text-green-500 rounded-full " href={route('teacher.dailyQuestions.edit', params.id)}>
              <ModeEditOutlineOutlinedIcon className="medium" />
            </Link>
          }
        />,
        <GridActionsCellItem
          key="1"
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
      field: 'Question content',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <ToolTip>{params.row.question_details.content}</ToolTip>
        ),
    },

    {
      field: 'level_id',
      minWidth: 100,
      flex: 1,
      headerName: 'Level',
      renderCell: (params) => (
        <p>{params.row.level && params.row.level.name ? params.row.level.name : 'Not Defined'}</p>
      ),
    },
    {
      field: 'Type',
      minWidth: 150,
      flex: 1,
      renderCell: getQuestionType,
      valueGetter: getQuestionType,
    },

    {
      field: 'classes',
      renderCell: getClassName,
      valueGetter: getFormattedClassName,
      minWidth: 170,
      flex: 1,
      headerName: 'Class Details',
    },
    {
      field: 'priority',
      minWidth: 100,
      flex: 1,
      headerName: 'Priority',
    },
    {
      field: 'added_by',
      minWidth: 90,
      flex: 1,
      headerName: 'Added By',
    },
    {
      field: 'ask_on_date',
      minWidth: 100,
      flex: 1,
      headerName: 'Ask On',
    },
    {
      field: 'actions',
      minWidth: 170,
      type: 'actions',
      headerName: 'Action',
      headerAlign: 'left',
      align: 'left',
      getActions: (params) => renderActionColumn(params),
      cellClassName: 'actionColumn',
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Question Of The Day'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Question Of The Day List</h6>
                </div>

                <Link
                  href={route('teacher.dailyQuestions.create')}
                  className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
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
