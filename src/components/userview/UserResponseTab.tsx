import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxios from 'utils/axios';
import { HTTP_METHODS, INTERNAL_SERVER_ERROR, LOADING, REQUEST_SUCCESS_MESSAGES, REQUEST_URLS, SOCKET_CHANNEL_NAMES } from 'utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import socket from 'utils/SocketManager';
import { Button } from '@mui/material';

type ResponseData = {
  id: number,
  username: string,
  submittedOn: string
}

export default function DataTable() {
  const navigate = useNavigate();
  let { HttpRequestController, handlePromiseRequest } = useAxios();
  let routeParams = useParams();
  let [isLoading, setLoading] = useState<boolean>(false);
  let [formResponses, setFormResponses] = useState<ResponseData | any>([]);
  let [rows, setRows] = useState<ResponseData | any>([]);

  let columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'username', headerName: 'User', flex: 2 },
    { field: 'submittedOn', headerName: 'Submitted Date & Time', flex: 2 },
    {
      field: "action",
      align: "center",
      flex: 2,
      headerName: "",
      sortable: false,
      renderCell: (params: any) => {
        const onClick = () => {
          navigate(`/response-form/${formResponses[params.row.id - 1].userId}/${routeParams.documentId}`);
        };
        return <Button variant="contained" color='success' onClick={onClick}>View</Button>;
      }
    }
  ];


  let idCounter = 0;
  const createRow = (username: string, submittedOn: string) => {
    return { id: ++idCounter, username, submittedOn };
  };

  const loadDocument = async () => {
    setLoading(true);
    let responseData = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${routeParams.documentId}`, HTTP_METHODS.GET);
    let rowsData = responseData.formResponses.map((formResponse: any) => {
      return createRow(formResponse.username, formResponse.submittedOn);
    });
    setFormResponses(responseData.formResponses);
    setRows(rowsData);

    // listening to get the user data
    socket.on(SOCKET_CHANNEL_NAMES.USER_RESPONSE, (newData: any) => {
      if (newData.documentId == routeParams.documentId) {
        let newFormResponse = createRow(newData.username, newData.submittedOn);
        setRows([...rowsData, newFormResponse]);
      }
    });
    setLoading(false);
  }

  React.useEffect(() => {
    handlePromiseRequest(loadDocument, LOADING, REQUEST_SUCCESS_MESSAGES.RESPONSE_LOADED_SUCCESSFULLY, INTERNAL_SERVER_ERROR);
  }, []);

  return (
    <div style={{ maxHeight: "1000", display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '50%' }}>
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
    </div>
  );
}
