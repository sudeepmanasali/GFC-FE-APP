import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAxios from 'utils/axios';
import { HTTP_METHODS, REQUEST_URLS } from 'utils/constants';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

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
  const loadDocument = async () => {
    setLoading(true);
    let { formResponses } = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${params.documentId}`, HTTP_METHODS.GET);
    setRows(formResponses.map((formResponse: any, index: number) => {
      return {
        id: index + 1,
        username: formResponse.username,
        submittedOn: formResponse.submittedOn,
      }
    }));
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
