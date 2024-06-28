
import axios from 'axios';
import { BACKEND_URL, HTTP_METHODS } from './constants';

// custom hook to handle the requests
const useAxios = () => {
  const HttpRequestController = async (path: string, method = HTTP_METHODS.GET, body: any = null) => {
    let url = BACKEND_URL + path;
    try {
      let response;
      switch (method.toUpperCase()) {
        case HTTP_METHODS.GET:
          response = await axios.get(url);
          break;
        case HTTP_METHODS.POST:
          response = await axios.post(url, body);
          break;
        case HTTP_METHODS.PUT:
          response = await axios.put(url, body);
          break;
        case HTTP_METHODS.DELETE:
          response = await axios.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data:`);
    }
  };

  return HttpRequestController;
};

export default useAxios;
