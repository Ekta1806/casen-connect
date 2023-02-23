import { React, useState, useEffect } from 'react';
import { Modal } from '@mui/material';

const ViewModal = (props) => {
  const { params } = props;
  const { fetchRoute } = props;
  const parse = require('html-react-parser');
  const [allRows, setAllRows] = useState([]);

  const fetchRows = () => {
    axios.get(fetchRoute).then((response) => {
      setAllRows(response.data);
    });
  };
  useEffect(() => {
    fetchRows();
  }, []);

  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className="d-flex w-full justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full md:w-2/4 lg:w-2/5 m-2">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h4 className="text-black-800 text-xl font-bold">{`${params.row.word_used_by.first_name} ${params.row.word_used_by.last_name}`}</h4>
            </div>
            {allRows.flaggedword &&
              allRows.flaggedword.map((word, index) => (
                <div key={index} className="flex flex-wrap flex-col xl:flex-row items-start justify-start">
                  <p className="ml-1 mt-2 text-md">{parse(word.content)}</p>
                  <span className="ml-1 mt-2 text-md text-gray-400">
                    {' '}
                    {new Date(word.created_at).toLocaleDateString('en-US', {
                      hour12: false,
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            <div className="relative p-3 flex-auto">
              <div className="flex justify-end m-2">
                <button
                  className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  type="button"
                  onClick={() => props.closeModel()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;
