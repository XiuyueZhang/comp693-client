import axios from "axios";
import createAxioErrorHandler from "../errorHandler";

const api = axios.create({
    baseURL: "http://localhost:5050/",
});
// }

const { responseInterceptor } = createAxioErrorHandler();

api.interceptors.response.use(
    responseInterceptor.onSuccess,
    // responseInterceptor.onError
);

export default api;
