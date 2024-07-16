import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Modal } from '@mui/material';
import { UserResponseView } from './UserResponseView';
import { useDocument } from 'components/contexts/questions-context';

export default function DataTable() {
  let { rows, formResponses, isRequestPending } = useDocument();
  const [open, setOpen] = React.useState(false);
  const [viewUserIdResponse, setViewUserIdResponse] = React.useState("");

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
          setViewUserIdResponse(formResponses[params.row.id - 1].userId._id);
          handleOpen();
        };
        return <Button variant="contained" color='success' onClick={onClick}>View</Button>;
      }
    }
  ];

  // to open and close the reponse modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div style={{ maxHeight: "1000", display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          {
            !isRequestPending && (<DataGrid
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
      <div>
        {/* displays the user reponse on click of view button from the table */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className='response-dialog-box'>
            <UserResponseView userId={viewUserIdResponse} />
          </div>
        </Modal>
      </div>
    </>
  );
}
