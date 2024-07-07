import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxios from 'utils/axios';
import { HTTP_METHODS, REQUEST_URLS, SOCKET_CHANNEL_NAMES } from 'utils/constants';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import socket from 'utils/SocketManager';

type ResponseData = {
  id: number,
  username: string,
  submittedOn: string
}

export default function DataTable() {
  let [isLoading, setLoading] = useState<boolean>(false);
  let [rows, setRows] = useState<ResponseData | any>([]);
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'username', headerName: 'User' },
    { field: 'submittedOn', headerName: 'Submitted Date & Time', width: 170 }
  ];

  let params = useParams();
  let { HttpRequestController } = useAxios();

  let idCounter = 0;
  const createRow = (username: string, submittedOn: string) => {
    return { id: ++idCounter, username, submittedOn };
  };

  const loadDocument = async () => {
    setLoading(true);
    let { formResponses } = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${params.documentId}`, HTTP_METHODS.GET);
    let rowsData = formResponses.map((formResponse: any) => {
      return createRow(formResponse.username, formResponse.submittedOn);
    })
    setRows(rowsData);

    // listening to get the user data
    socket.on(SOCKET_CHANNEL_NAMES.USER_RESPONSE, (newData: any) => {
      if (newData.documentId == params.documentId) {
        let newFormResponse = createRow(newData.username, newData.submittedOn);
        console.log(newFormResponse, rowsData);
        setRows([...rowsData, newFormResponse]);
      }
    });
    setLoading(false);
  }

  React.useEffect(() => {
    toast.promise(
      loadDocument(),
      {
        loading: 'loading...',
        success: 'Responses loaded successfully',
        error: 'Internal Server Error'
      }
    );
  }, []);

  return (
    <div style={{ maxHeight: "1000", width: '100%' }}>
      {
        !isLoading && (<DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />)
      }
    </div>
  );
}
