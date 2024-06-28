import { IconButton } from "@mui/material";
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import { FOLDER_VIEW_TYPE, HTTP_METHODS, REQUEST_URLS } from "../../utils/constants";
import "./Mainbody.scss";
import useAxios from "../../utils/axios";

export const Mainbody = () => {
  const [type, setType] = useState(FOLDER_VIEW_TYPE.FILE);
  const HttpRequestController = useAxios();
  const [files, setFiles] = useState([]);

  const getDocuments = async () => {
    try {
      let res = await HttpRequestController(REQUEST_URLS.GET_ALL_DOCUMENTS, HTTP_METHODS.GET);
      setFiles(res.documents);
    } catch (error) {

    }
  }

  useEffect(() => {
    getDocuments();
  }, []);

  return <div className="docs-section">
    <div className="header">
      <div className="header-left">
        Recent forms
      </div>

      <div className="header-right">
        <IconButton
          onClick={() => {
            setType(FOLDER_VIEW_TYPE.ROWS);
          }}
        >
          <StorageSharpIcon style={{ fontSize: "16px", color: "black" }} />
        </IconButton>
        <IconButton
          onClick={() => {
            setType(FOLDER_VIEW_TYPE.FILE);
          }}
        >
          <FolderOpenSharpIcon style={{ fontSize: "16px", color: "black" }} />
        </IconButton>
      </div>
    </div>

    {type == FOLDER_VIEW_TYPE.FILE && (
      <div className="docs-container">
        {files && files.length > 0 ? (
          files.map((ele, i) => <Card key={'id' + i} document={ele} />)
        ) : (
          <div style={{ textAlign: "center", fontSize: "20px" }}>
            No records found
          </div>
        )}
      </div>
    )}
  </div>
}
