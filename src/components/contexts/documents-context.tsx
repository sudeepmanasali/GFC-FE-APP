import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useAxios from "utils/axios";
import { REQUEST_URLS, HTTP_METHODS, LOADING, REQUEST_SUCCESS_MESSAGES, REQUEST_FAILURE_MESSAGES } from "utils/constants";
import { debounce } from "utils/util";
import { useAuth } from "./auth-context";

// context to get all documents
const DocumentsNameContext = createContext<null | any>(null);

// provides the documents to child components
const DocumentsNameContextProvider: React.FC<any> = ({ children }) => {
  let { HttpRequestController, handlePromiseRequest } = useAxios();
  const [files, setFiles] = useState([]);
  let { isLoggedIn, user } = useAuth();

  // stores the filtered documents based on search key
  const [filteredFiles, setFilteredFiles] = useState(files);

  // retrives all the documents created by the user
  const getDocuments = useCallback(async () => {
    let res = await HttpRequestController(REQUEST_URLS.GET_ALL_DOCUMENTS, HTTP_METHODS.POST, { userId: user.userId });
    setFiles(res?.documents || []);
  }, [user]);

  useEffect(() => {
    setFilteredFiles(files || []);
  }, [files]);

  useEffect(() => {
    if (isLoggedIn) {
      handlePromiseRequest(getDocuments, LOADING, REQUEST_SUCCESS_MESSAGES.FORMS_LOADED_SUCCESSFULLY, REQUEST_FAILURE_MESSAGES.DOCUMENT_LOADING_FAILED);
    }
  }, [isLoggedIn]);

  // to filter documents based on search key entered by user
  const filterFiles = (value: string) => {
    const filtered = files.filter((item: any) =>
      item.documentName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFiles(filtered);
  }

  const handleInputChange = useCallback(debounce(filterFiles, 300), [filterFiles]);

  const contextValue = useMemo(() => ({
    files,
    filteredFiles,
    handleInputChange,
    setFiles
  }), [filteredFiles, isLoggedIn]);

  return (
    <DocumentsNameContext.Provider value={contextValue} >
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
