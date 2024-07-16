import axios, { AxiosError } from 'axios';
import { HTTP_METHODS, REQUEST_IN_PROGRESS, SESSION_STORAGE_KEYS } from './constants';
import toast from 'react-hot-toast';
import { useState } from 'react';

// custom hook to handle the requests
const useAxios = () => {
  type errorType = AxiosError | any;

  // used to know whether the request is completed or not
  const [isRequestPending, setIsRequestPending] = useState(false);

  // method to handle all type of api request ( GET, POST, PUT, DELETE )
  const HttpRequestController = async (path: string, method = HTTP_METHODS.GET, payload: any = null) => {
    // let url = 'https://gfc-be-app.onrender.com' + path;
    let url = 'http://localhost:9000' + path;

    // headers are set here, retrieves the jwt token from local storage 
    let headers = {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN)
    };

    // check if any request already exists
    if (isRequestPending) {
      toast.error(REQUEST_IN_PROGRESS);
      return;
    }

    setIsRequestPending(true);
    try {
      let response;
      switch (method.toUpperCase()) {
        case HTTP_METHODS.GET:
          response = await axios.get(url, { headers });
          break;
        case HTTP_METHODS.POST:
          response = await axios.post(url, payload, { headers });
          break;
        case HTTP_METHODS.PUT:
          response = await axios.put(url, payload, { headers });
          break;
        case HTTP_METHODS.DELETE:
          response = await axios.delete(url, { headers });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    } catch (error: errorType) {
      handleRequestError(error);
    } finally {
      setIsRequestPending(false);
    }
  };

  // handles the error, if api request fails for any reason
  const handleRequestError = (error: errorType) => {
    if (axios.isAxiosError(error)) {
      if (error.response)
        error.response
          ? toast.error(
            error.response.data.message
              ? error.response.data.message
              : error.response.statusText
          ) : toast.error("Network error");
    } else {
      toast.error('An error occurred. Please try again.');
    }
    throw new Error(error.message);
  };

  // handling the api request, and showing the 
  // success or error message after the request is completed
  const handlePromiseRequest = (method: Function, loadingMessage: string,
    successMessage: string, errorMessage: string): void => {
    toast.promise(
      method(),
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage
      }
    );
  }

  return { HttpRequestController, isRequestPending, handlePromiseRequest };
};

export default useAxios;
