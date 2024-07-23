import { createContext, useContext, useEffect, useState } from "react";
import getUserInfo from "utils/auth-validate";
import useAxios from "utils/axios";
import { REQUEST_URLS, HTTP_METHODS, LOADING, REQUEST_SUCCESS_MESSAGES, REQUEST_FAILURE_MESSAGES } from "utils/constants";
import { debounce } from "utils/util";

// context to get all documents
const DocumentsNameContext = createContext<null | any>(null);

// provides the documents to child components
const DocumentsNameContextProvider: React.FC<any> = ({ children }) => {
  let { HttpRequestController, handlePromiseRequest } = useAxios();
  const [files, setFiles] = useState([]);

  // stores the filtered documents based on search key
  const [filteredFiles, setFilteredFiles] = useState(files);
  const { user } = getUserInfo();

  // retrives all the documents created by the user
  const getDocuments = async () => {
    let res = await HttpRequestController(REQUEST_URLS.GET_ALL_DOCUMENTS, HTTP_METHODS.POST, { userId: user.userId });
    setFiles(res?.documents || []);
  }

  useEffect(() => {
    setFilteredFiles(files || []);
  }, [files]);

  useEffect(() => {
    handlePromiseRequest(getDocuments, LOADING, REQUEST_SUCCESS_MESSAGES.FORMS_LOADED_SUCCESSFULLY, REQUEST_FAILURE_MESSAGES.DOCUMENT_LOADING_FAILED);
  }, []);

  // to filter documents based on search key entered by user
  const filterFiles = (value: string) => {
    const filtered = files.filter((item: any) =>
      item.documentName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFiles(filtered);
  }

  const handleInputChange = debounce(filterFiles, 300);

  return (
    <DocumentsNameContext.Provider value={{ files, filteredFiles, filterFiles, handleInputChange, setFiles }} >
      {children}
    </DocumentsNameContext.Provider>
  );
}

const useDocumentsName = () => {
  const context = useContext(DocumentsNameContext);
  if (context === undefined)
    throw new Error("DocumentNamesContext was used outside of the DocumentsNameContextProvider");
  return context;
}

export { DocumentsNameContextProvider, useDocumentsName };
