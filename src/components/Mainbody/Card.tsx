import React from "react";
import { useNavigate } from "react-router-dom";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import formimage from "../../assets/images/t-shirt.png";
import "./Mainbody.scss"
import { ROUTE_PATHS } from "../../utils/constants";

export const Card: React.FC<any> = ({ document }) => {
  console.log(document)
  const navigate = useNavigate();
  const openForm = (documentId: string) => {
    navigate(`/question-paper/${documentId}`);
  }

  return <div className="doc-card" onClick={() => {
    openForm(document._id);
  }}
  >
    <img src={formimage} alt="no-image" className="doc-image"></img>
    <div className="doc-content">
      <div className="doc-info">
        <p className="doc-name">{document.documentName}</p>
        <div className="doc-last-opened-time">
          <div className="content_left">
            <StorageSharpIcon className="storage-icon" />
            {document.createdOn}
          </div>
        </div>
      </div>

      <div className="doc-action">
        <MoreVertSharpIcon />
      </div>
    </div>
  </div>
}
