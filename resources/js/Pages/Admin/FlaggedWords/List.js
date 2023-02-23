import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import Authenticated from '@/Layouts/Authenticated';
import ViewModal from '@/Modals/ViewModal';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
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

const parse = require('html-react-parser');

export default function List(props) {
  const [allRows, setAllRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPageRowCount, setPerPageRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handlAddClick = (params, e) => {
    e.preventDefault();
    setShowModal(true);
    setDetails(params);
  };
  const fetchRows = () => {
    setIsLoading(true);

    axios.get(route('admin.flaggedWords.fetch', { page: page > 0 ? page + 1 : null })).then((response) => {
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

  const callbackModal = () => {
    setShowModal(false);
  };
  const popupModel = (params) => (
    <ViewModal
      closeModel={callbackModal}
      params={params}
      fetchRoute={route('admin.flaggedWords.history', params.row.id)}
    />
  );

  const [rowCountState, setRowCountState] = useState(totalRows || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) => (totalRows !== undefined ? totalRows : prevRowCountState));
  }, [totalRows, setRowCountState]);

  const allColumns = [
    {
      field: 'word_phrase',
      sortingOrder: ['desc', 'asc'],
      minWidth: 100,
      flex: 1,
      type: 'string',
      headerName: 'Word / Phrase',
      renderCell: (params) => (
        <>
          <ToolTip>{params.row.content.replace( /(<([^>]+)>)/ig, '')}</ToolTip>
        </>      
      ),
    },
    {
      field: 'word_usage',
      sortingOrder: ['desc', 'asc'],
      minWidth: 150,
      flex: 1,
      type: 'string',
      headerName: 'Usage Word',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
          <button
            onClick={(e) => handlAddClick(params, e)}
            className="text-sm text-blue-600 p-2 rounded hover:bg-blue-100 font-medium"
          >
            Details
          </button>
        </>
      ),
    },
    {
      field: 'word_used_by',
      sortingOrder: ['desc', 'asc'],
      minWidth: 100,
      flex: 1,
      type: 'string',
      headerName: 'Student Name',
      renderCell: (params) => (
        <Link
          className="text-sm text-blue-600 rounded hover:bg-blue-100 font-medium"
          href={route('admin.students.show', params.row.word_used_by.id)}
        >
          {`${params.row.word_used_by.first_name} ${params.row.word_used_by.last_name}`}
        </Link>
      ),
    },
  ];

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Flagged Words'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">View flagged words log</h6>
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
      {showModal ? popupModel(details) : null}
    </Authenticated>
  );
}
