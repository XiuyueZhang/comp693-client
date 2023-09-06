import axios from "axios";
import createAxioErrorHandler from "../errorHandler";

const api = axios.create({
  baseURL: "http://52.65.41.250:5050/",
});

// Set the headers for the Axios instance
api.defaults.headers.common['X-Powered-By'] = 'Express';
api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
api.defaults.headers.common['Content-Length'] = '4421';
api.defaults.headers.common['ETag'] = 'W/"1145-ch1oMN4YTPazInh3hbZNn6LHk3M"';
api.defaults.headers.common['Date'] = new Date().toUTCString();
api.defaults.headers.common['Connection'] = 'keep-alive';
api.defaults.headers.common['Keep-Alive'] = 'timeout=5';

const { responseInterceptor } = createAxioErrorHandler();

api.interceptors.response.use(
  responseInterceptor.onSuccess,
  // responseInterceptor.onError
);

export default api;
