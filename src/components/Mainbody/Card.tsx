import React, { memo } from "react";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import StorageSharpIcon from '@mui/icons-material/StorageSharp';
import formimage from "../../assets/images/t-shirt.png";
import "./Mainbody.scss"

// displaying document name, created time on home page
export const Card: React.FC<any> = memo(({ document, openForm }) => {
  return <div className="doc-card" onClick={() => {

    // opens the document
    openForm(document._id);
  }}>
    <img src={formimage} alt="no-image" className="doc-image"></img>
    <div className="doc-content">
      <div className="doc-info">
        <p className="doc-name">{document.documentName}</p>
        <div className="doc-last-opened-time">
          <div className="content_left">
            <StorageSharpIcon className="storage-icon" />
            {document.updatedOn}
          </div>
        </div>
      </div>

      <div className="doc-action">
        <MoreVertSharpIcon />
      </div>
    </div>
  </div>
});
