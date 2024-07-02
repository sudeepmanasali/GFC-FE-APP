
import axios, { AxiosError } from 'axios';
import { BACKEND_URL, HTTP_METHODS, SESSION_STORAGE_KEYS } from './constants';
import toast from 'react-hot-toast';

// custom hook to handle the requests
const useAxios = () => {
  const HttpRequestController = async (path: string, method = HTTP_METHODS.GET, body: any = null) => {
    let url = BACKEND_URL + path;
    let headers = {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN),
    };
    try {
      let response;
      switch (method.toUpperCase()) {
        case HTTP_METHODS.GET:
          response = await axios.get(url, { headers });
          break;
        case HTTP_METHODS.POST:
          response = await axios.post(url, body, { headers });
          break;
        case HTTP_METHODS.PUT:
          response = await axios.put(url, body, { headers });
          break;
        case HTTP_METHODS.DELETE:
          response = await axios.delete(url, { headers });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    } catch (error: AxiosError | any) {
      if (error.response)
        error.response
          ? toast.error(
            error.response.data.message
              ? error.response.data.message
              : error.response.statusText
          )
          : toast.error("Network error");
    }
  };

  return HttpRequestController;
};

export default useAxios;
