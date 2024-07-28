import { Button, IconButton, Tooltip } from "@mui/material";
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { FOLDER_VIEW_TYPE } from "../../utils/constants";
import "./Mainbody.scss";
import { useDocumentsName } from "components/contexts/documents-context";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function Mainbody() {
  // view document list in table or like files
  const [type, setType] = useState(FOLDER_VIEW_TYPE.FILE);
  const { filteredFiles } = useDocumentsName();
  const navigate = useNavigate();

  // opesn the document
  const openForm = (documentId: string) => {
    navigate(`/forms/${documentId}`, { state: { edit: true } });
  }

  let [rows, setRows] = useState<any>([]);

  let columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'documentName', headerName: 'Document Name', flex: 1 },
    { field: 'createdOn', headerName: 'Created On', flex: 2 },
    { field: 'updatedOn', headerName: 'Updated On', flex: 2 },
    {
      field: "action",
      align: "center",
      flex: 2,
      headerName: "",
      sortable: false,
      renderCell: (params: any) => {
        const onClick = () => {
          openForm(filteredFiles[params.row.id - 1]._id);
        };
        // button to open the document
        return <Button variant="contained" color="primary" onClick={onClick}>open</Button>;
      }
    }
  ];

  useEffect(() => {
    let data: { id: number, documentName: string; createdOn: string; updatedOn: string; }[] = [];
    filteredFiles.map((element: any, index: number) => {
      return data.push({ "id": index + 1, "documentName": element.documentName, "createdOn": element.createdOn, "updatedOn": element.updatedOn });
    });
    // showing the filtered files
    setRows(data);
  }, [filteredFiles]);

  return <div className="docs-section">
    <div className="header">
      <div className="header-left">
        Recent forms
      </div>

      <div className="header-right">
        <Tooltip title="Table View">
          <IconButton onClick={() => { setType(FOLDER_VIEW_TYPE.ROWS); }}>
            <StorageSharpIcon style={{ fontSize: "16px", color: "black" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Folder View">
          <IconButton onClick={() => { setType(FOLDER_VIEW_TYPE.FILE); }}>
            <FolderOpenSharpIcon style={{ fontSize: "16px", color: "black" }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>

    {/* document details will be displayed like files  */}
    {type == FOLDER_VIEW_TYPE.FILE && (
      <div className="docs-container">
        {filteredFiles && filteredFiles.length > 0 ? (
          filteredFiles.map((ele: any, i: string) => <Card key={'id' + i} document={ele} openForm={openForm} />)
        ) : (
          <div style={{ textAlign: "center", fontSize: "20px" }}>
            No records found
          </div>
        )}
      </div>
    )}

    {/* document details will be displayed inside table  */}
    {type == FOLDER_VIEW_TYPE.ROWS && (
      <div style={{ maxHeight: "1000", display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          {
            (<DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 7]}
            />)
          }
        </div>
      </div>
    )}
  </div>
}
