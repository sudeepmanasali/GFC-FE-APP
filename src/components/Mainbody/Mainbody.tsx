import { IconButton } from "@mui/material";
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import { FOLDER_VIEW_TYPE, HTTP_METHODS, REQUEST_URLS } from "../../utils/constants";
import "./Mainbody.scss";
import useAxios from "../../utils/axios";
import getUserInfo from "../../utils/auth-validate";
import { compareDesc, parseISO } from "date-fns";

export const Mainbody = () => {
  const [type, setType] = useState(FOLDER_VIEW_TYPE.FILE);
  const HttpRequestController = useAxios();
  const [files, setFiles] = useState([]);
  const { user } = getUserInfo();

  const getDocuments = async () => {
    let res = await HttpRequestController(REQUEST_URLS.GET_ALL_DOCUMENTS, HTTP_METHODS.POST, { username: user.username });
    const getDateTime = (dateTimeStr: string): Date => {
      return parseISO(dateTimeStr);
    };

    // sorting the documents based on the updated time
    res.documents.sort((doc1: any, doc2: any) => {
      const dateA = getDateTime(doc1.updatedOn);
      const dateB = getDateTime(doc2.updatedOn);
      return compareDesc(dateA, dateB);
    });
    setFiles(res.documents);
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
        <IconButton onClick={() => { setType(FOLDER_VIEW_TYPE.ROWS); }}>
          <StorageSharpIcon style={{ fontSize: "16px", color: "black" }} />
        </IconButton>
        <IconButton onClick={() => { setType(FOLDER_VIEW_TYPE.FILE); }}>
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
