import axios, { AxiosError } from 'axios';
import { HTTP_METHODS, SESSION_STORAGE_KEYS } from './constants';
import toast from 'react-hot-toast';
import { useState } from 'react';

// custom hook to handle the requests
const useAxios = () => {
  type errorType = AxiosError | any;
  const [isRequestPending, setIsRequestPending] = useState(false);
  const HttpRequestController = async (path: string, method = HTTP_METHODS.GET, payload: any = null) => {
    let url = 'http://localhost:9000' + path;
    let headers = {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN)
    };

    // check if any request already exists
    if (isRequestPending) {
      toast.error('Request is already in progress...!');
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

  const handleRequestError = (error: errorType) => {
    if (axios.isAxiosError(error)) {
      if (error.response)
        error.response
          ? toast.error(
            error.response.data.message
              ? error.response.data.message
              : error.response.statusText
          )
          : toast.error("Network error");
    } else {
      toast.error('An error occurred. Please try again.');
    }
  };

  return HttpRequestController;
};

export default useAxios;
